import Image from 'next/image';

/** Header wordmark: the new 2026 logo with the tagline row cropped off for legibility at 22-28px tall. */
export function Wordmark({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={light ? '/brand/wordmark-white.png' : '/brand/wordmark.png'}
      alt="Foodbiz"
      width={900}
      height={154}
      priority
      className={className}
    />
  );
}

/** Full logo including SERVICE • INNOVATION • TRUST. */
export function FullLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={light ? '/brand/foodbiz-logo-white.png' : '/brand/foodbiz-logo.png'}
      alt="Foodbiz. Service, innovation, trust."
      width={1200}
      height={274}
      className={className}
    />
  );
}
