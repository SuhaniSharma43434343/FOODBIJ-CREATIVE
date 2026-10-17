'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const EASE = [0.76, 0, 0.24, 1] as const;

const HOLD_MS = 2000; // the count runs 1.8s, then a beat at 100 before the overlay lifts

/**
 * The count, the hairline and the failsafe exit are CSS written into the server HTML (the <style> below),
 * so the preloader counts to 100 and leaves even when the scripts or the stylesheet fail to load.
 * When the scripts do run, they lift it with the spring exit and remember it for the session.
 */
const CSS = `
@property --fbpl { syntax: '<integer>'; inherits: false; initial-value: 0; }
.fbpl { position: fixed; inset: 0; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #0B1C2D; color: #FAF7F2; animation: fbpl-out 0.85s cubic-bezier(0.76,0,0.24,1) 3.2s forwards; }
.fbpl-num::before { counter-reset: fbpl var(--fbpl); content: counter(fbpl, decimal-leading-zero); animation: fbpl-count 1.8s cubic-bezier(0.33,1,0.68,1) forwards; }
.fbpl-bar { transform-origin: left; animation: fbpl-bar 1.8s cubic-bezier(0.33,1,0.68,1) forwards; }
@keyframes fbpl-count { to { --fbpl: 100; } }
@keyframes fbpl-bar { from { transform: scaleX(0); } }
@keyframes fbpl-out { to { transform: translate3d(0,-100%,0); visibility: hidden; } }
`;

export function KitchenPassPreloader() {
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState<number | null>(null); // null until the scripts run: the CSS count shows meanwhile

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem('fb_preloader_seen');
    } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setLoading(false);
    const t0 = performance.now();
    const clock = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / 1800);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k >= 1) clearInterval(clock);
    }, 30);
    const t = window.setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem('fb_preloader_seen', '1');
      } catch {}
    }, HOLD_MS);
    return () => { clearTimeout(t); clearInterval(clock); };
  }, []);

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <AnimatePresence>
      {loading && (
        <motion.div
          key="kitchen-preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: EASE }}
          className="fbpl select-none"
        >
          {/* Subtle warm ambient heat glow behind the pan */}
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,115,51,0.22),transparent_70%)]" />

          {/* Sauté Pan & Rising Steam Illustration */}
          <div className="relative flex h-40 w-44 items-center justify-center">
            {/* Animated Rising Steam Curls */}
            <div className="pointer-events-none absolute -top-10 flex gap-4">
              {[0, 1, 2].map((i) => (
                <motion.svg
                  key={i}
                  viewBox="0 0 20 60"
                  className="h-16 w-5 overflow-visible"
                  animate={{
                    y: [-4, -40],
                    opacity: [0, 0.85, 0],
                    scaleX: [0.8, 1.4],
                  }}
                  transition={{
                    duration: 1.9,
                    repeat: Infinity,
                    delay: i * 0.45,
                    ease: 'easeInOut',
                  }}
                >
                  <path
                    d="M 10 52 Q 4 36, 13 24 T 10 4"
                    fill="none"
                    stroke="#F3D5A6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                </motion.svg>
              ))}
            </div>

            {/* Rocking Copper Sauté Pan */}
            <motion.svg
              viewBox="0 0 150 90"
              className="h-full w-full"
              animate={{
                rotate: [-2, 2.5, -2],
                y: [0, -3.5, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Pan Handle (Cast Brass with Hanging Eyelet) */}
              <path
                d="M 14 38 L 48 48"
                stroke="#B87333"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="14" cy="38" r="2.8" fill="#F3D5A6" />

              {/* Sauté Pan Body (Burnished Copper) */}
              <ellipse cx="86" cy="58" rx="48" ry="16" fill="#8A4F1F" />
              <path
                d="M 38 56 C 38 74, 134 74, 134 56"
                fill="#B87333"
                stroke="#D9A576"
                strokeWidth="1.5"
              />

              {/* Pan Rim Highlight */}
              <ellipse
                cx="86"
                cy="56"
                rx="48"
                ry="15"
                fill="none"
                stroke="#F3D5A6"
                strokeWidth="1.2"
                className="opacity-75"
              />

              {/* Inner Sizzle Shimmer */}
              <motion.ellipse
                cx="86"
                cy="58"
                rx="38"
                ry="10"
                fill="url(#copper-sizzle)"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [0.97, 1.03, 0.97],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <defs>
                <radialGradient id="copper-sizzle" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F3D5A6" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#C97A3E" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8A4F1F" stopOpacity="0" />
                </radialGradient>
              </defs>
            </motion.svg>
          </div>

          {/* Luxury Monospace Progress & Status */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.24em] text-[#D9A576] uppercase">
              Heating The Pass
            </span>
            <div className="font-serif text-[2.2rem] leading-none tracking-normal text-[#FAF7F2]">
              {n === null ? <span className="fbpl-num" aria-hidden="true" /> : String(n).padStart(2, '0')}
              <span className="text-[1.2rem] text-[#B87333]">%</span>
            </div>
          </div>

          {/* Hairline Progress Indicator */}
          <div className="mt-5 h-[1.5px] w-40 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full bg-gradient-to-r from-[#B87333] to-[#F3D5A6] ${n === null ? 'fbpl-bar' : ''}`} style={n === null ? undefined : { transform: `scaleX(${n / 100})`, transformOrigin: 'left' }} />
          </div>

          {/* Micro Brand Coordinates */}
          <p className="mt-6 font-mono text-[9px] tracking-widest text-white/40 uppercase">
            Foodbiz Mumbai · 19.0760° N, 72.8777° E
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
