import type { Fighter } from '../lib/data';

function getWinrate(fighter: Fighter) {
  const total = fighter.wins + fighter.losses;
  if (total === 0) return 0;
  return (fighter.wins / total) * 100;
}

export default function FightersWinrateSection({ fighters }: { fighters: Fighter[] }) {
  if (!fighters.length) return null;

  return (
    <section className="space-y-4 py-6 sm:py-10">
      <h2 className="font-title text-4xl tracking-[0.1em] text-gold">Winrate de Luchadores</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fighters.map((fighter) => {
          const winrate = getWinrate(fighter);
          return (
            <article key={fighter.alias} className="rounded-md border border-zinc-800/80 p-4">
              <p className="text-xs tracking-[0.16em] text-zinc-500">[{fighter.codename}]</p>
              <h3 className="font-title text-3xl text-zinc-100">{fighter.alias}</h3>
              <p className="mt-1 text-sm text-zinc-300">Winrate: <span className="text-gold">{winrate.toFixed(1)}%</span></p>
              <p className="text-xs text-zinc-500">Record: {fighter.wins}-{fighter.losses}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
