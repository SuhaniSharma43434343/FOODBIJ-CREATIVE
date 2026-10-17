import { Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { BespokeFolios } from '@/components/sections/BespokeFolios';
import { LivePass } from '@/components/sections/LivePass';
import { Monologue } from '@/components/sections/Monologue';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Blueprint } from '@/components/sections/Blueprint';

/** Only the real content. The services are the banqueting folios. */
export default function Home() {
  return (
    <>
      <Hero />
      <BespokeFolios />
      <LivePass />
      <Monologue />
      <SelectedWork />
      <Suspense>
        <Blueprint />
      </Suspense>
    </>
  );
}
