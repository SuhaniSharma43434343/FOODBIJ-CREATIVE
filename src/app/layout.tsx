import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Instrument_Serif, Manrope } from 'next/font/google';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { StickyCta } from '@/components/sections/StickyCta';
import { KitchenPassPreloader } from '@/components/fx/KitchenPassPreloader';
import './globals.css';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display' });
const text = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-text' });
const meta = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-meta' });

export const metadata: Metadata = {
  title: { default: 'Foodbiz | Catering and hospitality, Mumbai', template: '%s | Foodbiz' },
  description: 'Catering and hospitality in Mumbai. We look after the menu, the counters and the floor, so the host can be in the room.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#F5F1EB', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable} ${meta.variable}`}>
      <body>
        <KitchenPassPreloader />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
