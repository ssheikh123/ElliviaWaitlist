import logoUrl from '../assets/logo.webp'

/** Ellivia mark: leaves held in an open hand. Decorative; the surrounding link or text names it. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      width={56}
      height={56}
      decoding="async"
      className={`shrink-0 rounded-[28%] object-cover ${className}`}
    />
  )
}

export function Wordmark({ className = '', large = false }: { className?: string; large?: boolean }) {
  return (
    <span className={`inline-flex items-center text-ink ${large ? 'gap-3' : 'gap-2.5'} ${className}`}>
      <LogoMark className={large ? 'size-11 sm:size-14' : 'size-10'} />
      <span className={`font-display tracking-[-0.005em] ${large ? 'text-[26px] sm:text-[32px]' : 'text-[24px]'}`}>
        Ellivia
      </span>
    </span>
  )
}
