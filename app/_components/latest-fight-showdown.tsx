'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type DuelFighter = {
  alias: string;
  imageUrl?: string;
};

type LatestFight = {
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  date: string;
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

function duelOffset(progress: number, side: 'left' | 'right') {
  const dir = side === 'left' ? 1 : -1;
  const start = 340;
  const collide = 128;
  const settle = 12;

  if (progress < 0.58) {
    const t = progress / 0.58;
    return dir * (-start + t * (start + collide));
  }

  const t = (progress - 0.58) / 0.42;
  return dir * (collide + t * (-collide - settle));
}

export default function LatestFightShowdown({
  latestFight,
  winner,
  loser,
}: {
  latestFight?: LatestFight;
  winner?: DuelFighter;
  loser?: DuelFighter;
}) {
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

  if (!latestFight || !winner || !loser) return null;

  const opacity = 0.15 + progress * 0.85;
  const leftX = duelOffset(progress, 'left');
  const rightX = duelOffset(progress, 'right');
  const loserGrayClass = progress >= 0.92 ? 'grayscale' : 'grayscale-0';

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden px-6 py-16 sm:px-10 sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid min-h-[70vh] w-full max-w-7xl items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="text-center lg:text-left" style={{ opacity, transform: `translate3d(${leftX}px,0,0)` }}>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded bg-black/30 lg:mx-0">
            <Image src={getFighterImage(winner.alias, winner.imageUrl)} alt={`Ganador ${winner.alias}`} fill unoptimized className="object-cover" sizes="320px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
          </div>
          <p className="mt-3 text-xs tracking-[0.16em] text-zinc-500">VICTORIA</p>
          <h3 className="font-title text-5xl text-gold">{winner.alias}</h3>
        </div>

        <div className="px-2 text-center" style={{ opacity }}>
          <p className="text-xs tracking-[0.18em] text-zinc-500">ÚLTIMO COMBATE</p>
          <p className="font-title my-2 text-7xl tracking-[0.12em] text-blood sm:text-8xl">VS</p>
          <p className="text-xs text-zinc-500">{latestFight.method} · {latestFight.date}</p>
        </div>

        <div className="text-center lg:text-right" style={{ opacity, transform: `translate3d(${rightX}px,0,0)` }}>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded bg-black/30 lg:ml-auto lg:mr-0">
            <Image
              src={getFighterImage(loser.alias, loser.imageUrl)}
              alt={`Perdedor ${loser.alias}`}
              fill
              unoptimized
              className={`object-cover transition duration-300 ${loserGrayClass}`}
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
          </div>
          <p className="mt-3 text-xs tracking-[0.16em] text-zinc-500">DERROTA</p>
          <h3 className="font-title text-5xl text-zinc-100">{loser.alias}</h3>
        </div>
      </div>
    </section>
  );
}
