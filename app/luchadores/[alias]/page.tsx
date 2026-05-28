import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getRank } from '../../lib/data';
import { FALLBACK_FIGHTER_IMAGE, getFighterImageSrc } from '../../lib/fighter-images';
import { loadFights, loadFighters } from '../../lib/supabase-data';
import FightHistoryPaginated from './_components/fight-history-paginated';

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
  const totalFights = fighter.wins + fighter.losses;
  const winrate = totalFights === 0 ? 0 : (fighter.wins / totalFights) * 100;

  return (
    <section className="space-y-6">
      <div className="panel rounded-md p-6 sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded border border-zinc-800">
            <Image
              src={getFighterImageSrc(fighter.alias, fighter.imageUrl)}
              alt={`Retrato de ${fighter.alias}`}
              fill
              onError={(event) => {
                event.currentTarget.src = FALLBACK_FIGHTER_IMAGE;
              }}
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
              <p className="rounded border border-zinc-800 p-3">Winrate: <strong>{winrate.toFixed(1)}%</strong></p>
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
          <FightHistoryPaginated fights={fightHistory} fighterAlias={fighter.alias} />
        )}
      </div>
    </section>
  );
}
