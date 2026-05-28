'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import type { FightRecord, Fighter } from '../lib/data';
import { FALLBACK_FIGHTER_IMAGE, getFighterImageSrc } from '../lib/fighter-images';

function getFighterImage(alias: string, fighterMap: Map<string, Fighter>) {
  const fighter = fighterMap.get(alias.toLowerCase());
  return getFighterImageSrc(alias, fighter?.imageUrl);
}

export default function RecentFightsCarousel({
  fights,
  fighters = [],
}: {
  fights: FightRecord[];
  fighters?: Fighter[];
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const fighterMap = useMemo(
    () => new Map(fighters.map((fighter) => [fighter.alias.toLowerCase(), fighter])),
    [fighters],
  );

  const loopedFights = useMemo(() => [...fights, ...fights, ...fights], [fights]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || fights.length === 0) return;

    const jumpToMiddle = () => {
      const sectionWidth = track.scrollWidth / 3;
      track.scrollLeft = sectionWidth;
    };

    jumpToMiddle();

    const handleScroll = () => {
      const sectionWidth = track.scrollWidth / 3;
      const left = track.scrollLeft;
      const buffer = sectionWidth * 0.15;

      if (left < buffer) {
        track.scrollLeft = left + sectionWidth;
      } else if (left > sectionWidth * 2 - buffer) {
        track.scrollLeft = left - sectionWidth;
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', jumpToMiddle);
    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', jumpToMiddle);
    };
  }, [fights.length]);

  function scrollByCards(direction: 'left' | 'right') {
    if (!trackRef.current) return;
    const amount = Math.round(trackRef.current.clientWidth * 0.9);
    trackRef.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  if (!fights.length) return null;

  return (
    <section className="space-y-4 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-title text-4xl tracking-[0.1em] text-gold">Próximos Combates</h2>
        <div className="flex gap-2">
          <button onClick={() => scrollByCards('left')} className="rounded border border-zinc-700 px-3 py-1 text-sm hover:border-blood hover:text-blood" aria-label="Anterior">◀</button>
          <button onClick={() => scrollByCards('right')} className="rounded border border-zinc-700 px-3 py-1 text-sm hover:border-blood hover:text-blood" aria-label="Siguiente">▶</button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex min-h-[400px] snap-x snap-mandatory items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopedFights.map((fight, idx) => (
          <article key={`${fight.id}-${idx}`} className="flex h-[350px] w-[calc((100%-1.5rem)/3)] shrink-0 snap-center flex-col justify-center rounded-md border border-zinc-800/80 p-4">
            <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full border border-zinc-700 sm:w-24">
                <Image
                  src={getFighterImage(fight.fighterA, fighterMap)}
                  alt={fight.fighterA}
                  fill
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_FIGHTER_IMAGE;
                  }}
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <span className="font-title text-xl text-blood">VS</span>
              <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full border border-zinc-700 sm:w-24">
                <Image
                  src={getFighterImage(fight.fighterB, fighterMap)}
                  alt={fight.fighterB}
                  fill
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_FIGHTER_IMAGE;
                  }}
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            </div>

            <p className="text-xs tracking-[0.16em] text-zinc-500">{fight.id} | {fight.date}</p>
            <h3 className="font-title mt-2 text-3xl text-zinc-100">{fight.fighterA} vs {fight.fighterB}</h3>
            <p className="text-sm text-zinc-300">Ganador: <span className="text-gold">{fight.winner}</span> - {fight.method}</p>
            <p className="text-sm text-zinc-400">Puntos: +{fight.pointsDelta.winner} / {fight.pointsDelta.loser}</p>
            <p className="mt-3 text-zinc-300">{fight.chronicle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
