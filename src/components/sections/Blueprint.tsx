'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { guestRanges, services, site, stories } from '@/lib/content';
import { Reveal, SplitRise } from '@/components/fx/Reveal';
import { ArrowLong, Check } from '@/components/ui/Icons';
import { Txt } from '@/components/ui/Txt';

type F = { name: string; phone: string; email: string; service: string; date: string; guests: string; city: string; brief: string };

const empty: F = { name: '', phone: '', email: '', service: '', date: '', guests: '', city: '', brief: '' };

const labels: Record<keyof F, string> = {
  name: 'Your name',
  phone: 'Phone',
  email: 'Email',
  service: 'Type of event',
  date: 'Date, roughly',
  guests: 'How many guests',
  city: 'City or venue',
  brief: 'Anything we should know',
};

// the sheet counts these; contact details stay off the printed brief's tally
const TALLY: (keyof F)[] = ['name', 'service', 'date', 'guests', 'city', 'brief'];
const pad = (n: number) => String(n).padStart(2, '0');
const placeholder = (v: string) => v.startsWith('[NEEDS CLIENT');

function validate(f: F) {
  const e: Partial<Record<keyof F, string>> = {};
  if (!f.name.trim()) e.name = 'Please tell us your name.';
  const digits = f.phone.replace(/\D/g, '');
  if (!f.phone.trim() && !f.email.trim()) e.phone = 'Please leave a phone number or an email, so we can reply.';
  else if (f.phone.trim() && (digits.length < 8 || digits.length > 15)) e.phone = 'Please check this phone number.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please check this email address.';
  if (!f.service) e.service = 'Please choose the kind of event.';
  return e;
}

/**
 * Plan your event: a paper form on the left, and the brief printing itself on a paper sheet on the right as you type.
 * No backend yet: the brief is copied, or sent on WhatsApp once the client's number is in content.ts.
 */
export function Blueprint() {
  const params = useSearchParams();
  const [f, setF] = useState<F>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLDivElement>(null);

  // arriving from a service or a story pre-fills the form
  useEffect(() => {
    const s = params.get('service');
    const like = stories.find((x) => x.slug === params.get('like'));
    setF((v) => {
      let brief = v.brief;
      if (like && !brief.includes(like.title)) brief = [brief, `Something like "${like.title}" from your work.`].filter(Boolean).join('\n');
      return { ...v, service: s && services.some((x) => x.slug === s) ? s : v.service, brief };
    });
    if (params.toString() && window.location.hash === '#plan') {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => document.getElementById('plan')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' }));
    }
  }, [params]);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    setDone(false);
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined, ...(k === 'email' ? { phone: undefined } : {}) }));
  };

  const svcName = services.find((s) => s.slug === f.service)?.name ?? '';

  const text = useMemo(() => {
    const l = ['Foodbiz: event brief', ''];
    if (f.name) l.push(`Name: ${f.name}`);
    if (f.phone) l.push(`Phone: ${f.phone}`);
    if (f.email) l.push(`Email: ${f.email}`);
    if (svcName) l.push(`Event: ${svcName}`);
    if (f.date) l.push(`Date: ${f.date}`);
    if (f.guests) l.push(`Guests: ${f.guests}`);
    if (f.city) l.push(`City or venue: ${f.city}`);
    if (f.brief) l.push('', f.brief);
    return l.join('\n');
  }, [f, svcName]);

  const wa = site.whatsapp.replace(/\D/g, '');
  const whatsappUrl = !placeholder(site.whatsapp) && wa ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}` : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) return requestAnimationFrame(() => summary.current?.focus());
    setDone(true);
    requestAnimationFrame(() => result.current?.focus());
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const fp = (k: keyof F) => ({
    id: `f-${k}`,
    name: k,
    value: f[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `f-${k}-err` : undefined,
  });
  const err = (k: keyof F) => errors[k] && <p className="err" id={`f-${k}-err`}>{errors[k]}</p>;
  const label = (k: keyof F, n: number, hint?: string) => (
    <label htmlFor={`f-${k}`} className="flex items-baseline justify-between gap-4">
      <span><span className="mr-2 text-copper-ink">{pad(n)}</span>{labels[k]}</span>
      {hint && <span className="normal-case tracking-normal text-slate/70">{hint}</span>}
    </label>
  );

  const errList = Object.entries(errors).filter(([, v]) => v) as [keyof F, string][];
  const filled = TALLY.filter((k) => f[k]).length;

  return (
    <section id="plan" className="grain relative bg-linen sec" aria-labelledby="plan-h" data-cta-zone="">
      <div className="wrap">
        <div className="grid gap-6 border-b border-stone pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-meta text-copper-ink">Plan your event</p>
            <SplitRise id="plan-h" text="Tell us what you are planning." italic={[4]} className="t-h1 mt-5 max-w-[14ch]" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="muted max-w-[40ch]">
              A name, the kind of event and a way to reach you is enough to start. Your brief writes itself as you go: beside the form on a laptop, below it on a phone.
            </p>
          </Reveal>
        </div>

        <div className="gap-sec grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* the form, on paper */}
          <div className="border border-stone bg-paper p-5 sm:p-10 lg:col-span-7">
            <form onSubmit={submit} noValidate className="grid gap-7">
              {errList.length > 0 && (
                <div ref={summary} tabIndex={-1} role="alert" className="border-l-2 border-[#a23b2a] bg-[#a23b2a]/[0.05] p-5 outline-none">
                  <p className="font-medium text-[#a23b2a]">A few details are missing.</p>
                  <ul className="mt-2 grid gap-1.5 text-[0.95rem]">
                    {errList.map(([k, m]) => (
                      <li key={k}>
                        <a href={`#f-${k}`} className="underline decoration-copper underline-offset-4 hover:text-copper-ink">{labels[k]}: {m}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="field">
                {label('name', 1)}
                <input {...fp('name')} autoComplete="name" />
                {err('name')}
              </div>

              <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
                <div className="field">
                  {label('phone', 2)}
                  <input {...fp('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />
                  {err('phone')}
                </div>
                <div className="field">
                  {label('email', 3)}
                  <input {...fp('email')} type="email" inputMode="email" autoComplete="email" />
                  {err('email')}
                </div>
              </div>

              <div className="field">
                {label('service', 4)}
                <select {...fp('service')}>
                  <option value="">Choose one</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
                {err('service')}
              </div>

              <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
                <div className="field">
                  {label('date', 5)}
                  <input {...fp('date')} placeholder="December 2026, or not fixed yet" />
                </div>
                <div className="field">
                  {label('guests', 6)}
                  <select {...fp('guests')}>
                    <option value="">Choose a range</option>
                    {guestRanges.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                {label('city', 7)}
                <input {...fp('city')} autoComplete="address-level2" placeholder="Mumbai, Alibaug, at home…" />
              </div>

              <div className="field">
                {label('brief', 8, 'Optional')}
                <textarea {...fp('brief')} rows={4} placeholder="The occasion, the dishes that have to be there, dietary needs, anything already fixed." />
              </div>

              <div className="flex flex-col gap-4 border-t border-stone pt-7 sm:flex-row sm:items-center sm:gap-6">
                <button type="submit" className="btn btn-navy">
                  Finish my brief <ArrowLong />
                </button>
                <p className="text-[0.9rem] text-slate sm:max-w-[34ch]">Nothing is sent yet. You copy the brief, or send it to us on WhatsApp.</p>
              </div>
            </form>
          </div>

          {/* the brief, printing itself as you type */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-5" aria-label="Your brief">
            <div
              ref={result}
              tabIndex={-1}
              className="relative bg-white p-6 shadow-[0_1px_2px_rgba(11,28,45,0.06),0_24px_48px_-28px_rgba(11,28,45,0.35)] outline-none ring-1 ring-stone focus-visible:ring-2 focus-visible:ring-copper sm:p-8"
            >
              {/* perforated tear-line, as on the live-pass tickets */}
              <span aria-hidden="true" className="absolute inset-x-0 -top-[5px] h-[6px]" style={{ background: 'radial-gradient(circle at 5px 0, transparent 2.6px, #fff 3px) 0 0 / 10px 6px repeat-x' }} />

              <div className="flex items-center justify-between gap-4 border-b border-stone pb-4">
                <p className="t-meta text-copper-ink">Your brief</p>
                <p className="t-meta flex items-center gap-2 text-slate" aria-live="polite">
                  <span className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-navy' : 'bg-copper motion-safe:animate-pulse'}`} />
                  {done ? 'Ready to send' : `${pad(filled)} / ${pad(TALLY.length)}`}
                </p>
              </div>
              <div className="h-px bg-stone">
                <div className="h-px bg-copper transition-[width] duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)]" style={{ width: `${(filled / TALLY.length) * 100}%` }} />
              </div>

              <p className="mt-7 font-serif text-[clamp(2rem,3vw,2.6rem)] leading-[1] text-navy">
                {svcName || <span className="italic text-navy/25">Your event</span>}
              </p>

              <dl className="mt-6 grid grid-cols-2 border-t border-stone">
                {([['Name', f.name], ['Date', f.date], ['Guests', f.guests], ['City or venue', f.city]] as const).map(([k, v], i) => (
                  <div key={k} className={`border-b border-stone py-4 ${i % 2 ? 'pl-5' : 'border-r pr-5'}`}>
                    <dt className="t-meta text-[0.66rem] text-copper-ink">{k}</dt>
                    <dd className="mt-1 truncate text-navy">{v || <span className="text-navy/25">—</span>}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-b border-stone py-4">
                <p className="t-meta text-[0.66rem] text-copper-ink">Notes</p>
                <p className="mt-2 min-h-[4.8em] whitespace-pre-line font-serif text-[1.2rem] italic leading-snug text-navy">
                  {f.brief || <span className="text-navy/25">What you write in 08 lands here.</span>}
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <button type="button" onClick={copy} className="btn btn-navy w-full">
                  {copied ? <>Copied <Check /></> : <>Copy my brief <ArrowLong /></>}
                </button>
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full">
                    Send on WhatsApp <ArrowLong />
                  </a>
                ) : (
                  <p className="flex items-baseline justify-between gap-4 border border-stone px-4 py-3 text-[0.9rem]">
                    <span className="t-meta text-[0.66rem] text-slate">WhatsApp</span>
                    <span className="text-right"><Txt>{site.whatsapp}</Txt></span>
                  </p>
                )}
              </div>

              <dl className="mt-6 grid gap-1.5 text-[0.9rem]">
                <div className="flex justify-between gap-4">
                  <dt className="t-meta text-[0.66rem] text-slate">Phone</dt>
                  <dd className="text-right"><Txt>{site.phone}</Txt></dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="t-meta text-[0.66rem] text-slate">Email</dt>
                  <dd className="text-right"><Txt>{site.email}</Txt></dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
