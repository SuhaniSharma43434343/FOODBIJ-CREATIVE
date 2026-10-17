'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useDragControls,
  type PanInfo,
} from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { img } from '@/lib/images';
import { folios, marqueeRows, type Folio } from '@/lib/avant';
import { serviceBySlug, type Service } from '@/lib/content';
import { Reveal, SplitRise } from '@/components/fx/Reveal';
import { VelocityMarquee } from '@/components/fx/VelocityMarquee';
import { ArrowLong, Close } from '@/components/ui/Icons';
import { Txt } from '@/components/ui/Txt';

const EASE = [0.2, 0.7, 0.1, 1] as const;
const LEAN = 22; // resting turn on the shelf, so each spine shows

/**
 * The banqueting folios. The four services as clothbound volumes standing on an oak-and-brass credenza.
 * Hover: the volume lifts and turns toward the pointer on springs, foil catching the light; its shadow spreads.
 * Click: the volume flies forward (shared layout) and a deckle-edged sheet unfolds beside it with the brief,
 * the run sheet and a photograph. Esc, the backdrop or Close returns it to its place. Phones: a snap rail of
 * covers and a bottom sheet you can drag away.
 */
export function BespokeFolios() {
  const [active, setActive] = useState<Folio['slug'] | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((slug: Folio['slug'], el: HTMLElement) => {
    trigger.current = el;
    setActive(slug);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);
  const folio = folios.find((f) => f.slug === active) ?? null;

  return (
    <section id="services" className="sec relative isolate" aria-labelledby="services-h">
      {/* pinned watermark */}
      <div className="sticky top-[34vh] -z-10 h-0" aria-hidden="true">
        <VelocityMarquee words={marqueeRows[0]} className="font-serif text-[clamp(5rem,15vw,15rem)] leading-none text-navy/[0.07]" />
      </div>

      <div className="wrap grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="t-meta text-copper-ink">What we do / the banqueting folios</p>
          <SplitRise id="services-h" text="Four kinds of event. One kitchen behind all of them." italic={[5]} className="t-h1 mt-5" />
        </div>
        <Reveal className="self-end lg:col-span-4 lg:col-start-9">
          <p className="muted max-w-[42ch]">
            Four volumes, one for each kind of event we cater. Take one down from the shelf to read the brief and how we run it.
          </p>
        </Reveal>
      </div>

      <LayoutGroup id="folios">
        {/* tablet + desktop: the credenza */}
        <Reveal className="wrap gap-sec hidden sm:block">
          <div className="relative mx-auto max-w-[1080px]">
            <ul className="relative z-10 flex items-end justify-center gap-[clamp(20px,3.6vw,56px)] [perspective:1400px]" aria-label="Services">
              {folios.map((f) => (
                <li key={f.slug}>
                  <ShelfBook f={f} hidden={active === f.slug} onOpen={open} />
                </li>
              ))}
            </ul>
            <Credenza />
          </div>
        </Reveal>

        {/* phone: snap rail of covers */}
        <ul className="rail mt-12 pb-6 sm:hidden" aria-label="Services">
          {folios.map((f) => (
            <li key={f.slug} className="w-[62vw] max-w-[260px]">
              <button type="button" onClick={(e) => open(f.slug, e.currentTarget)} aria-haspopup="dialog" className="block w-full text-left">
                <motion.div layoutId={`folio-m-${f.slug}`} style={{ visibility: active === f.slug ? 'hidden' : 'visible' }} className="shadow-[0_24px_40px_-24px_rgb(11_28_45/0.7)]">
                  <Cover f={f} />
                </motion.div>
                <p className="t-meta mt-4 text-slate">Volume {f.volume}</p>
                <p className="mt-1 font-serif text-[1.45rem] leading-tight">{serviceBySlug(f.slug)!.name}</p>
              </button>
            </li>
          ))}
        </ul>

        <Portal>
          <AnimatePresence>{folio && <Dossier key={folio.slug} f={folio} onClose={close} />}</AnimatePresence>
        </Portal>
      </LayoutGroup>
    </section>
  );
}

/** Renders into <body> so the open folio sits above the header and every later section. */
function Portal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.body), []);
  return el ? createPortal(children, el) : null;
}

/* ---------------------------------------------------------------- shelf */

function ShelfBook({ f, hidden, onOpen }: { f: Folio; hidden: boolean; onOpen: (s: Folio['slug'], el: HTMLElement) => void }) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const cfg = { stiffness: 160, damping: 17, mass: 0.7 };
  const h = useSpring(hover, cfg);
  const rotateY = useSpring(useTransform([px, hover], ([x, o]: number[]) => LEAN * (1 - o) + (x - 0.5) * 26 * o), cfg);
  const rotateX = useSpring(useTransform([py, hover], ([y, o]: number[]) => (0.5 - y) * 14 * o), cfg);
  const y = useTransform(h, [0, 1], [0, -24]);
  const z = useTransform(h, [0, 1], [0, 40]);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,240,215,0.32), rgba(201,122,62,0.12) 26%, transparent 58%)`;
  // the cast shadow spreads, softens and fades as the volume lifts
  const shScale = useTransform(h, [0, 1], [1, 1.28]);
  const shOpacity = useTransform(h, [0, 1], [0.55, 0.22]);
  const shBlur = useTransform(h, [0, 1], ['blur(5px)', 'blur(14px)']);

  const name = serviceBySlug(f.slug)!.name;
  const W = `calc(clamp(150px, 15.5vw, 214px) * ${f.height})`;

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduce) return;
    const b = (e.currentTarget as HTMLElement).getBoundingClientRect();
    px.set((e.clientX - b.left) / b.width);
    py.set((e.clientY - b.top) / b.height);
  };

  return (
    <div className="relative flex flex-col items-center [perspective:1400px] [perspective-origin:50%_30%]" style={{ width: W }}>
      <motion.button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Volume ${f.volume}: ${name}. Open`}
        onClick={(e) => onOpen(f.slug, e.currentTarget)}
        onPointerMove={onMove}
        onPointerEnter={() => fine && !reduce && hover.set(1)}
        onPointerLeave={() => { hover.set(0); px.set(0.5); py.set(0.5); }}
        onFocus={() => !reduce && hover.set(1)}
        onBlur={() => hover.set(0)}
        className="relative block w-full [transform-style:preserve-3d]"
        style={{ rotateY: reduce ? LEAN : rotateY, rotateX, y, z }}
      >
        <motion.div layoutId={`folio-${f.slug}`} className="relative [transform-style:preserve-3d]" style={{ visibility: hidden ? 'hidden' : 'visible' }}>
          <Cover f={f} withSpine />
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: glare, opacity: h }} />
        </motion.div>
      </motion.button>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-[6%] right-[-4%] h-6 rounded-[50%] bg-[#0b0704]"
        style={{ scaleX: shScale, opacity: hidden ? 0 : shOpacity, filter: shBlur }}
      />
    </div>
  );
}

function Credenza() {
  return (
    <div aria-hidden="true" className="relative -mt-1">
      {/* brass hairline + polished oak top */}
      <div className="h-[1.5px] bg-[linear-gradient(90deg,transparent,#8a4f1f_8%,#f3d5a6_35%,#c97a3e_60%,#8a4f1f_92%,transparent)]" />
      <div className="relative h-7 bg-[linear-gradient(180deg,#5a3d29,#3b2718_55%,#2a1b10)] shadow-[0_30px_50px_-20px_rgb(11_28_45/0.55)]">
        <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(90deg,rgb(255_255_255/0.05)_0_2px,transparent_2px_9px),linear-gradient(180deg,rgb(255_235_205/0.35),transparent_40%)]" />
      </div>
      <div className="mx-[3%] h-16 bg-[linear-gradient(180deg,#24170e,#1a100a)] [clip-path:polygon(0_0,100%_0,98%_100%,2%_100%)]">
        <div className="mx-auto h-full w-[1px] bg-[#c97a3e]/30" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- the volume */

const weave =
  'repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 3px)';

function foilText(f: Folio): React.CSSProperties {
  return {
    backgroundImage: f.foil,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.55)) drop-shadow(0 -0.5px 0 rgba(255,235,205,0.18))',
  };
}

function Cover({ f, withSpine = false }: { f: Folio; withSpine?: boolean }) {
  const s = serviceBySlug(f.slug)!;
  return (
    <div className="relative aspect-[2/3] w-full [transform-style:preserve-3d]">
      {/* front board */}
      <div
        className="absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] shadow-[inset_6px_0_10px_-6px_rgb(0_0_0/0.6),inset_0_0_0_1px_rgb(255_255_255/0.04)]"
        style={{ background: `${weave}, linear-gradient(160deg, ${f.cloth[0]}, ${f.cloth[1]})` }}
      >
        {/* blind-stamped frame */}
        <div className="absolute inset-[7%] border border-[rgb(201_122_62/0.35)]" />
        <div className="absolute inset-[9%] border border-[rgb(201_122_62/0.15)]" />
        <div className="absolute inset-[11%] flex flex-col items-center justify-between py-[8%] text-center">
          <span className="font-mono text-[clamp(0.5rem,0.7vw,0.66rem)] uppercase tracking-[0.3em]" style={foilText(f)}>
            Volume
          </span>
          <span className="flex flex-col items-center">
            <span className="font-serif text-[clamp(2.6rem,4.6vw,4.4rem)] leading-none" style={foilText(f)}>{f.volume}</span>
            <span className="mt-[10%] block h-px w-8" style={{ backgroundImage: f.foil }} />
            <span className="mt-[10%] px-1 font-serif text-[clamp(1rem,1.5vw,1.45rem)] italic leading-[1.05]" style={foilText(f)}>
              {s.shortName}
            </span>
          </span>
          <span className="font-mono text-[clamp(0.45rem,0.6vw,0.58rem)] uppercase tracking-[0.34em]" style={foilText(f)}>
            Foodbiz
          </span>
        </div>
      </div>
      {withSpine && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 flex origin-left items-center justify-center overflow-hidden"
          style={{
            width: f.thickness,
            transform: 'rotateY(90deg)',
            background: `${weave}, linear-gradient(90deg, ${f.cloth[1]}, ${f.cloth[0]} 45%, ${f.cloth[1]})`,
          }}
        >
          <span className="absolute inset-x-0 top-[7%] h-[3px]" style={{ backgroundImage: f.foil }} />
          <span className="absolute inset-x-0 top-[9%] h-px opacity-70" style={{ backgroundImage: f.foil }} />
          <span className="font-serif text-[0.95rem] italic [writing-mode:vertical-rl] [transform:rotate(180deg)]" style={foilText(f)}>
            {s.shortName}
          </span>
          <span className="absolute inset-x-0 bottom-[9%] h-px opacity-70" style={{ backgroundImage: f.foil }} />
          <span className="absolute inset-x-0 bottom-[7%] h-[3px]" style={{ backgroundImage: f.foil }} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- the opened folio */

/** A deckle (torn) edge as a polygon. `open` 0 collapses the sheet to its hinge so it can unfold. */
function deckle(side: 'left' | 'top', open: boolean, n = 30) {
  const jit = (i: number) => {
    const v = Math.sin(i * 12.9898 + (side === 'left' ? 1.7 : 4.1)) * 43758.5453;
    return (v - Math.floor(v)) * 1.8; // 0 .. 1.8%
  };
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 100;
    const d = open ? jit(i) : 0;
    pts.push(side === 'left' ? `${d.toFixed(2)}% ${t.toFixed(2)}%` : `${t.toFixed(2)}% ${d.toFixed(2)}%`);
  }
  if (side === 'left') pts.push(`${open ? 100 : 0}% 100%`, `${open ? 100 : 0}% 0%`);
  else pts.push(`100% ${open ? 100 : 0}%`, `0% ${open ? 100 : 0}%`);
  return `polygon(${pts.join(', ')})`;
}

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 639px)');
    setPhone(m.matches);
    const on = () => setPhone(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return phone;
}

function Dossier({ f, onClose }: { f: Folio; onClose: () => void }) {
  const s = serviceBySlug(f.slug)! as Service;
  const ref = useRef<HTMLDivElement>(null);
  const phone = useIsPhone();
  const reduce = useReducedMotion();
  const [full, setFull] = useState(false);
  const fullId = useId();
  const drag = useDragControls();

  // scroll lock without layout shift, focus trap, Esc
  useEffect(() => {
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: document.body.style.overflow, pad: html.style.paddingRight };
    document.body.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const els = ref.current.querySelectorAll<HTMLElement>('a[href], button');
        const a = els[0], z = els[els.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pad;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  const sheetT = { duration: reduce ? 0 : 0.95, ease: EASE, delay: reduce ? 0 : 0.18 };
  const notes = s.steps.slice(0, 3);
  const rest = s.steps.slice(3);

  const body = (
    <>
      <div className="flex items-start justify-between gap-6">
        <p className="t-meta text-copper-ink">Volume {f.volume} · {s.name}</p>
        <button type="button" data-autofocus onClick={onClose} className="t-meta -mr-2 -mt-3 flex min-h-12 shrink-0 items-center gap-2 px-2 text-navy hover:text-copper-ink">
          Close <Close />
        </button>
      </div>
      <div className="mt-2 flex items-baseline gap-5">
        <span className="font-serif text-[clamp(3rem,6vw,5.2rem)] leading-none text-copper">{f.volume}</span>
        <h3 id={`folio-${f.slug}-h`} className="font-serif text-[clamp(1.9rem,3vw,2.9rem)] leading-[1] tracking-[-0.02em]">{f.headline}</h3>
      </div>
      <p className="t-lede mt-6 max-w-[44ch]">{f.brief}</p>

      <div className="relative mt-7 aspect-[16/9] overflow-hidden bg-stone">
        <Image src={img[s.hero.key]} alt="" aria-hidden="true" fill sizes="(min-width: 640px) 40vw, 90vw" className="scale-110 object-cover blur-[14px] saturate-[1.15]" />
        <Image
          src={img[s.hero.key]}
          alt={s.hero.alt}
          fill
          sizes="(min-width: 640px) 40vw, 90vw"
          placeholder="blur"
          className="object-cover [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_55%,transparent_100%)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(255_200_140/0.18),transparent_60%)] mix-blend-soft-light" />
      </div>

      <div className="mt-8">
        <p className="t-meta text-slate">Run sheet</p>
        <ol className="mt-3 border-t border-stone">
          {notes.map((st, i) => (
            <li key={st.title} className="grid grid-cols-[2.2rem_1fr] gap-x-3 border-b border-stone py-3.5">
              <span className="font-serif text-[1.35rem] leading-none text-copper">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="font-serif text-[1.25rem] leading-tight">{st.title}</span>
                <span className="muted mt-1 block text-[0.92rem]">{st.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence initial={false}>
        {full && (
          <motion.div
            id={fullId}
            key="full"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            {rest.length > 0 && (
              <ol className="border-stone" start={4}>
                {rest.map((st, i) => (
                  <li key={st.title} className="grid grid-cols-[2.2rem_1fr] gap-x-3 border-b border-stone py-3.5">
                    <span className="font-serif text-[1.35rem] leading-none text-copper">{String(i + 4).padStart(2, '0')}</span>
                    <span>
                      <span className="font-serif text-[1.25rem] leading-tight">{st.title}</span>
                      <span className="muted mt-1 block text-[0.92rem]">{st.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="t-meta mt-8 text-slate">{s.formatsTitle}</p>
            <ul className="mt-3 grid gap-px bg-stone sm:grid-cols-2">
              {s.formats.map((x) => (
                <li key={x.title} className="bg-paper p-4">
                  <span className="font-serif text-[1.2rem] leading-tight">{x.title}</span>
                  <span className="muted mt-1 block text-[0.9rem]"><Txt>{x.text}</Txt></span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[46ch] font-serif text-[1.3rem] italic leading-snug">{s.promise}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
        <button type="button" aria-expanded={full} aria-controls={fullId} onClick={() => setFull((v) => !v)} className="link-arrow text-left">
          {full ? `Fold ${s.shortName} away` : `Explore ${s.shortName} in full`} <ArrowLong className={full ? '-rotate-90' : ''} />
        </button>
        <Link href={`/?service=${f.slug}#plan`} scroll={false} onClick={onClose} className="link-arrow">
          Plan this event <ArrowLong />
        </Link>
      </div>
    </>
  );

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`folio-${f.slug}-h`}
      className="fixed inset-0 z-[150]"
      exit={{ opacity: 1, transition: { duration: 0.7 } }}
    >
      <motion.div
        className="absolute inset-0 bg-navy/60 backdrop-blur-[6px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.2 } }}
        aria-hidden="true"
      />

      {phone ? (
        /* bottom sheet */
        <motion.div
          className="absolute inset-x-0 bottom-0 max-h-[90svh] overflow-y-auto overscroll-contain bg-paper px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-10 shadow-[0_-20px_60px_-20px_rgb(11_28_45/0.6)]"
          initial={{ y: '100%', clipPath: deckle('top', true) }}
          animate={{ y: 0, clipPath: deckle('top', true) }}
          exit={{ y: '100%', transition: { duration: 0.45, ease: EASE } }}
          transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
          drag="y"
          dragListener={false}
          dragControls={drag}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={onDragEnd}
        >
          <div className="absolute inset-x-0 top-0 flex h-10 cursor-grab touch-none justify-center pt-4" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-navy/20" />
          </div>
          <motion.div layoutId={`folio-m-${f.slug}`} className="mx-auto mb-6 w-[38%] max-w-[150px] shadow-[0_20px_40px_-20px_rgb(11_28_45/0.7)]">
            <Cover f={f} />
          </motion.div>
          {body}
        </motion.div>
      ) : (
        /* the volume comes forward; the deckle sheet unfolds beside it */
        <div className="pointer-events-none relative mx-auto grid h-full max-w-[1240px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] items-center gap-[4vw] px-[var(--gutter)]">
          <div className="flex justify-end [perspective:1400px]">
            <motion.div layoutId={`folio-${f.slug}`} className="pointer-events-auto w-full max-w-[340px] shadow-[0_50px_80px_-30px_rgb(0_0_0/0.75)]" transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}>
              <Cover f={f} />
            </motion.div>
          </div>
          <motion.div
            className="grain pointer-events-auto relative max-h-[86svh] overflow-y-auto overscroll-contain bg-paper py-10 pl-12 pr-10 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)] [transform-origin:left_center]"
            initial={{ clipPath: deckle('left', false), rotateY: -28, opacity: 0.6 }}
            animate={{ clipPath: deckle('left', true), rotateY: 0, opacity: 1 }}
            exit={{ clipPath: deckle('left', false), rotateY: -20, opacity: 0, transition: { duration: 0.45, ease: EASE } }}
            transition={sheetT}
          >
            {body}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
