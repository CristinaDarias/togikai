'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Fighter } from '../../lib/data';

type FighterWithRank = Fighter & { rank: string };

function getFighterImage(alias: string, imageUrl?: string) {
  if (imageUrl && imageUrl.trim()) return imageUrl;

  const slug = alias.toLowerCase();
  if (slug === 'amaterasu' || slug === 'gyuki') return `/images/fighters/${slug}.png`;
  return '/images/fighters/sin-foto.png';
}

export default function FightersExplorer({ fighters }: { fighters: FighterWithRank[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fighters;

    return fighters.filter((fighter) =>
      fighter.alias.toLowerCase().includes(q) || fighter.publicPhrase.toLowerCase().includes(q),
    );
  }, [fighters, query]);

  return (
    <>
      <div className="panel rounded-md p-4">
        <label htmlFor="fighter-search" className="mb-2 block text-xs tracking-[0.16em] text-zinc-400">
          BUSCAR LUCHADOR
        </label>
        <input
          id="fighter-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Escribe alias o nombre..."
          className="w-full rounded border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blood focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((fighter) => (
          <Link key={fighter.alias} href={`/luchadores/${fighter.alias.toLowerCase()}`} className="panel group rounded-md p-5 transition hover:border-blood/60 hover:shadow-[0_0_30px_rgba(146,8,8,0.22)]">
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded border border-zinc-800 bg-black/40">
              <Image
                src={getFighterImage(fighter.alias, fighter.imageUrl)}
                alt={`Retrato de ${fighter.alias}`}
                fill
                unoptimized
                className="object-contain p-1 grayscale transition duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
            </div>
            <p className="text-xs tracking-[0.16em] text-zinc-500">[{fighter.codename}]</p>
            <h2 className="font-title text-3xl tracking-[0.08em] text-zinc-100 group-hover:text-blood">{fighter.alias}</h2>
            <p className="text-sm text-zinc-400">{fighter.publicPhrase}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-300">
              <p>Rango: <span className="text-gold">{fighter.rank}</span></p>
              <p>Puntos: {fighter.points}</p>
              <p>Record: {fighter.wins}-{fighter.losses}</p>
              <p>KOs: {fighter.kos}</p>
            </div>
            <p className="mt-3 text-sm text-zinc-300">Estilo: {fighter.style}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-blood">Estado: {fighter.status}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="panel rounded-md p-4 text-sm text-zinc-400">No se encontró ningún luchador con ese criterio.</p>
      )}
    </>
  );
}

