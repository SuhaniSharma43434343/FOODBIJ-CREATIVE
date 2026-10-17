'use client';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 3D gyroscopic tilt with a specular copper-foil highlight.
 * The card rotates toward the pointer on spring physics, a light hotspot follows the pointer across the surface,
 * and children marked as layers float at their own depth (counter-parallax). Fine pointers only.
 */
export function TiltCard({
  children,
  className = '',
  max = 12,
  lift = 30,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const cfg = { stiffness: 170, damping: 18, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const z = useSpring(useTransform(hover, [0, 1], [0, lift]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const go = useSpring(hover, { stiffness: 120, damping: 20 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), rgba(184,115,51,0.12) 22%, transparent 60%)`;

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, [reduce]);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    px.set((e.clientX - b.left) / b.width);
    py.set((e.clientY - b.top) / b.height);
  };

  return (
    <div className={`[perspective:1200px] ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => enabled && hover.set(1)}
        onPointerLeave={() => { hover.set(0); px.set(0.5); py.set(0.5); }}
        style={enabled ? { rotateX: rx, rotateY: ry, z, transformStyle: 'preserve-3d' } : undefined}
        className="relative h-full will-change-transform"
      >
        {children}
        {glare && enabled && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[4]"
            style={{ background: glareBg, opacity: go, z: 70 }}
          />
        )}
      </motion.div>
    </div>
  );
}

/** A layer inside a TiltCard that floats at its own depth. */
export function Layer({ depth = 50, className = '', children }: { depth?: number; className?: string; children: ReactNode }) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}
