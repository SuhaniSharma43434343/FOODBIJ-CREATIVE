import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/images';
import { heroSub } from '@/lib/avant';
import { ArrowLong } from '@/components/ui/Icons';

const WORDS = ['Be', 'a', 'guest', 'at', 'your', 'own', 'event.'];

/**
 * Full-bleed daylight photograph, navy headline set on the pale wall of the frame.
 * The photo settles slowly; the headline rises word by word out of hairline slits (45ms apart).
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden" aria-labelledby="hero-h">
      <div className="settle absolute inset-x-0 bottom-0 top-[57%] -z-10 lg:top-0">
        <Image
          src={img['cartier-07']}
          alt="A slate of tartlets and choux finished with edible flowers, carried by a server"
          fill
          priority
          placeholder="blur"
          sizes="(orientation: portrait) 120vh, 100vw"
          className="object-cover [object-position:46%_58%] lg:[object-position:50%_62%]"
        />
        {/* linen wash so navy type sits on the pale wall: top on phones, left on desktop */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(245_241_235/1)_0%,rgb(245_241_235/0)_28%)] lg:bg-[linear-gradient(90deg,rgb(245_241_235/0.94)_0%,rgb(245_241_235/0.72)_34%,rgb(245_241_235/0)_58%)]" />
      </div>

      <div className="wrap flex flex-1 flex-col pb-10 pt-[calc(var(--header-h)+28px)] lg:justify-center lg:pb-16 lg:pt-[var(--header-h)]">
        <p className="rise t-meta inline-flex w-fit items-center gap-2.5 whitespace-nowrap border border-navy/15 bg-paper/70 px-3 py-2 text-[0.64rem] tracking-[0.1em] backdrop-blur-sm sm:gap-3 sm:text-[0.72rem] sm:tracking-[0.15em]" style={{ animationDelay: '0.2s' }}>
          <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
          19.0760° N / 72.8777° E · Mumbai
        </p>
        <h1 id="hero-h" className="t-display mt-6 max-w-[9ch] text-navy" aria-label="Be a guest at your own event.">
          {WORDS.map((w, i) => (
            <span key={i} className="lp" aria-hidden="true">
              <span className={`lp-i ${w === 'own' ? 'copper-text pr-[0.04em]' : ''}`} style={{ ['--i' as string]: i }}>
                {w}
              </span>
              {i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
        <div className="hairline mt-7 h-px w-full max-w-[min(100%,520px)] bg-navy/25" aria-hidden="true" />
        <p className="rise t-lede mt-6 max-w-[38ch] text-navy/85" style={{ animationDelay: '0.75s' }}>
          {heroSub}
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3 max-lg:mt-auto" style={{ animationDelay: '0.9s' }}>
          <Link href="#plan" className="btn btn-navy">
            Plan your event <ArrowLong />
          </Link>
          <Link href="#services" className="btn btn-line bg-paper/60 backdrop-blur-sm max-sm:hidden">
            What we do <ArrowLong />
          </Link>
        </div>
      </div>
    </section>
  );
}
