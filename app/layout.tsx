/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Bebas_Neue, Noto_Serif_JP } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const titleFont = Bebas_Neue({
  variable: '--font-title',
  weight: '400',
  subsets: ['latin'],
});

const bodyFont = Noto_Serif_JP({
  variable: '--font-body',
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Akuma Togikai',
  description: 'Honor, fuerza y destino. La Togikai es el escenario donde los luchadores demuestran quién merece dominar.',
  openGraph: {
    images: [
      {
        url: 'https://r2.fivemanage.com/q1SsM4avsfgiuCG2WmeAK/togikai/description-img.png',
        width: 1200,
        height: 630,
        alt: 'Akuma Togikai - Archivo Clasificado',
      },
    ],
  },
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/luchadores', label: 'Luchadores' },
  { href: '/combates', label: 'Combates' },
  { href: '/apuestas', label: 'Apuestas' },
  { href: '/normas', label: 'Normas' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${titleFont.variable} ${bodyFont.variable} h-full`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-obsidian text-zinc-100">
        <header className="sticky top-0 z-30 border-b border-blood/30 bg-obsidian/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="inline-flex items-center">
              <img
                src="https://r2.fivemanage.com/q1SsM4avsfgiuCG2WmeAK/Eleven_Project/Akuma-tachi-logo.png"
                alt="Akuma-tachi logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <nav className="flex gap-2 sm:gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm border border-zinc-800 px-2 py-1 text-xs tracking-[0.12em] text-zinc-300 transition hover:border-blood hover:text-blood sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>

        <footer className="relative z-10 border-t border-zinc-800/80 bg-black/30">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://r2.fivemanage.com/q1SsM4avsfgiuCG2WmeAK/Eleven_Project/Akuma-tachi-logo.png"
                alt="Akuma-tachi logo"
                className="h-10 w-auto object-contain"
              />
              <p className="text-sm text-zinc-300">Solo los más fuertes escriben su nombre en la Togikai.</p>
            </div>
            <Link href="/normas" className="text-sm tracking-[0.12em] text-zinc-300 transition hover:text-gold">
              Normas
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
