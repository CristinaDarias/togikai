'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { SpecialFight } from '../lib/data';

const offsets = [-2, -1, 0, 1, 2];

export default function SpecialFightsCarousel({ fights }: { fights: SpecialFight[] }) {
  const [active, setActive] = useState(0);
  const total = fights.length;

  const visibleCards = useMemo(() => {
    if (!total) return [] as { fight: SpecialFight; pos: number }[];

    return offsets.map((offset) => {
      const idx = (active + offset + total) % total;
      return { fight: fights[idx], pos: offset };
    });
  }, [active, fights, total]);

  if (total === 0) return null;

  return (
    <section className="space-y-4 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-title text-4xl tracking-[0.1em] text-gold">Peleas Especiales</h2>
        <div className="flex gap-2">
          <button onClick={() => setActive((p) => (p - 1 + total) % total)} className="rounded border border-zinc-700 px-3 py-1 text-sm hover:border-blood hover:text-blood">◀</button>
          <button onClick={() => setActive((p) => (p + 1) % total)} className="rounded border border-zinc-700 px-3 py-1 text-sm hover:border-blood hover:text-blood">▶</button>
        </div>
      </div>

      <div className="relative mx-auto h-[720px] w-full max-w-7xl overflow-hidden">
        {visibleCards.map(({ fight, pos }) => {
          const isCenter = pos === 0;
          const scale = isCenter ? 1.08 : pos === -1 || pos === 1 ? 0.9 : 0.78;
          const x = pos * 70;
          const z = isCenter ? 30 : pos === -1 || pos === 1 ? 20 : 10;
          const opacity = isCenter ? 1 : pos === -1 || pos === 1 ? 0.88 : 0.62;
          const bg = isCenter ? '#7b6230' : '#3f0f0f';

          return (
            <article
              key={`${fight.id}-${pos}`}
              className="panel absolute left-1/2 top-1/2 w-[260px] -translate-y-1/2 rounded-md p-4 !shadow-none sm:w-[280px]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}%) scale(${scale})`,
                zIndex: z,
                opacity,
                boxShadow: 'none',
                background: bg,
              }}
            >
              <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded">
                <Image src={fight.imageUrl} alt={fight.title} fill className="object-cover" sizes="280px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" aria-hidden />
              </div>
              <h3 className="font-title text-2xl text-zinc-100">{fight.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{fight.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

