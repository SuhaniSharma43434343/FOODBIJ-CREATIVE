'use client';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/images';
import { founders } from '@/lib/content';

/**
 * The floor-team print. The photo column drifts on its own scroll plane (counter-parallax against the quote),
 * a copper archival stamp turns slowly on its corner, and the print lifts slightly under the pointer.
 * Parallax is off below 768px and for reduced motion; the stamp then stands still.
 */
export function FloorTeamFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    setWide(m.matches);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const still = reduce || !wide;
  const raw = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [30, -30]);
  const y = useSpring(raw, { stiffness: 120, damping: 24, mass: 0.6 });

  return (
    <div ref={ref} className="relative flex justify-center lg:justify-start">
      {/* scroll plane */}
      <motion.div style={{ y }} className="w-full max-w-[420px]">
        {/* hover lift (separate element so it never fights the scroll transform) */}
        <motion.div
          whileHover={reduce ? undefined : { y: -8, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="group relative bg-white px-3.5 pb-6 pt-3.5 shadow-[0_16px_36px_-10px_rgba(11,28,45,0.14)] transition-shadow duration-500 hover:shadow-[0_28px_50px_-14px_rgba(11,28,45,0.2)]"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-navy-2">
            <Image
              src={img[founders.photo.key]}
              alt={founders.photo.alt}
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              placeholder="blur"
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate">The floor team</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-copper-ink">Real event, not staged</span>
          </div>

          {/* the archival stamp */}
          <div className="pointer-events-none absolute bottom-[56px] -right-5 z-20 h-24 w-24 sm:-right-9 sm:h-28 sm:w-28" aria-hidden="true">
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full animate-[spin_24s_linear_infinite] drop-shadow-[0_6px_10px_rgba(11,28,45,0.18)] group-hover:[animation-play-state:paused]"
            >
              <defs>
                <path id="stamp-circle" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
              </defs>
              <circle cx="50" cy="50" r="47" fill="#FAF7F2" stroke="#B87333" strokeWidth="1" />
              <circle cx="50" cy="50" r="42.5" fill="none" stroke="#B87333" strokeWidth="0.5" strokeDasharray="1.5 1.8" />
              <circle cx="50" cy="50" r="17" fill="none" stroke="#B87333" strokeWidth="0.6" />
              <text x="50" y="55.5" textAnchor="middle" fill="#B87333" fontSize="15">✦</text>
              <text fill="#8A4F1F" fontFamily="var(--font-meta), monospace" fontSize="6.4" letterSpacing="1.1">
                {/* textLength fits the phrase exactly once round the 35-unit circle (2πr ≈ 220) */}
                <textPath href="#stamp-circle" textLength="216" lengthAdjust="spacing">
                  ✦ REAL EVENT · NOT STAGED ✦ THE FLOOR TEAM
                </textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
