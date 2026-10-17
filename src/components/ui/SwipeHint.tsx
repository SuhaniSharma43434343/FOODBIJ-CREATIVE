import { ArrowLong } from '@/components/ui/Icons';

/**
 * Micro-caption above a phone swipe rail, so first-time visitors know the row scrolls sideways.
 * Decorative (the list itself is reachable without it), so it is hidden from screen readers.
 */
export function SwipeHint({ children, className = '' }: { children: string; className?: string }) {
  return (
    <p aria-hidden="true" className={`t-meta flex items-center gap-3 text-[0.68rem] text-slate ${className}`}>
      {children}
      <span className="motion-safe:animate-[swipe-nudge_1.8s_var(--press)_infinite]"><ArrowLong /></span>
    </p>
  );
}
