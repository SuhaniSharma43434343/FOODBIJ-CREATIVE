'use client';
import { createElement, type ElementType, type ReactNode } from 'react';
import { useInView } from '@/components/ui/useInView';

export function Reveal({ children, as = 'div', className = '', delay = 0 }: { children: ReactNode; as?: ElementType; className?: string; delay?: number }) {
  const [ref, inView] = useInView<HTMLElement>();
  return createElement(as, { ref, className: `reveal ${inView ? 'is-in' : ''} ${className}`, style: { ['--d' as string]: `${delay}ms` } }, children);
}

/** Splits a headline into words that rise from a mask, staggered. */
export function SplitRise({ text, as = 'h2', className = '', id, italic = [] as number[] }: { text: string; as?: ElementType; className?: string; id?: string; italic?: number[] }) {
  const [ref, inView] = useInView<HTMLElement>();
  const words = text.split(' ');
  return createElement(
    as,
    { ref, id, className, 'aria-label': text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-top -mb-[0.1em]">
        <span
          className={`inline-block transition-[transform,opacity] duration-[1.2s] ease-[cubic-bezier(0.2,0.7,0.1,1)] ${italic.includes(i) ? 'copper-text' : ''}`}
          style={{ transform: inView ? 'none' : 'translate3d(0,108%,0)', opacity: inView ? 1 : 0, transitionDelay: `${i * 45}ms` }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      </span>
    )),
  );
}
