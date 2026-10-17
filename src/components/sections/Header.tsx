'use client';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/content';
import { Wordmark } from '@/components/ui/Logo';
import { ArrowLong, Close } from '@/components/ui/Icons';

const EASE = [0.2, 0.7, 0.1, 1] as const;
const links: [string, string][] = [
  ['#services', 'Services'],
  ['#live', 'Live counters'],
  ['#work', 'Our work'],
  ['#story', 'Our story'],
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a, button');
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); toggle.current?.focus(); };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled ? 'bg-linen/85 shadow-[0_1px_0_var(--color-stone)] backdrop-blur-xl backdrop-saturate-150' : 'bg-linen/55 backdrop-blur-md'
        }`}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Link href="/" className="flex min-h-12 items-center" aria-label="Foodbiz, home">
            <Wordmark className="h-[17px] w-auto lg:h-[20px]" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map(([href, l]) => (
              <Link key={href} href={href} className="t-meta flex min-h-12 items-center px-4 text-navy/80 transition-colors hover:text-copper-ink">
                {l}
              </Link>
            ))}
            <Link href="#plan" className="btn btn-navy ml-3 min-h-[46px] px-5">
              Plan your event <ArrowLong />
            </Link>
          </nav>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen(true)}
            className="t-meta -mr-3 flex min-h-12 items-center gap-3 px-3 text-navy lg:hidden"
          >
            Menu
            <span className="flex w-6 flex-col gap-[6px]" aria-hidden="true">
              <span className="h-px w-full bg-navy" />
              <span className="ml-auto h-px w-4 bg-copper" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-[160] flex flex-col overflow-y-auto bg-linen"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.55, ease: EASE } }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="wrap flex shrink-0 items-center justify-between" style={{ height: 'var(--header-h)' }}>
              <Wordmark className="h-[17px] w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="t-meta -mr-3 flex min-h-12 items-center gap-3 px-3">
                Close <Close />
              </button>
            </div>
            <nav aria-label="Menu" className="wrap flex flex-1 flex-col pb-8 pt-6">
              <p className="t-meta text-copper-ink">Services</p>
              <ul className="mt-3 border-t border-stone">
                {services.map((s, i) => (
                  <motion.li key={s.slug} className="border-b border-stone" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}>
                    <Link href={`/?service=${s.slug}#plan`} scroll={false} onClick={() => setOpen(false)} className="group flex min-h-[60px] items-baseline gap-4 py-2">
                      <span className="t-meta w-7 text-copper">{s.numeral}</span>
                      <span className="font-serif text-[1.75rem] leading-tight">{s.menuLabel}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="mt-6">
                {links.slice(1).map(([href, l]) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} className="t-meta flex min-h-12 items-center">{l}</Link>
                  </li>
                ))}
              </ul>
              <Link href="#plan" onClick={() => setOpen(false)} className="btn btn-navy mt-auto w-full">
                Plan your event <ArrowLong />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
