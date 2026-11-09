/** Ellivia mark: a folded paper corner (the bill) with a green leaf of relief. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill="#0f2f45" />
      <path d="M20 16h18l8 8v24H20z" fill="#eaf6fd" />
      <path d="M38 16v8h8z" fill="#bde2f7" />
      <path d="M27 38c0-6 5-10 12-10 0 7-4 12-12 12z" fill="#8fd6ab" />
    </svg>
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
