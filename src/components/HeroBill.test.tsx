import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeroBill } from './HeroBill.tsx'

afterEach(() => vi.useRealTimers())

describe('HeroBill', () => {
  it('is clearly labelled as a sample and concept', () => {
    render(<HeroBill />)
    expect(screen.getByText(/sample bill and concept app/i)).toBeInTheDocument()
  })

  it('flips between the confusing bill and the explained bill', async () => {
    const user = userEvent.setup()
    render(<HeroBill />)
    const own = screen.getByRole('radio', { name: 'On its own' })
    const withE = screen.getByRole('radio', { name: 'With Ellivia' })

    expect(own).toHaveAttribute('aria-checked', 'true')
    expect(screen.queryByText(/scan your bill with your phone/i)).not.toBeInTheDocument()

    await user.click(withE)
    expect(withE).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText(/scan your bill with your phone/i)).toBeInTheDocument()
    expect(screen.getByText(/see where and how to apply/i)).toBeInTheDocument()

    await user.click(own)
    expect(own).toHaveAttribute('aria-checked', 'true')
    expect(screen.queryByText(/scan your bill with your phone/i)).not.toBeInTheDocument()
  })

  it('reveals the explanation once on its own, but never overrides the visitor’s choice', () => {
    vi.useFakeTimers()
    render(<HeroBill />)
    act(() => vi.advanceTimersByTime(2500))
    expect(screen.getByRole('radio', { name: 'With Ellivia' })).toHaveAttribute('aria-checked', 'true')
  })

  it('keeps the visitor’s choice if they pick before the auto-reveal', () => {
    vi.useFakeTimers()
    render(<HeroBill />)
    act(() => screen.getByRole('radio', { name: 'On its own' }).click())
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByRole('radio', { name: 'On its own' })).toHaveAttribute('aria-checked', 'true')
  })
})
