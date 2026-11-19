import logoUrl from '../assets/logo.webp'

/** Ellivia mark: leaves held in an open hand. Decorative; the surrounding link or text names it. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      decoding="async"
      className={`shrink-0 rounded-[28%] object-cover ${className}`}
    />
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <LogoMark className="size-8" />
      <span className="text-[22px] font-extrabold tracking-[-0.03em]">Ellivia</span>
    </span>
  )
}
