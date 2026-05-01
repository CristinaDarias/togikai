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
  description: 'Archivo interno de la Underground Fighting League.',
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/luchadores', label: 'Luchadores' },
  { href: '/combates', label: 'Combates' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${titleFont.variable} ${bodyFont.variable} h-full`}>
      <body className="min-h-full overflow-x-hidden bg-obsidian text-zinc-100">
        <header className="sticky top-0 z-30 border-b border-blood/30 bg-obsidian/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="font-title text-3xl tracking-[0.18em] text-gold">
              悪魔
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
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}

