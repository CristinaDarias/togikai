import Image from 'next/image';
import type { Fighter } from '../lib/data';
import { FALLBACK_FIGHTER_IMAGE, getFighterImageSrc } from '../lib/fighter-images';

type RankedFighter = Fighter & { position: number; rank: string };

export default function TopThreeRanking({ fighters }: { fighters: RankedFighter[] }) {
  if (fighters.length < 3) return null;

  const first = fighters.find((f) => f.position === 1) ?? fighters[0];
  const second = fighters.find((f) => f.position === 2) ?? fighters[1];
  const third = fighters.find((f) => f.position === 3) ?? fighters[2];

  const podium = [second, first, third];

  return (
    <section className="space-y-4">
      <p className="text-center text-xs tracking-[0.18em] text-zinc-500">TOP 3 DEL RANKING</p>
      <div className="grid items-end gap-5 md:grid-cols-3">
        {podium.map((fighter) => {
          const isFirst = fighter.position === 1;

          return (
            <article
              key={fighter.alias}
              className={`panel rounded-md p-4 text-center ${isFirst ? 'border-gold/60 bg-gold/10' : fighter.position === 2 ? 'border-zinc-500/60 bg-zinc-500/10' : 'border-blood/60 bg-blood/10'}`}
            >
              <p className={`font-title ${isFirst ? 'text-5xl text-gold' : 'text-4xl text-zinc-200'}`}>#{fighter.position}</p>
              <div
                className={`relative mx-auto mt-2 aspect-[3/4] overflow-hidden rounded bg-black/35 ${isFirst ? 'max-w-[260px]' : 'max-w-[220px]'}`}
              >
                <Image
                  src={getFighterImageSrc(fighter.alias, fighter.imageUrl)}
                  alt={`Top ${fighter.position}: ${fighter.alias}`}
                  fill
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_FIGHTER_IMAGE;
                  }}
                  className={`object-cover ${isFirst ? '' : 'grayscale-[0.15]'}`}
                  sizes="(max-width: 768px) 100vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
              </div>
              <h3 className={`font-title mt-3 tracking-[0.08em] ${isFirst ? 'text-4xl text-gold' : 'text-3xl text-zinc-100'}`}>{fighter.alias}</h3>
              <p className="mt-1 text-sm text-zinc-300">{fighter.publicPhrase}</p>
              <p className="mt-2 text-xs tracking-[0.12em] text-zinc-400">{fighter.points} pts - {fighter.rank}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
