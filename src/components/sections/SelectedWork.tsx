'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { img } from '@/lib/images';
import { services, stories, type RunSheet, type Story } from '@/lib/content';
import { featuredWork } from '@/lib/avant';
import { Reveal, SplitRise } from '@/components/fx/Reveal';
import { ArrowLong, Close } from '@/components/ui/Icons';
import { Txt } from '@/components/ui/Txt';

const EASE = [0.2, 0.7, 0.1, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

// four frames, four different sizes and offsets: an editorial spread, not a grid
const SLOTS = [
  { li: 'lg:col-span-7', aspect: 'aspect-[4/5]', sizes: '(min-width:1024px) 55vw, 92vw' },
  { li: 'lg:col-span-4 lg:col-start-9 lg:mt-40', aspect: 'aspect-[3/4]', sizes: '(min-width:1024px) 32vw, 92vw' },
  // the mats carry the captions now, so the second row clears the first instead of tucking under it
  { li: 'lg:col-span-4 lg:col-start-2 lg:mt-20', aspect: 'aspect-square', sizes: '(min-width:1024px) 32vw, 92vw' },
  { li: 'lg:col-span-6 lg:col-start-7 lg:mt-44', aspect: 'aspect-[16/11]', sizes: '(min-width:1024px) 48vw, 92vw' },
];
type Slot = (typeof SLOTS)[number];

// the photo print peels back on a hinge at its bottom-left corner; the shadow under it deepens
const SHADOW_REST = '0 1px 2px rgba(11,28,45,0.06), 0px 10px 24px -14px rgba(11,28,45,0.3)';
const SHADOW_PEEL = '0 1px 2px rgba(11,28,45,0.06), 14px 28px 48px -12px rgba(11,28,45,0.28)';
const REST = { rotateZ: 0, rotateY: 0, y: 0, x: 0, scale: 1, boxShadow: SHADOW_REST };
const PEEL = { rotateZ: -3.8, rotateY: -7, y: -14, x: -8, scale: 1.02, boxShadow: SHADOW_PEEL };
const SPRING = { type: 'spring', stiffness: 240, damping: 18, mass: 0.7 } as const;

const sheetRows = (s: RunSheet) =>
  [
    ['Scale', s.scale],
    ['Service format', s.format],
    ['Chef brigade', s.brigade],
    ['Run time', s.runTime],
    ['Dietary', s.dietary],
  ] as const;

/** Touch screens peel on the first tap and open on the second. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(hover: none) and (pointer: coarse)');
    const pick = () => setCoarse(m.matches);
    pick();
    m.addEventListener('change', pick);
    return () => m.removeEventListener('change', pick);
  }, []);
  return coarse;
}

/**
 * Selected work: four real stories as layered event dossiers. A photo print rests on the printed run sheet;
 * hover, focus or a first tap peels it back, and a click morphs the photo into a full-bleed dossier (FLIP, no reload).
 */
export function SelectedWork() {
  const list = featuredWork.map((s) => stories.find((x) => x.slug === s)!);
  const [active, setActive] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const t = { duration: reduce ? 0 : 0.8, ease: EASE };
  const story = list.find((s) => s.slug === active) ?? null;

  const open = useCallback((slug: string, el: HTMLElement) => {
    trigger.current = el;
    setActive(slug);
    const u = new URL(location.href);
    u.searchParams.set('story', slug);
    history.replaceState(null, '', u);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    const u = new URL(location.href);
    u.searchParams.delete('story');
    history.replaceState(null, '', u);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);
  useEffect(() => {
    const slug = new URL(location.href).searchParams.get('story');
    if (slug && featuredWork.includes(slug)) setActive(slug);
  }, []);

  return (
    <section id="work" className="py-20 md:py-32" aria-labelledby="work-h">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="t-meta text-copper-ink">Selected work</p>
            <SplitRise id="work-h" text="Every event starts with a brief." italic={[4]} className="t-h1 mt-5" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="muted max-w-[40ch]">What the client asked for, then what we made. Lift a photo to read the run sheet under it.</p>
          </Reveal>
        </div>

        <LayoutGroup>
          <ul className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
            {list.map((s, i) => (
              <Reveal as="li" key={s.slug} className={`relative hover:z-10 focus-within:z-10 ${SLOTS[i].li}`}>
                <DossierCard
                  story={s}
                  index={i}
                  total={list.length}
                  slot={SLOTS[i]}
                  hidden={active === s.slug}
                  coarse={coarse}
                  reduce={!!reduce}
                  t={t}
                  onSelect={(el) => open(s.slug, el)}
                />
              </Reveal>
            ))}
          </ul>
          <AnimatePresence>{story && <Dossier key={story.slug} story={story} onClose={close} t={t} />}</AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

function DossierCard({
  story, index, total, slot, hidden, coarse, reduce, t, onSelect,
}: {
  story: Story; index: number; total: number; slot: Slot; hidden: boolean; coarse: boolean; reduce: boolean;
  t: { duration: number; ease: typeof EASE }; onSelect: (el: HTMLElement) => void;
}) {
  const [peel, setPeel] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const svc = services.find((x) => x.slug === story.service)!;
  const spring = reduce ? { duration: 0 } : SPRING;

  // touch: tapping outside the card, or scrolling, lays the print back down
  useEffect(() => {
    if (!peel || !coarse) return;
    const away = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setPeel(false);
    const settle = () => setPeel(false);
    document.addEventListener('pointerdown', away);
    window.addEventListener('scroll', settle, { passive: true });
    return () => { document.removeEventListener('pointerdown', away); window.removeEventListener('scroll', settle); };
  }, [peel, coarse]);

  const hover = (on: boolean) => (e: React.PointerEvent) => e.pointerType !== 'touch' && !coarse && setPeel(on);

  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      aria-label={`${story.title}. ${svc.name}. Open the event dossier`}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && setPeel(true)}
      onBlur={() => setPeel(false)}
      onClick={(e) => {
        if (coarse && !peel) return setPeel(true);
        setPeel(false);
        onSelect(e.currentTarget);
      }}
      className="group relative block w-full select-none text-left outline-none [-webkit-tap-highlight-color:transparent] [perspective:1400px]"
    >
      {/* underneath: the printed run sheet, 3px of its edge showing below the print */}
      {story.sheet && (
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={peel ? { x: 12, y: 8, rotateZ: 1.2 } : { x: 0, y: 0, rotateZ: 0 }}
          transition={spring}
          style={{ transformOrigin: 'top left' }}
          className="absolute inset-x-0 top-0 -bottom-[3px] flex flex-col justify-between overflow-hidden rounded-sm border border-[#E2DDD5] bg-paper p-5 md:p-6"
        >
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-[#E2DDD5] pb-3 font-mono text-[0.66rem] uppercase tracking-[0.15em]">
              <span className="text-slate">Confidential brief</span>
              <span className="text-right text-copper-ink">
                Dossier {pad(index + 1)} / {pad(total)}
                {story.city && ` · ${story.city}`}
              </span>
            </div>
            <dl className="mt-3 divide-y divide-[#E2DDD5]/70">
              {sheetRows(story.sheet).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-5 py-2.5">
                  <dt className="shrink-0 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-copper-ink/80">{k}:</dt>
                  <dd className="text-right text-[0.82rem] leading-snug text-navy"><Txt>{v}</Txt></dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="flex items-center justify-end gap-3 border-t border-[#E2DDD5] pt-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.15em] text-copper-ink">
            Open full event dossier <ArrowLong />
          </p>
        </motion.div>
      )}

      {/* on top: the photo print in its white mat */}
      <motion.div
        initial={false}
        animate={peel ? PEEL : REST}
        transition={spring}
        style={{ transformOrigin: 'bottom left' }}
        className="relative rounded-sm bg-white p-3 ring-1 ring-stone will-change-transform group-focus-visible:ring-2 group-focus-visible:ring-copper"
      >
        <motion.div layoutId={`img-${story.slug}`} transition={t} className={`relative overflow-hidden bg-navy-2 ${slot.aspect}`} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
          <Image src={img[story.cover.key]} alt={story.cover.alt} fill sizes={slot.sizes} placeholder="blur" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.04]" />
        </motion.div>
        <ArchiveStamp id={story.slug} glint={peel && !reduce} />
        <div className="px-2 pb-2 pt-5">
          <p className="t-meta text-[0.66rem] text-copper-ink">{svc.name}</p>
          <h3 className="mt-2 font-serif text-[clamp(1.8rem,2.4vw,2.5rem)] leading-[1] text-navy">{story.title}</h3>
          <div className="mt-3 flex items-end justify-between gap-6">
            <p className="muted line-clamp-2 max-w-[42ch] text-[0.95rem]">{story.caption}</p>
            <span className="mb-2 shrink-0"><ArrowLong /></span>
          </div>
        </div>
      </motion.div>
    </button>
  );
}

/** Embossed copper-foil archive stamp; a specular gleam sweeps across it as the print peels. */
function ArchiveStamp({ id, glint }: { id: string; glint: boolean }) {
  const ring = `stamp-ring-${id}`;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-6 top-6 z-10 block size-[68px] overflow-hidden rounded-full shadow-[inset_0_1px_1px_rgba(255,240,215,0.85),inset_0_-1px_2px_rgba(90,52,24,0.5),0_2px_6px_rgba(11,28,45,0.3)]"
      style={{ background: 'radial-gradient(circle at 35% 28%, #F3D5A6, #C97A3E 55%, #8A4F1F)' }}
    >
      <svg viewBox="0 0 68 68" className="absolute inset-0 h-full w-full">
        <defs>
          <path id={ring} d="M34,34 m-24,0 a24,24 0 1,1 48,0 a24,24 0 1,1 -48,0" />
        </defs>
        <circle cx="34" cy="34" r="31" fill="none" stroke="rgba(74,42,16,0.45)" strokeWidth="0.7" />
        <circle cx="34" cy="34" r="18" fill="none" stroke="rgba(74,42,16,0.45)" strokeWidth="0.7" />
        <text fontFamily="var(--font-meta), monospace" fontSize="5.4" fill="#4A2A10">
          <textPath href={`#${ring}`} textLength="148" lengthAdjust="spacing">✦ ARCHIVE · 2026 ✦ FOODBIZ · MUMBAI</textPath>
        </text>
        <text x="34" y="37.6" textAnchor="middle" fontSize="10" fill="#4A2A10">✦</text>
      </svg>
      <motion.span
        className="absolute inset-0"
        initial={false}
        animate={{ x: glint ? '120%' : '-120%' }}
        transition={glint ? { duration: 0.65, ease: EASE } : { duration: 0 }}
        style={{ background: 'linear-gradient(115deg, transparent 32%, rgba(255,246,228,0.95) 50%, transparent 68%)', mixBlendMode: 'screen' }}
      />
    </span>
  );
}

function Dossier({ story, onClose, t }: { story: Story; onClose: () => void; t: { duration: number; ease: typeof EASE } }) {
  const ref = useRef<HTMLDivElement>(null);
  const svc = services.find((x) => x.slug === story.service)!;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href], button');
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const glide = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.3 + d } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  });

  return (
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`dossier-${story.slug}`} className="fixed inset-0 z-[150] overflow-y-auto overscroll-contain" exit={{ opacity: 1, transition: { duration: 0.65 } }}>
      <motion.div aria-hidden="true" className="fixed inset-0 bg-linen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.15 } }} />
      <div className="relative min-h-full lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative h-[58svh] lg:sticky lg:top-0 lg:h-svh">
          <motion.div layoutId={`img-${story.slug}`} transition={t} className="absolute inset-0 overflow-hidden">
            <Image src={img[story.cover.key]} alt={story.cover.alt} fill priority sizes="(min-width: 1024px) 56vw, 100vw" placeholder="blur" className="object-cover" />
          </motion.div>
        </div>
        <div className="relative px-[var(--gutter)] pb-28 pt-10 lg:px-16 lg:pt-28">
          <motion.button {...glide(0)} type="button" data-autofocus onClick={onClose} className="btn btn-navy fixed right-4 top-4 z-10 min-h-12 px-5 lg:right-8 lg:top-8">
            Close <Close />
          </motion.button>
          <motion.p {...glide(0)} className="t-meta text-copper-ink">{svc.numeral} / {svc.name}</motion.p>
          <motion.h2 {...glide(0.05)} id={`dossier-${story.slug}`} className="t-h1 mt-4">{story.title}</motion.h2>
          <motion.p {...glide(0.1)} className="t-meta mt-4 text-slate"><Txt>{story.client}</Txt></motion.p>
          <motion.dl {...glide(0.15)} className="mt-10 border-t border-stone">
            <div className="border-b border-stone py-6">
              <dt className="t-meta text-copper-ink">The brief</dt>
              <dd className="t-lede mt-2 max-w-[44ch]"><Txt>{story.brief}</Txt></dd>
            </div>
            <div className="border-b border-stone py-6">
              <dt className="t-meta text-copper-ink">What we made</dt>
              <dd className="muted mt-2 max-w-[48ch]">{story.made}</dd>
              <dd className="muted mt-2 max-w-[48ch]">{story.caption}</dd>
            </div>
            {story.liveStation && (
              <div className="border-b border-stone py-6">
                <dt className="t-meta text-copper-ink">Live counter</dt>
                <dd className="mt-2 font-serif text-[1.5rem] italic leading-snug">{story.liveStation}</dd>
              </div>
            )}
          </motion.dl>
          {story.sheet && (
            <motion.div {...glide(0.2)} className="mt-8 border border-[#E2DDD5] bg-paper p-5 md:p-6">
              <p className="t-meta border-b border-[#E2DDD5] pb-3 text-copper-ink">Operational run sheet</p>
              <dl className="grid gap-x-6 sm:grid-cols-2">
                {sheetRows(story.sheet).map(([k, v]) => (
                  <div key={k} className="border-b border-[#E2DDD5]/70 py-3">
                    <dt className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-copper-ink/80">{k}</dt>
                    <dd className="mt-1 text-[0.95rem] text-navy"><Txt>{v}</Txt></dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}
          {story.photos.length > 0 && (
            <motion.ul {...glide(0.25)} className="mt-8 grid grid-cols-2 gap-3">
              {story.photos.map((p, i) => (
                <li key={p.key} className={`paper relative overflow-hidden ${i === 0 && story.photos.length % 2 === 1 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'}`}>
                  <Image src={img[p.key]} alt={p.alt} fill sizes="(min-width: 1024px) 22vw, 46vw" placeholder="blur" className="object-cover" />
                </li>
              ))}
            </motion.ul>
          )}
          <motion.div {...glide(0.3)} className="mt-10">
            <Link href={`/?service=${story.service}&like=${story.slug}#plan`} scroll={false} onClick={onClose} className="btn btn-navy">
              Brief us on something similar <ArrowLong />
            </Link>
            <p className="mt-6 text-sm text-slate">Client names on this preview come from the photo library and are not yet cleared for publication.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
