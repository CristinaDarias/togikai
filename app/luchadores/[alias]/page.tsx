import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getRank } from '../../lib/data';
import { loadFights, loadFighters } from '../../lib/supabase-data';

function getFighterImage(alias: string, imageUrl?: string) {
  if (imageUrl && imageUrl.trim()) return imageUrl;

  const slug = alias.toLowerCase();
  if (slug === 'amaterasu' || slug === 'gyuki') return `/images/fighters/${slug}.png`;
  return '/images/fighters/sin-foto.png';
}

export async function generateStaticParams() {
  const fighters = await loadFighters();
  return fighters.map((fighter) => ({ alias: fighter.alias.toLowerCase() }));
}

export default async function FighterProfilePage(props: PageProps<'/luchadores/[alias]'>) {
  const { alias } = await props.params;
  const [fighters, fights] = await Promise.all([loadFighters(), loadFights()]);
  const ranking = [...fighters]
    .sort((a, b) => b.points - a.points)
    .map((fighter, index) => ({ position: index + 1, ...fighter, rank: getRank(fighter.points) }));

  const fighter = ranking.find((item) => item.alias.toLowerCase() === alias.toLowerCase());
  if (!fighter) notFound();

  const fightHistory = fights.filter((fight) =>
    [fight.fighterA.toLowerCase(), fight.fighterB.toLowerCase()].includes(fighter.alias.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="panel rounded-md p-6 sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded border border-zinc-800">
            <Image
              src={getFighterImage(fighter.alias, fighter.imageUrl)}
              alt={`Retrato de ${fighter.alias}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden />
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-zinc-500">EXPEDIENTE CLASIFICADO</p>
            <h1 className="font-title text-6xl tracking-[0.12em] text-blood">[{fighter.codename}] {fighter.alias}</h1>
            <p className="text-xl italic text-zinc-200">{fighter.publicPhrase}</p>
            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <p className="rounded border border-zinc-800 p-3">Rango actual: <strong className="text-gold">{fighter.rank}</strong></p>
              <p className="rounded border border-zinc-800 p-3">Puntos: <strong>{fighter.points}</strong></p>
              <p className="rounded border border-zinc-800 p-3">Record: <strong>{fighter.wins}-{fighter.losses}</strong></p>
              <p className="rounded border border-zinc-800 p-3">KOs: <strong>{fighter.kos}</strong></p>
              <p className="rounded border border-zinc-800 p-3">Estado: <strong className="text-blood">{fighter.status}</strong></p>
              <p className="rounded border border-zinc-800 p-3">Estilo: <strong>{fighter.style}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel rounded-md p-6 sm:p-8">
        <h2 className="font-title text-4xl tracking-[0.1em] text-gold">Historial de Combates</h2>
        {fightHistory.length === 0 ? (
          <p className="mt-3 text-zinc-400">Sin combates registrados en la base actual.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {fightHistory.map((fight) => {
              const isDraw = fight.winner.toLowerCase() === 'empate';
              const isWinner = !isDraw && fight.winner.toLowerCase() === fighter.alias.toLowerCase();
              const rival = fight.fighterA.toLowerCase() === fighter.alias.toLowerCase() ? fight.fighterB : fight.fighterA;
              const points = isDraw ? '0' : isWinner ? `+${fight.pointsDelta.winner}` : `${fight.pointsDelta.loser}`;
              const outcomeLabel = isDraw ? 'Empate' : isWinner ? 'Victoria' : 'Derrota';
              const outcomeColor = isDraw ? 'text-zinc-300' : isWinner ? 'text-gold' : 'text-blood';

              return (
                <article key={fight.id} className="rounded border border-zinc-800 bg-black/30 p-4">
                  <p className="text-xs tracking-[0.16em] text-zinc-500">{fight.id} | {fight.date}</p>
                  <p className="mt-1 text-sm text-zinc-300">Rival: <span className="text-zinc-100">{rival}</span></p>
                  <p className={`text-sm ${outcomeColor}`}>
                    Resultado: {outcomeLabel} · {fight.method}
                  </p>
                  <p className="text-sm text-zinc-400">Puntos: {points}</p>
                  <p className="mt-2 text-zinc-300">{fight.chronicle}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

