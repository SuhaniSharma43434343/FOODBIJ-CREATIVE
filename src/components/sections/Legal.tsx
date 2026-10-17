import { Txt } from '@/components/ui/Txt';

export function Legal({ title, items }: { title: string; items: { h: string; p: string }[] }) {
  return (
    <section className="wrap max-w-[820px] pb-24 pt-[calc(var(--header-h)+64px)]">
      <p className="t-meta text-copper-ink">Legal / draft for Foodbiz&apos;s counsel. Not legal advice.</p>
      <h1 className="t-h1 mt-4">{title}</h1>
      {items.map((it) => (
        <div key={it.h} className="border-b border-stone py-7">
          <h2 className="font-serif text-[1.8rem] leading-tight">{it.h}</h2>
          <p className="muted mt-3 max-w-[60ch]"><Txt>{it.p}</Txt></p>
        </div>
      ))}
    </section>
  );
}
