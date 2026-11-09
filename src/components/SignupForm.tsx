import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react'
import { Check, CircleAlert, Copy, Loader2, Lock, Share2 } from 'lucide-react'
import {
  isValidEmail,
  isValidName,
  normalizeEmail,
  normalizeName,
} from '../../supabase/functions/_shared/waitlist-rules.ts'
import { ERROR_MESSAGES, submitWaitlist } from '../lib/waitlistApi.ts'
import { getStoredReferral } from '../lib/referral.ts'
import { config, isSignupConfigured, privacyHref } from '../config.ts'
import { TurnstileWidget } from './TurnstileWidget.tsx'

type Status = 'idle' | 'submitting' | 'success'
type Field = 'firstName' | 'lastName' | 'email'

interface Errors {
  firstName?: string
  lastName?: string
  email?: string
  consent?: string
  captcha?: string
  form?: string
}

/** The id of the first field, so other parts of the page can send people straight to it. */
export const SIGNUP_FIRST_FIELD_ID = 'waitlist-first-name'

export function SignupForm() {
  const uid = useId()
  const ids = {
    firstName: SIGNUP_FIRST_FIELD_ID,
    lastName: `${uid}-last`,
    email: `${uid}-email`,
    consent: `${uid}-consent`,
    consentError: `${uid}-consent-error`,
    captchaError: `${uid}-captcha-error`,
    hint: `${uid}-hint`,
    success: `${uid}-success`,
  }

  const [values, setValues] = useState<Record<Field, string>>({ firstName: '', lastName: '', email: '' })
  const [consent, setConsent] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [awaitingCaptcha, setAwaitingCaptcha] = useState(false)

  const inFlight = useRef(false)
  /** Set when the visitor pressed submit before Turnstile finished; we submit as soon as it does. */
  const submitWhenReady = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const refs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  }
  const consentRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const formAlertRef = useRef<HTMLDivElement>(null)
  /** Fields are disabled while submitting, so focus after a server error waits for the re-render. */
  const focusAfterRender = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'idle' && focusAfterRender.current) {
      focusAfterRender.current.focus()
      focusAfterRender.current = null
    }
  }, [status, errors])

  useEffect(() => {
    if (token && submitWhenReady.current) {
      submitWhenReady.current = false
      formRef.current?.requestSubmit()
    }
  }, [token])

  const resetCaptcha = useCallback(() => {
    setToken(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleToken = useCallback((t: string) => {
    setToken(t)
    setAwaitingCaptcha(false)
    setErrors((e) => ({ ...e, captcha: undefined }))
  }, [])

  const handleExpire = useCallback(() => {
    setToken(null)
  }, [])

  const handleCaptchaError = useCallback((kind: 'load' | 'challenge') => {
    setToken(null)
    setErrors((e) => ({
      ...e,
      captcha:
        kind === 'load'
          ? 'The security check couldn’t load. Please disable content blockers for this page or try another browser.'
          : 'The security check ran into a problem. It will retry automatically. If it keeps failing, refresh the page.',
    }))
  }, [])

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((x) => ({ ...x, [field]: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current || status !== 'idle') return

    const firstName = normalizeName(values.firstName)
    const lastName = normalizeName(values.lastName)
    const email = normalizeEmail(values.email)
    const next: Errors = {}
    if (!firstName) next.firstName = 'Please enter your first name.'
    else if (!isValidName(firstName)) next.firstName = 'Please use letters only in your first name.'
    if (!lastName) next.lastName = 'Please enter your last name.'
    else if (!isValidName(lastName)) next.lastName = 'Please use letters only in your last name.'
    if (!email) next.email = 'Please enter your email address.'
    else if (!isValidEmail(email)) next.email = ERROR_MESSAGES.invalid_email
    if (!consent) next.consent = ERROR_MESSAGES.consent_required
    // A load/challenge error is shown as-is; otherwise we simply wait for Turnstile.
    if (!token && errors.captcha) next.captcha = errors.captcha

    setErrors(next)
    const firstInvalid = (['firstName', 'lastName', 'email'] as const).find((f) => next[f])
    if (firstInvalid) return refs[firstInvalid].current?.focus()
    if (next.consent) return consentRef.current?.focus()
    if (!token) {
      if (!next.captcha) {
        submitWhenReady.current = true
        setAwaitingCaptcha(true)
      }
      return
    }

    inFlight.current = true
    setStatus('submitting')
    const result = await submitWaitlist({
      firstName,
      lastName,
      email,
      consent: true,
      turnstileToken: token,
      referralSource: getStoredReferral(),
    })
    inFlight.current = false

    if (result.ok) {
      setStatus('success')
      return
    }

    // Every server response consumes the Turnstile token, so always get a fresh one.
    resetCaptcha()
    setStatus('idle')
    const message = ERROR_MESSAGES[result.error]
    if (result.error === 'invalid_name') {
      setErrors({ firstName: message })
      focusAfterRender.current = refs.firstName.current
    } else if (result.error === 'invalid_email') {
      setErrors({ email: message })
      focusAfterRender.current = refs.email.current
    } else if (result.error === 'consent_required') {
      setErrors({ consent: message })
      focusAfterRender.current = consentRef.current
    } else if (result.error.startsWith('captcha_')) {
      setErrors({ captcha: message })
    } else {
      setErrors({ form: message })
      focusAfterRender.current = formAlertRef.current
    }
  }

  if (status === 'success') {
    return (
      <SignupSuccess
        headingRef={successRef}
        headingId={ids.success}
        firstName={normalizeName(values.firstName)}
        email={normalizeEmail(values.email)}
      />
    )
  }

  if (!isSignupConfigured) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-azure p-5 text-sm text-copy">
        The waitlist form isn’t configured yet. Please check back soon.
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Join the Ellivia waitlist"
      aria-busy={submitting}
      className="w-full"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          inputRef={refs.firstName}
          id={ids.firstName}
          label="First name"
          name="given-name"
          autoComplete="given-name"
          value={values.firstName}
          error={errors.firstName}
          disabled={submitting}
          onChange={(v) => update('firstName', v)}
        />
        <TextField
          inputRef={refs.lastName}
          id={ids.lastName}
          label="Last name"
          name="family-name"
          autoComplete="family-name"
          value={values.lastName}
          error={errors.lastName}
          disabled={submitting}
          onChange={(v) => update('lastName', v)}
        />
      </div>
      <div className="mt-4">
        <TextField
          inputRef={refs.email}
          id={ids.email}
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          value={values.email}
          error={errors.email}
          disabled={submitting}
          describedBy={ids.hint}
          onChange={(v) => update('email', v)}
        />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          ref={consentRef}
          id={ids.consent}
          name="consent"
          type="checkbox"
          checked={consent}
          disabled={submitting}
          onChange={(e) => {
            setConsent(e.target.checked)
            if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }))
          }}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? ids.consentError : undefined}
          required
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-ink"
        />
        <label htmlFor={ids.consent} className="cursor-pointer text-left text-[15px] leading-snug text-copy">
          Email me when Ellivia launches. My name and email will only be used for Ellivia launch updates, and I can
          ask to be removed at any time.{' '}
          <a href={privacyHref} className="font-medium text-link underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.consent && <FieldError id={ids.consentError}>{errors.consent}</FieldError>}

      <div className="mt-4">
        <TurnstileWidget resetKey={resetKey} onToken={handleToken} onExpire={handleExpire} onError={handleCaptchaError} />
        {errors.captcha && <FieldError id={ids.captchaError}>{errors.captcha}</FieldError>}
        {awaitingCaptcha && !token && !errors.captcha && (
          <p className="mt-2 text-sm text-copy" role="status">
            Finishing the security check. Your signup will continue automatically.
          </p>
        )}
      </div>

      <div ref={formAlertRef} tabIndex={-1} role="alert" aria-live="assertive" className="focus:outline-none">
        {errors.form && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-[15px] text-danger">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>{errors.form}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-mint-2 px-6 text-[17px] font-semibold text-ink shadow-soft ring-1 ring-ink/10 transition hover:bg-mint-3 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
      >
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span>Joining…</span>
          </>
        ) : (
          <span>Join the Free Waitlist</span>
        )}
      </button>

      <p id={ids.hint} className="mt-4 flex items-center gap-2 text-sm text-muted">
        <Lock className="size-4 shrink-0" aria-hidden="true" />
        Free to join. Never upload bills or medical information here.
      </p>
    </form>
  )
}

function TextField({
  inputRef,
  id,
  label,
  value,
  error,
  disabled,
  describedBy,
  onChange,
  type = 'text',
  ...rest
}: {
  inputRef: RefObject<HTMLInputElement | null>
  id: string
  label: string
  value: string
  error?: string
  disabled: boolean
  describedBy?: string
  onChange: (value: string) => void
  type?: string
  name: string
  autoComplete: string
  inputMode?: 'email' | 'text'
  placeholder?: string
  maxLength?: number
}) {
  const errorId = `${id}-error`
  const describe = [error ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-left text-[15px] font-semibold text-ink">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        required
        maxLength={rest.maxLength ?? 80}
        autoCapitalize={type === 'email' ? 'none' : 'words'}
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describe}
        name={rest.name}
        autoComplete={rest.autoComplete}
        inputMode={rest.inputMode}
        placeholder={rest.placeholder}
        className={`h-13 w-full rounded-2xl border bg-white px-4 text-[17px] text-ink shadow-soft transition placeholder:text-muted focus:outline-none focus-visible:outline-none focus:ring-4 disabled:opacity-60 ${
          error ? 'border-danger focus:ring-danger/15' : 'border-line hover:border-baby-2 focus:border-ink-2 focus:ring-baby/70'
        }`}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-left text-[15px] text-danger">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function SignupSuccess({
  headingRef,
  headingId,
  firstName,
  email,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>
  headingId: string
  firstName: string
  email: string
}) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}${config.baseUrl}`
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function share() {
    try {
      if (canShare) {
        await navigator.share({
          title: 'Ellivia',
          text: 'Ellivia is a free iOS app (coming soon) to help families explore hospital financial assistance.',
          url: shareUrl,
        })
        return
      }
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      /* user cancelled the share sheet or clipboard blocked: nothing to do */
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="animate-pop rounded-3xl border border-success/15 bg-success-soft/60 p-6 text-left sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-success text-white" aria-hidden="true">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <h3 ref={headingRef} id={headingId} tabIndex={-1} className="text-xl font-semibold tracking-tight text-ink focus:outline-none">
            You’re on the list, {firstName}.
          </h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-copy">
            We’ll send Ellivia launch updates to <strong className="break-all font-semibold text-ink">{email}</strong>.
            If this address was already on the waitlist, nothing changes and you won’t get duplicate messages.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-success/10 pt-5">
        <p className="text-[15px] text-copy">Know someone who could use Ellivia?</p>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-medium text-ink shadow-soft transition hover:border-baby-2 active:scale-[0.98]"
        >
          {canShare ? <Share2 className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? 'Link copied' : canShare ? 'Share Ellivia' : 'Copy link'}
        </button>
        <span className="sr-only" role="status">
          {copied ? 'Link copied to clipboard' : ''}
        </span>
      </div>
    </section>
  )
}
