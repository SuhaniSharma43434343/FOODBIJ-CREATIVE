'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/images';
import { liveCounters } from '@/lib/content';
import { Reveal, SplitRise } from '@/components/fx/Reveal';
import { SwipeHint } from '@/components/ui/SwipeHint';

type Counter = (typeof liveCounters)[number];
type Mode = 'row' | 'pin' | 'static';

const TOTAL = liveCounters.length + 1; // five stations + "Your event"
const HANG = [0, 48, 0, 48, 0, 24]; // the existing stagger, as hanging lengths below the rail
const STUB_H = 178; // room reserved under every ticket so an opening stub never shifts the layout
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The Ticket Rail. In a kitchen, the pass is where plates go out and order tickets hang above it from a brass rail.
 * Each live counter is a ticket on that rail.
 *  - Desktop (≥768px): the rail pins and vertical scroll glides it sideways through all six tickets (sticky +
 *    scroll progress; native scroll, nothing intercepted). Tickets sway from their clips with scroll velocity.
 *  - Hover / keyboard focus: a heat-lamp glow warms the ticket, the photo comes to full colour, and a receipt
 *    stub slides down with the service note.
 *  - Phone: a swipe row with one ticket per snap; tap tears the stub down. Gentle sway on swipe only.
 *  - Reduced motion: a static scrollable row with every stub open; no pin, sway or glow.
 * Motion is transform and opacity only, driven by one shared rAF loop.
 */
export function LivePass() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>('row');
  const [open, setOpen] = useState<number | null>(null);
  const [distance, setDistance] = useState(0);
  const [frameH, setFrameH] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0); // page scroll position where the rail starts to glide
  const travel = useRef(0);
  const track = useRef<HTMLUListElement>(null);
  const sway = useRef<(HTMLDivElement | null)[]>([]);

  // which layout applies
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px) and (min-height: 720px)');
    const pick = () => setMode(reduce ? 'static' : m.matches ? 'pin' : 'row');
    pick();
    m.addEventListener('change', pick);
    return () => m.removeEventListener('change', pick);
  }, [reduce]);

  // how far the pinned rail has to travel, and where the pin begins
  useEffect(() => {
    if (mode !== 'pin') return setDistance(0);
    const measure = () => {
      const t = track.current, f = frameRef.current, box = pinRef.current;
      if (!t || !f || !box) return;
      const d = Math.max(0, t.scrollWidth - window.innerWidth);
      travel.current = d;
      setDistance(d);
      setFrameH(f.offsetHeight);
      startY.current = box.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(f).top || '0');
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [mode]);

  // desktop: while the stage is pinned, each pixel of vertical scroll moves the rail one pixel sideways
  const { scrollY } = useScroll();
  const rawX = useTransform(scrollY, (y) => -Math.min(travel.current, Math.max(0, y - startY.current)));
  const x = useSpring(rawX, { stiffness: 140, damping: 30, mass: 0.5 });

  // phone: swiping the row closes an open stub
  useEffect(() => {
    if (mode !== 'row') return;
    const el = track.current;
    if (!el) return;
    const on = () => setOpen(null);
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [mode]);

  // tapping outside an open ticket tears nothing: it just closes
  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => !(e.target as HTMLElement).closest(`[data-ticket="${open}"]`) && setOpen(null);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  // one shared rAF loop: tickets sway from their clips with scroll velocity, max ±3°, easing back to rest
  useEffect(() => {
    if (mode === 'static') {
      sway.current.forEach((s) => s && (s.style.transform = ''));
      return;
    }
    const el = track.current;
    const read = () => (mode === 'pin' ? window.scrollY : el?.scrollLeft ?? 0);
    let last = read(), angle = 0, raf = 0, running = false;
    const tick = () => {
      const now = read();
      const v = now - last;
      last = now;
      const target = Math.max(-3, Math.min(3, -v * (mode === 'pin' ? 0.12 : 0.06)));
      angle += (target - angle) * 0.12;
      sway.current.forEach((s, i) => {
        if (s) s.style.transform = `rotate(${(angle * (0.75 + ((i * 37) % 10) / 20)).toFixed(3)}deg)`;
      });
      if (Math.abs(angle) < 0.01 && Math.abs(v) < 0.1) {
        running = false;
        sway.current.forEach((s) => s && (s.style.transform = 'rotate(0deg)'));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!running) { running = true; last = read(); raf = requestAnimationFrame(tick); } };
    const target = mode === 'pin' ? window : el;
    target?.addEventListener('scroll', kick, { passive: true });
    return () => { cancelAnimationFrame(raf); target?.removeEventListener('scroll', kick); };
  }, [mode]);

  const pinned = mode === 'pin';
  const tickets = (
    <ul
      ref={track}
      aria-label="Live counters"
      className={
        pinned
          ? 'relative flex w-max items-start gap-8 pl-[var(--gutter)] pr-[16vw]'
          : 'relative flex items-start gap-5 overflow-x-auto overscroll-x-contain px-[var(--gutter)] [scrollbar-width:none] snap-x snap-mandatory scroll-px-[var(--gutter)] [&::-webkit-scrollbar]:hidden'
      }
    >
      {liveCounters.map((c, i) => (
        <Ticket
          key={c.title}
          c={c}
          i={i}
          mode={mode}
          open={mode === 'static' || open === i}
          onToggle={() => setOpen((o) => (o === i ? null : i))}
          swayRef={(n) => { sway.current[i] = n; }}
        />
      ))}
      <YourEventTicket i={liveCounters.length} swayRef={(n) => { sway.current[liveCounters.length] = n; }} />
    </ul>
  );

  return (
    <section id="live" className="grain relative z-10 bg-paper" aria-labelledby="live-h">
      {/* headline block: the intro sits beside the headline's last line, on its baseline */}
      <div className="wrap sec-t">
        <p className="t-meta text-copper-ink">The live pass</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-14">
          <SplitRise id="live-h" text="Cooked in front of your guests." italic={[3]} className="t-h1 max-w-[12ch] shrink-0" />
          <Reveal className="lg:pb-[0.55em]">
            <p className="muted max-w-[42ch]">
              Live counters are where an event gathers. Five we have run, as they looked on the night. A teaser, never a full menu.
            </p>
          </Reveal>
        </div>
      </div>

      <div ref={pinRef} className="relative" style={pinned ? { height: frameH + distance } : undefined}>
        <div ref={frameRef} className={pinned ? 'gap-sec sticky top-[calc(var(--header-h)+24px)] [overflow-x:clip]' : 'gap-sec'}>
          {mode === 'row' && <SwipeHint className="wrap mb-5">Swipe to inspect stations</SwipeHint>}
          <div className="relative">
            <Rail />
            {pinned ? <motion.div style={{ x }} className="will-change-transform">{tickets}</motion.div> : tickets}
          </div>
        </div>
      </div>
      {/* closing space. On desktop an opened stub hangs into it and the next section's top padding (80 + 80 > stub). */}
      <div className="sec-b" aria-hidden="true" />
    </section>
  );
}

/** The brass rail: a 1.5px copper line with a soft highlight running along its top edge. */
function Rail() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div className="h-[1.5px] bg-[linear-gradient(90deg,#8a4f1f,#b87333_20%,#e3b58a_45%,#b87333_70%,#8a4f1f)]" />
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,240,215,0.9)_40%,transparent_75%)] opacity-70" />
    </div>
  );
}

/** Brass clip that pins a ticket to the rail. */
function Clip() {
  return (
    <span aria-hidden="true" className="absolute -top-2 left-1/2 z-20 block h-5 w-7 -translate-x-1/2">
      <span className="absolute inset-x-0 top-0 h-3 rounded-[2px] bg-[linear-gradient(180deg,#e3b58a,#b87333_55%,#8a4f1f)] shadow-[0_2px_3px_rgba(11,28,45,0.25)]" />
      <span className="absolute left-1/2 top-[3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#5a3418]/60" />
      <span className="absolute inset-x-1 bottom-0 h-2 rounded-b-[2px] bg-[linear-gradient(180deg,#b87333,#8a4f1f)] opacity-80" />
    </span>
  );
}

/** Perforated tear-line along the top of each ticket. */
const PERF = 'radial-gradient(circle at 5px 0, transparent 2.6px, #fff 3px) 0 0 / 10px 6px repeat-x';

function Ticket({
  c, i, mode, open, onToggle, swayRef,
}: {
  c: Counter; i: number; mode: Mode; open: boolean; onToggle: () => void; swayRef: (n: HTMLDivElement | null) => void;
}) {
  const stubId = `stub-${i}`;
  const tap = mode === 'row';
  return (
    <li
      data-ticket={i}
      className={`relative shrink-0 ${mode === 'pin' ? '' : 'snap-start'}`}
      style={{ paddingTop: 22 + HANG[i], paddingBottom: mode === 'pin' || !open ? 0 : STUB_H }}
    >
      {/* cord from the rail down to the clip, for the longer hangs */}
      {HANG[i] > 0 && <span aria-hidden="true" className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[#b87333]/60" style={{ height: 14 + HANG[i] }} />}
      <div ref={swayRef} className="relative origin-top will-change-transform" style={{ transformOrigin: '50% 0' }}>
        <Clip />
        <article
          tabIndex={0}
          role={tap ? 'button' : 'group'}
          aria-expanded={tap ? open : undefined}
          aria-controls={tap ? stubId : undefined}
          aria-label={`Ticket ${pad(i + 1)}: ${c.title}. ${c.seen}`}
          onClick={tap ? onToggle : undefined}
          onKeyDown={(e) => tap && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
          data-open={open || undefined}
          className="group relative w-[calc(100vw-88px)] max-w-[300px] cursor-default outline-none md:w-[clamp(250px,22vw,300px)]"
        >
          {/* heat lamp: warm amber light falling from above */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-36 left-1/2 z-0 h-64 w-[150%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,176,92,0.42),rgba(184,115,51,0.12)_45%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[open]:opacity-100 motion-reduce:hidden"
          />

          <div className="relative z-10 bg-white shadow-[0_1px_2px_rgba(11,28,45,0.06),0_10px_24px_-14px_rgba(11,28,45,0.3)] ring-1 ring-stone group-focus-visible:ring-2 group-focus-visible:ring-copper">
            <span aria-hidden="true" className="absolute inset-x-0 -top-[5px] h-[6px]" style={{ background: PERF }} />
            <div className="p-3 pb-0">
              <div className="relative aspect-[4/3.4] overflow-hidden bg-navy-2">
                <Image
                  src={img[c.photo.key]}
                  alt={c.photo.alt}
                  sizes="(min-width: 768px) 300px, calc(100vw - 88px)"
                  placeholder="blur"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* desaturation as an opacity-only layer, so the colour change animates opacity alone */}
                <span aria-hidden="true" className="absolute inset-0 bg-[#8a8a8a] opacity-[0.45] mix-blend-saturation transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[open]:opacity-0" />
                <span className="absolute left-2.5 top-2.5 bg-navy px-2 py-1 font-mono text-[0.72rem] tracking-[0.12em] text-[#d9a576]">#{pad(i + 1)}</span>
              </div>
            </div>
            <div className="px-4 pb-4 pt-4">
              <h3 className="font-serif text-[1.45rem] leading-[1.05] text-navy">{c.title}</h3>
              <p className="t-meta mt-3 border-t border-dashed border-stone pt-3 text-[0.66rem] text-copper-ink">{c.seen}</p>
            </div>
          </div>

          {/* receipt stub: slides down from behind the ticket's foot */}
          <div className="absolute inset-x-2 top-full z-0 overflow-hidden" style={{ height: STUB_H - 12 }}>
            <div
              id={stubId}
              className="-translate-y-full bg-[#fffdf8] px-4 pb-4 pt-3 font-mono text-[0.68rem] leading-relaxed text-slate shadow-[0_14px_24px_-16px_rgba(11,28,45,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 group-data-[open]:translate-y-0"
              style={{ background: '#fffdf8', backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 17px, rgba(229,223,213,0.6) 17px 18px)' }}
            >
              <p className="border-b border-dashed border-stone pb-2 text-[0.62rem] uppercase tracking-[0.14em] text-copper-ink">Service note · #{pad(i + 1)}</p>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 uppercase tracking-[0.06em]">
                <dt className="text-navy">Station</dt><dd className="truncate normal-case tracking-normal">{c.title}</dd>
                <dt className="text-navy">Chefs on line</dt><dd><span className="needs normal-case">[client to provide]</span></dd>
                <dt className="text-navy">Guests per hour</dt><dd><span className="needs normal-case">[client to provide]</span></dd>
                <dt className="text-navy">Signature</dt><dd><span className="needs normal-case">[client to provide]</span></dd>
              </dl>
              <p className="mt-2 truncate normal-case">{c.text}</p>
            </div>
          </div>
        </article>
      </div>
    </li>
  );
}

function YourEventTicket({ i, swayRef }: { i: number; swayRef: (n: HTMLDivElement | null) => void }) {
  return (
    <li data-ticket={i} className="relative shrink-0 snap-start" style={{ paddingTop: 22 + HANG[i] }}>
      <span aria-hidden="true" className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[#b87333]/60" style={{ height: 14 + HANG[i] }} />
      <div ref={swayRef} className="relative will-change-transform" style={{ transformOrigin: '50% 0' }}>
        <Clip />
        <Link
          href="#plan"
          aria-label={`Ticket ${pad(i + 1)}: your event. Plan your event`}
          className="group relative flex aspect-[300/388] w-[calc(100vw-88px)] max-w-[300px] flex-col justify-between bg-white p-5 shadow-[0_1px_2px_rgba(11,28,45,0.06),0_10px_24px_-14px_rgba(11,28,45,0.3)] outline-none ring-1 ring-stone transition-shadow focus-visible:ring-2 focus-visible:ring-copper md:w-[clamp(250px,22vw,300px)]"
        >
          <span aria-hidden="true" className="absolute inset-x-0 -top-[5px] h-[6px]" style={{ background: PERF }} />
          <span className="font-mono text-[0.72rem] tracking-[0.12em] text-copper-ink">#{pad(i + 1)}</span>
          <span>
            <span className="block font-serif text-[2.2rem] italic leading-none text-navy">Your event</span>
            <span className="mt-4 block h-px w-full border-t border-dashed border-stone" />
          </span>
          <span className="t-meta flex items-center gap-3 text-copper-ink">
            Plan your event <span className="arrow-l"><i /><b /></span>
          </span>
        </Link>
      </div>
    </li>
  );
}
