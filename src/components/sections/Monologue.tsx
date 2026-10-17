import { founders } from '@/lib/content';
import { Reveal, SplitRise } from '@/components/fx/Reveal';
import { FloorTeamFrame } from './FloorTeamFrame';

/** Founders' monologue: the floor-team print on the left, the founders' line in navy italic on linen. */
export function Monologue() {
  return (
    <section id="story" className="sec" aria-label="What we believe">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="pb-8 lg:col-span-5">
          <FloorTeamFrame />
        </div>
        <figure className="lg:col-span-6 lg:col-start-7">
          <p className="t-meta text-copper-ink">In their words</p>
          <blockquote className="mt-6">
            <SplitRise as="p" text={founders.quote} className="font-serif text-[clamp(2.2rem,4.4vw,4.6rem)] italic leading-[1.02] tracking-[-0.02em]" />
          </blockquote>
          <Reveal delay={300}>
            <figcaption className="t-meta mt-8 flex items-center gap-4 text-navy">
              <span className="h-px w-12 bg-copper" aria-hidden="true" />
              {founders.by}
            </figcaption>
            <p className="muted mt-8 max-w-[42ch]">
              Food, service and presentation, all at once. You hand us the stress; you get to be a guest at your own event.
            </p>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
