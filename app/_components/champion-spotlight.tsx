'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Champion = {
  alias: string;
  publicPhrase: string;
  codename: string;
  imageUrl?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getFighterImage(alias: string, imageUrl?: string) {
  if (imageUrl && imageUrl.trim()) return imageUrl;

  const slug = alias.toLowerCase();
  if (slug === 'amaterasu' || slug === 'gyuki') return `/images/fighters/${slug}.png`;
  return '/images/fighters/sin-foto.png';
}

export default function ChampionSpotlight({ champion }: { champion?: Champion }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewport = window.innerHeight;

      const start = viewport * 0.9;
      const end = viewport * 0.25;
      const raw = (start - rect.top) / (start - end);
      setProgress(clamp(raw, 0, 1));
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  if (!champion) return null;

  const startOffset = 140;
  const endOffset = 40;
  const leftX = -startOffset + progress * (startOffset + endOffset);
  const rightX = startOffset - progress * (startOffset + endOffset);
  const opacity = 0.15 + progress * 0.85;

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden px-6 py-16 sm:px-10 sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid min-h-[70vh] w-full max-w-7xl items-center gap-6 lg:grid-cols-2">
        <div
          className="transition-transform duration-75"
          style={{
            opacity,
            transform: `translate3d(${leftX}px, 0, 0)`,
          }}
        >
          <p className="text-xs tracking-[0.2em] text-zinc-500">LÍDER ACTUAL</p>
          <p className="text-s mt-2 tracking-[0.2em] text-gold">[{champion.codename}]</p>
          <h2 className="font-title mt-2 text-5xl tracking-[0.12em] text-gold sm:text-7xl">{champion.alias}</h2>
          <p className="mt-2 text-lg text-zinc-200">{champion.publicPhrase}</p>
          <p className="mt-4 text-zinc-400">El nombre más alto del circuito clandestino. El objetivo de toda la liga.</p>
        </div>

        <div
          className="transition-transform duration-75"
          style={{
            opacity,
            transform: `translate3d(${rightX}px, 0, 0)`,
          }}
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded bg-black/35 lg:max-w-lg">
            <Image
              src={getFighterImage(champion.alias, champion.imageUrl)}
              alt={`Campeón actual: ${champion.alias}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
