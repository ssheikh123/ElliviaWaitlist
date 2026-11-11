import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeroBill } from './HeroBill.tsx'

afterEach(() => vi.useRealTimers())

async function openWithEllivia() {
  const user = userEvent.setup()
  render(<HeroBill />)
  await user.click(screen.getByRole('radio', { name: 'With Ellivia' }))
  return user
}

describe('HeroBill', () => {
  it('is clearly labelled as an example with its sources and limits', () => {
    render(<HeroBill />)
    const caption = screen.getByText(/sample bill and concept app/i).closest('figcaption')!
    expect(caption).toHaveTextContent(/not copays/i)
    expect(caption).toHaveTextContent(/you must apply, and RUSH decides/i)
    expect(caption).toHaveTextContent(/nothing here is saved/i)
    expect(screen.getByRole('link', { name: /RUSH’s policy/ })).toHaveAttribute('href', expect.stringContaining('rush.edu'))
  })

  it('starts on the plain bill with the full balance and no discount', () => {
    render(<HeroBill />)
    expect(screen.getByRole('radio', { name: 'On its own' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('$3,128.00')).toBeInTheDocument()
    expect(screen.queryByText(/% off/)).not.toBeInTheDocument()
    expect(screen.getByText('Patient responsibility')).toBeInTheDocument()
    expect(screen.getByText('Scan your bill')).toBeInTheDocument()
    // plain labels, no jargon codes
    expect(screen.queryByText(/CPT|rev\. code|contractual/i)).not.toBeInTheDocument()
  })

  it('defaults to the 80% band for a family of 4 and shows the new amount', async () => {
    await openWithEllivia()
    expect(screen.getByRole('radio', { name: '4 people' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '$99,001 – $132,000' })).toBeChecked()
    expect(screen.getByText('$625.60')).toBeInTheDocument()
    expect(screen.getAllByText('80% off').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Underinsured Discount Program/).length).toBeGreaterThan(0)
  })

  it('shows up to 100% off at or below 300% of the poverty guideline', async () => {
    const user = await openWithEllivia()
    await user.click(screen.getByRole('radio', { name: 'Up to $99,000' }))
    expect(screen.getByText('$0.00')).toBeInTheDocument()
    expect(screen.getAllByText('Up to 100% off').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Charity Care Program/).length).toBeGreaterThan(0)
  })

  it('does not promise a discount above 400%', async () => {
    const user = await openWithEllivia()
    await user.click(screen.getByRole('radio', { name: 'Over $132,000' }))
    expect(screen.queryByText(/% off/)).not.toBeInTheDocument()
    expect(screen.getByText(/no income-based discount/i)).toBeInTheDocument()
    expect(screen.getAllByText('$3,128.00').length).toBeGreaterThan(0)
  })

  it('recalculates the income ranges for the household size', async () => {
    const user = await openWithEllivia()
    await user.click(screen.getByRole('radio', { name: '1 person' }))
    expect(screen.getByRole('radio', { name: 'Up to $47,880' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '$47,881 – $63,840' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '6 people' }))
    expect(screen.getByRole('radio', { name: 'Up to $133,080' })).toBeInTheDocument()
  })

  it('reveals the explanation once on its own', () => {
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
