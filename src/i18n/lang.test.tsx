import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LangProvider, detectLang, withLang } from './lang.tsx'
import { SignupForm } from '../components/SignupForm.tsx'
import { HeroBill } from '../components/HeroBill.tsx'
import { LanguageSwitch } from '../components/Nav.tsx'
import PrivacyPage from '../PrivacyPage.tsx'

vi.mock('../config.ts', async (orig) => {
  const real = await orig<typeof import('../config.ts')>()
  return { ...real, isSignupConfigured: true }
})
vi.mock('../components/TurnstileWidget.tsx', () => ({ TurnstileWidget: () => null }))

afterEach(() => window.history.replaceState(null, '', '/'))

describe('language detection', () => {
  it('uses ?lang= first, then the browser language', () => {
    window.history.replaceState(null, '', '/?lang=es')
    expect(detectLang()).toBe('es')
    window.history.replaceState(null, '', '/?ref=instagram')
    expect(detectLang()).toBe('en') // jsdom's browser language is English
  })

  it('only adds ?lang= to links when it differs from the browser language', () => {
    expect(withLang('/privacy/', 'en')).toBe('/privacy/')
    expect(withLang('/privacy/', 'es')).toBe('/privacy/?lang=es')
    expect(withLang('/?ref=x#join', 'es')).toBe('/?ref=x&lang=es#join')
  })
})

describe('Spanish site', () => {
  it('shows the form, its errors and the privacy link in Spanish', async () => {
    const user = userEvent.setup()
    render(
      <LangProvider page="home" initial="es">
        <SignupForm />
      </LangProvider>,
    )
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute('href', '/privacy/?lang=es')
    await user.click(screen.getByRole('button', { name: /unirme a la lista gratuita/i }))
    expect(screen.getByText('Escriba su nombre.')).toBeInTheDocument()
    expect(screen.getByText('Escriba su correo electrónico.')).toBeInTheDocument()
  })

  it('translates the sample bill and keeps the dollar amounts', () => {
    render(
      <LangProvider page="home" initial="es">
        <HeroBill />
      </LangProvider>,
    )
    expect(screen.getByRole('radio', { name: 'Por su cuenta' })).toBeInTheDocument()
    expect(screen.getByText('Responsabilidad del paciente')).toBeInTheDocument()
    expect(screen.getByText('$3,128.00')).toBeInTheDocument()
  })

  it('switches language, page language and title from the switch', async () => {
    const user = userEvent.setup()
    render(
      <LangProvider page="home" initial="en">
        <LanguageSwitch />
      </LangProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Español' }))
    expect(document.documentElement.lang).toBe('es')
    expect(document.title).toMatch(/asistencia financiera/)
    expect(window.location.search).toBe('?lang=es')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('lang', 'en')
  })

  it('shows the Spanish privacy policy with a link to the English original', () => {
    render(
      <LangProvider page="privacy" initial="es">
        <PrivacyPage />
      </LangProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Política de privacidad de Ellivia')
    expect(screen.getByRole('link', { name: 'política de privacidad en inglés' })).toHaveAttribute(
      'href',
      '/privacy/', // English matches jsdom's browser language, so no ?lang= is needed
    )
    expect(screen.getByRole('heading', { name: 'Parte 2: El sitio web y la lista de espera de Ellivia' })).toBeInTheDocument()
  })
})
