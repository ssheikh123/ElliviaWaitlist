import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react'
import { ArrowRight, Check, CircleAlert, Copy, Loader2, Lock, Share2 } from 'lucide-react'
import { isValidEmail, normalizeEmail } from '../../supabase/functions/_shared/waitlist-rules.ts'
import { ERROR_MESSAGES, submitWaitlist } from '../lib/waitlistApi.ts'
import { getStoredReferral } from '../lib/referral.ts'
import { config, isSignupConfigured, privacyHref } from '../config.ts'
import { TurnstileWidget } from './TurnstileWidget.tsx'

type Status = 'idle' | 'submitting' | 'success'

interface Errors {
  email?: string
  consent?: string
  captcha?: string
  form?: string
}

export interface SignupFormProps {
  /** Distinguishes the two forms on the page for analytics-free a11y labelling. */
  placement: 'hero' | 'footer'
}

export function SignupForm({ placement }: SignupFormProps) {
  const uid = useId()
  const ids = {
    email: `${uid}-email`,
    emailError: `${uid}-email-error`,
    consent: `${uid}-consent`,
    consentError: `${uid}-consent-error`,
    captchaError: `${uid}-captcha-error`,
    hint: `${uid}-hint`,
    success: `${uid}-success`,
  }

  const [email, setEmail] = useState('')
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
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const formAlertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current || status !== 'idle') return

    const normalized = normalizeEmail(email)
    const next: Errors = {}
    if (!normalized) next.email = 'Please enter your email address.'
    else if (!isValidEmail(normalized)) next.email = ERROR_MESSAGES.invalid_email
    if (!consent) next.consent = ERROR_MESSAGES.consent_required
    // A load/challenge error is shown as-is; otherwise we simply wait for Turnstile.
    if (!token && errors.captcha) next.captcha = errors.captcha

    setErrors(next)
    if (next.email) return emailRef.current?.focus()
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
      email: normalized,
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
    if (result.error === 'invalid_email') {
      setErrors({ email: message })
      emailRef.current?.focus()
    } else if (result.error === 'consent_required') {
      setErrors({ consent: message })
      consentRef.current?.focus()
    } else if (result.error.startsWith('captcha_')) {
      setErrors({ captcha: message })
    } else {
      setErrors({ form: message })
      formAlertRef.current?.focus()
    }
  }

  if (status === 'success') {
    return <SignupSuccess headingRef={successRef} headingId={ids.success} email={normalizeEmail(email)} />
  }

  if (!isSignupConfigured) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-ice p-5 text-sm text-slate-copy">
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
      aria-label={placement === 'hero' ? 'Join the Ellivia waitlist' : 'Join the Ellivia waitlist (bottom of page)'}
      aria-busy={submitting}
      className="w-full"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={ids.email} className="sr-only">
            Email address
          </label>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={254}
            placeholder="you@example.com"
            value={email}
            disabled={submitting}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((x) => ({ ...x, email: undefined }))
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${ids.emailError} ${ids.hint}` : ids.hint}
            className={`h-14 w-full rounded-2xl border bg-white px-5 text-[17px] text-ink shadow-soft transition placeholder:text-slate-soft focus:outline-none focus-visible:outline-none focus:ring-4 disabled:opacity-60 ${
              errors.email
                ? 'border-danger focus:ring-danger/15'
                : 'border-line hover:border-[#c9d6e8] focus:border-accent focus:ring-accent/15'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-navy-900 px-6 text-[17px] font-semibold text-white shadow-soft transition hover:bg-navy-800 hover:shadow-lift active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span>Joining…</span>
            </>
          ) : (
            <>
              <span>Join the Free Waitlist</span>
              <ArrowRight className="size-5 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {errors.email && <FieldError id={ids.emailError}>{errors.email}</FieldError>}

      <div className="mt-4 flex items-start gap-3">
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
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-navy-900"
        />
        <label htmlFor={ids.consent} className="cursor-pointer text-left text-[15px] leading-snug text-slate-copy">
          Email me when Ellivia launches. My email will only be used for Ellivia launch updates, and I can ask to
          be removed at any time.{' '}
          <a href={privacyHref} className="font-medium text-accent-600 underline underline-offset-2 hover:text-navy-900">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.consent && <FieldError id={ids.consentError}>{errors.consent}</FieldError>}

      <div className="mt-4">
        <TurnstileWidget
          resetKey={resetKey}
          onToken={handleToken}
          onExpire={handleExpire}
          onError={handleCaptchaError}
        />
        {errors.captcha && <FieldError id={ids.captchaError}>{errors.captcha}</FieldError>}
        {awaitingCaptcha && !token && !errors.captcha && (
          <p className="mt-2 text-sm text-slate-copy" role="status">
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

      <p id={ids.hint} className="mt-4 flex items-center gap-2 text-sm text-slate-soft">
        <Lock className="size-4 shrink-0" aria-hidden="true" />
        Free to join. Email only. Never upload bills or medical information here.
      </p>
    </form>
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
  email,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>
  headingId: string
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
          <h3 ref={headingRef} id={headingId} tabIndex={-1} className="text-xl font-semibold tracking-tight text-navy-900 focus:outline-none">
            You’re on the list.
          </h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-copy">
            We’ll send Ellivia launch updates to <strong className="break-all font-semibold text-ink">{email}</strong>.
            If this address was already on the waitlist, nothing changes and you won’t get duplicate messages.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-success/10 pt-5">
        <p className="text-[15px] text-slate-copy">Know someone who could use Ellivia?</p>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-medium text-navy-900 shadow-soft transition hover:border-[#c9d6e8] active:scale-[0.98]"
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
