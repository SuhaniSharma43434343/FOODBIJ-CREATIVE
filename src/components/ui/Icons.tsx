export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
      <path d="M0 5h20M16 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Plus({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Close({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** The logo's copper slash, used as a small brand glyph. */
export function Slash({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="10" height="18" viewBox="0 0 10 18" aria-hidden="true">
      <path d="M7.4 0H10L2.6 18H0z" fill="#B87333" />
    </svg>
  );
}

/** The house arrow: a copper hairline that lengthens on hover (1.1em → 1.6em). */
export function ArrowLong({ className = '' }: { className?: string }) {
  return (
    <span className={`arrow-l ${className}`} aria-hidden="true">
      <i />
      <b />
    </span>
  );
}

export function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
