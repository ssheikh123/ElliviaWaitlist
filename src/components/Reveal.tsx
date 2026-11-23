import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/** Each variant is a different effect, styled in index.css. */
export type RevealVariant = 'route' | 'wipe' | 'print' | 'stamp'

/**
 * Arms an element so it is hidden until it scrolls into view, then lets CSS glide it in.
 * Nothing is hidden for people who prefer reduced motion or in browsers without
 * IntersectionObserver (or before JavaScript runs).
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    el.setAttribute('data-armed', '')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute('data-shown', '')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** Plays its variant's effect the first time it scrolls into view. */
export function Reveal({
  as: Tag = 'div',
  variant,
  delay = 0,
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  variant: RevealVariant
  /** Stagger, in milliseconds. */
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Splits text into words, each in its own span with an index for staggered animation. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="word" style={{ '--i': start + i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
