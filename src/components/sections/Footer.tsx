import Link from 'next/link';
import { FullLogo } from '@/components/ui/Logo';
import { Txt } from '@/components/ui/Txt';
import { services, site } from '@/lib/content';

export function Footer() {
  return (
    <footer className="bg-navy pb-28 pt-14 text-linen lg:pb-8 lg:pt-16" data-cta-zone="">
      <div className="wrap grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <FullLogo light className="h-auto w-[200px]" />
          <p className="mt-6 max-w-[24ch] font-serif text-[1.6rem] italic leading-snug text-linen/90">{site.closer}</p>
        </div>
        <nav aria-label="Services">
          <p className="t-meta text-[#e3b58a]">Services</p>
          <ul className="mt-4">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/?service=${s.slug}#plan`} className="flex min-h-11 items-center text-linen/80 hover:text-[#e3b58a]">{s.menuLabel}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Foodbiz">
          <p className="t-meta text-[#e3b58a]">Foodbiz</p>
          <ul className="mt-4">
            {[['#live', 'Live counters'], ['#work', 'Our work'], ['#story', 'Our story'], ['#plan', 'Plan your event']].map(([h, l]) => (
              <li key={h}><Link href={h} className="flex min-h-11 items-center text-linen/80 hover:text-[#e3b58a]">{l}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="t-meta text-[#e3b58a]">Contact</p>
          <address className="mt-4 grid gap-3 text-[0.95rem] not-italic text-linen/80">
            <span><Txt>{site.address}</Txt></span>
            <span><Txt>{site.phone}</Txt></span>
            <span><Txt>{site.email}</Txt></span>
            <span>Instagram: <Txt>{site.instagram}</Txt></span>
          </address>
        </div>
      </div>
      <div className="wrap mt-14 flex flex-col gap-3 border-t border-linen/10 pt-6 text-sm text-linen/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {site.legalName}. All rights reserved.</p>
        <ul className="flex gap-6">
          <li><Link href="/privacy" className="flex min-h-11 items-center hover:text-[#e3b58a]">Privacy</Link></li>
          <li><Link href="/terms" className="flex min-h-11 items-center hover:text-[#e3b58a]">Terms</Link></li>
        </ul>
      </div>
    </footer>
  );
}
