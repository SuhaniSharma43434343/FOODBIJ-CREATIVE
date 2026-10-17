'use client';
import { useEffect, useRef } from 'react';

/**
 * Watermark ribbon in translucent ink. One rAF loop: a slow drift plus the page's scroll velocity,
 * so a fast scroll surges it and leans it (skewX); scrolling up reverses it. Pauses when off screen.
 */
export function VelocityMarquee({ words, className = '' }: { words: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0, vel = 0, dir = 1, lastY = window.scrollY, last = performance.now(), raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = (t: number) => {
      const dt = Math.min(64, t - last) / 16.67;
      last = t;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      vel += (dy - vel) * 0.1;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
      if (visible) {
        const half = el.scrollWidth / 2;
        x -= ((reduce ? 0 : 0.45) * dir + (reduce ? 0 : vel * 0.4)) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        const skew = reduce ? 0 : Math.max(-10, Math.min(10, -vel * 0.3));
        el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const run = (
    <span className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-[0.3em]">{w}</span>
          <span className="text-[0.4em]">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`} aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}
