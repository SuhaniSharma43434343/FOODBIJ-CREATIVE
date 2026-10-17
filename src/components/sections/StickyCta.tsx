'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLong } from '@/components/ui/Icons';

/** Floating phone CTA: hidden over the hero, the blueprint and the footer. */
export function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const zones = new Set<Element>();
    let past = false;
    const update = () => setShow(past && zones.size === 0);
    const onScroll = () => { past = window.scrollY > window.innerHeight * 0.8; update(); };
    const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? zones.add(e.target) : zones.delete(e.target))); update(); });
    document.querySelectorAll('[data-cta-zone]').forEach((el) => io.observe(el));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  return (
    <div
      className={`fixed inset-x-0 z-[90] flex justify-center px-4 transition-all duration-500 lg:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'}`}
      style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      aria-hidden={!show}
    >
      <Link href="#plan" tabIndex={show ? 0 : -1} className="btn btn-navy w-full max-w-[420px] shadow-[0_14px_34px_-14px_rgb(11_28_45/0.55)]">
        Plan your event <ArrowLong />
      </Link>
    </div>
  );
}
