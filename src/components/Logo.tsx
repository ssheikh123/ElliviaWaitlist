export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <path d="M22 18h20v6H29v5h11v6H29v5h13v6H22z" fill="#fff" />
      <circle cx="46" cy="18" r="4" fill="#5b93f5" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-navy-900 ${className}`}>
      <LogoMark className="size-8" />
      <span className="text-[21px] font-semibold tracking-[-0.02em]">Ellivia</span>
    </span>
  )
}
