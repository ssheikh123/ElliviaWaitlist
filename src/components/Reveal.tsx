import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Floats its content up into place the first time it scrolls into view.
 * Content is only hidden once JavaScript has "armed" it, and never for people
 * who prefer reduced motion or browsers without IntersectionObserver.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  /** Stagger, in milliseconds. */
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    // Anything already on screen at load still gets the effect.
    el.setAttribute('data-armed', '')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute('data-shown', '')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  )
}
