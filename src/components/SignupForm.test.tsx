import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TurnstileWidgetProps } from './TurnstileWidget.tsx'

// Replace the real Cloudflare widget with a controllable fake.
const turnstile = vi.hoisted(() => ({
  props: null as TurnstileWidgetProps | null,
  resets: 0,
}))
vi.mock('./TurnstileWidget.tsx', async () => {
  const { useEffect } = await import('react')
  return {
    TurnstileWidget: (props: TurnstileWidgetProps) => {
      turnstile.props = props
      useEffect(() => {
        if (props.resetKey > 0) turnstile.resets++
      }, [props.resetKey])
      return <div data-testid="turnstile" />
    },
  }
})

import { SignupForm } from './SignupForm.tsx'
import { __resetReferralForTests, captureReferral } from '../lib/referral.ts'

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function solveCaptcha(token = 'token-1') {
  act(() => turnstile.props!.onToken(token))
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email address'), 'Jane@Example.com')
  await user.click(screen.getByRole('checkbox'))
}

beforeEach(() => {
  turnstile.props = null
  turnstile.resets = 0
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  __resetReferralForTests()
})
afterEach(() => vi.unstubAllGlobals())

describe('SignupForm', () => {
  it('renders the email field, consent checkbox, Turnstile and CTA', () => {
    render(<SignupForm placement="hero" />)
    expect(screen.getByLabelText('Email address')).toHaveAttribute('type', 'email')
    expect(screen.getByRole('checkbox', { name: /email me when ellivia launches/i })).not.toBeChecked()
    expect(screen.getByTestId('turnstile')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /join the free waitlist/i })).toBeEnabled()
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy/')
  })

  it('shows an accessible error for an invalid email and does not submit', async () => {
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /join/i }))

    const input = screen.getByLabelText('Email address')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveFocus()
    expect(screen.getAllByRole('alert').some((a) => /valid email address/i.test(a.textContent ?? ''))).toBe(true)
    expect(input.getAttribute('aria-describedby')).toContain(screen.getByText(/valid email address/i).closest('p')!.id)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requires consent before submitting', async () => {
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com')
    await user.click(screen.getByRole('button', { name: /join/i }))

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('checkbox')).toHaveFocus()
    expect(screen.getByText(/check the box/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('waits for Turnstile, then submits automatically once the token arrives', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByText(/finishing the security check/i)).toBeInTheDocument()

    solveCaptcha('late-token')
    await screen.findByRole('heading', { name: /you’re on the list/i })
    expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string).turnstileToken).toBe('late-token')
  })

  it('shows a loading state, blocks double submission, then shows success', async () => {
    let resolve!: (r: Response) => void
    fetchMock.mockImplementation(() => new Promise<Response>((r) => (resolve = r)))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await fillValid(user)

    const button = screen.getByRole('button', { name: /join/i })
    await user.click(button)
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent(/joining/i)
    expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByLabelText('Email address')).toBeDisabled()

    // Hammering the button / pressing Enter again must not send a second request.
    await user.click(button)
    screen.getByRole('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolve(jsonResponse({ ok: true }))
    const heading = await screen.findByRole('heading', { name: /you’re on the list/i })
    expect(heading).toHaveFocus()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    // Must not claim that an email was sent, nor invent a waitlist position.
    const success = heading.closest('section')!
    expect(success).not.toHaveTextContent(/sent you|check your inbox|confirmation email|#\d|position/i)
    expect(within(success).getByRole('button', { name: /share ellivia|copy link/i })).toBeInTheDocument()
  })

  it('sends the normalized email, consent, token and first-touch referral', async () => {
    captureReferral('?ref=legal-council')
    captureReferral('?ref=instagram') // later navigation must not overwrite
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha('tok-xyz')
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    await screen.findByRole('heading', { name: /you’re on the list/i })

    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://example.supabase.co/functions/v1/join-waitlist')
    expect(init!.method).toBe('POST')
    expect((init!.headers as Record<string, string>).apikey).toBe('sb_publishable_test')
    expect((init!.headers as Record<string, string>).Authorization).toBeUndefined()
    expect(JSON.parse(init!.body as string)).toEqual({
      email: 'jane@example.com',
      consent: true,
      turnstileToken: 'tok-xyz',
      referralSource: 'legal-council',
    })
  })

  it('shows the same privacy-preserving success for an address already on the list', async () => {
    // The server deliberately returns an identical { ok: true } for duplicates.
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const user = userEvent.setup()
    render(<SignupForm placement="footer" />)
    solveCaptcha()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(await screen.findByText(/if this address was already on the waitlist, nothing changes/i)).toBeInTheDocument()
  })

  it('shows a friendly error on API failure and lets the visitor retry with a fresh token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: 'server_error' }, 500))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha('first')
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))

    expect(await screen.findByText(/couldn’t save your signup/i)).toBeInTheDocument()
    expect(turnstile.resets).toBe(1) // used token discarded
    expect(screen.getByRole('button', { name: /join/i })).toBeEnabled()
    expect(screen.getByLabelText('Email address')).toHaveValue('Jane@Example.com') // input preserved

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))
    solveCaptcha('second')
    await user.click(screen.getByRole('button', { name: /join/i }))
    await screen.findByRole('heading', { name: /you’re on the list/i })
    expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string).turnstileToken).toBe('second')
  })

  it('handles network failures', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(await screen.findByText(/couldn’t reach our server/i)).toBeInTheDocument()
  })

  it('handles non-JSON gateway errors and rate limiting', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>Bad gateway</html>', { status: 502 }))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(await screen.findByText(/couldn’t save your signup/i)).toBeInTheDocument()

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: 'rate_limited' }, 429))
    solveCaptcha('again')
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(await screen.findByText(/too many attempts/i)).toBeInTheDocument()
  })

  it('asks the visitor to redo an expired security check', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: 'captcha_expired' }, 400))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(await screen.findByText(/security check expired/i)).toBeInTheDocument()
    expect(turnstile.resets).toBe(1)
  })

  it('drops an expired client-side token so it is never submitted', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha('will-expire')
    act(() => turnstile.props!.onExpire())
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    expect(fetchMock).not.toHaveBeenCalled()
    solveCaptcha('fresh')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string).turnstileToken).toBe('fresh')
  })

  it('surfaces a Turnstile load failure accessibly', async () => {
    render(<SignupForm placement="hero" />)
    act(() => turnstile.props!.onError('load'))
    expect(screen.getAllByRole('alert').some((a) => /security check couldn’t load/i.test(a.textContent ?? ''))).toBe(true)
  })

  it('maps server-side validation errors back to the right field', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: 'invalid_email' }, 400))
    const user = userEvent.setup()
    render(<SignupForm placement="hero" />)
    solveCaptcha()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /join/i }))
    await waitFor(() => expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true'))
  })
})
