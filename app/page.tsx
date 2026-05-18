import Link from 'next/link';
import ChampionSpotlight from './_components/champion-spotlight';
import LatestFightShowdown from './_components/latest-fight-showdown';
import SpecialFightsCarousel from './_components/special-fights-carousel';
import TopThreeRanking from './_components/top-three-ranking';
import UpcomingEventCard from './_components/upcoming-event-card';
import { buildRanking } from './lib/ranking';
import { loadCalendarEvents, loadFights, loadFighters, loadSpecialFights } from './lib/supabase-data';

export default async function Home() {
  const [fighters, fights, specialFights, calendarEvents] = await Promise.all([
    loadFighters(),
    loadFights(),
    loadSpecialFights(),
    loadCalendarEvents(),
  ]);

  const ranking = buildRanking(fighters, { excludeSuspended: true });

  const champion = ranking[0];
  const latestFight = fights[0];

  const winner = latestFight && latestFight.winner.toLowerCase() !== 'empate'
    ? fighters.find((f) => f.alias.toLowerCase() === latestFight.winner.toLowerCase())
    : undefined;

  const loser = latestFight && winner
    ? fighters.find((f) => {
        const a = latestFight.fighterA.toLowerCase();
        const b = latestFight.fighterB.toLowerCase();
        const w = winner.alias.toLowerCase();
        return f.alias.toLowerCase() === (a === w ? b : a);
      })
    : undefined;

  const now = new Date();
  const nextCalendarEvent = calendarEvents.find(
    (event) => new Date(`${event.eventDate}T${event.eventTime}`).getTime() >= now.getTime(),
  );

  return (
    <div className="space-y-8">
      <section
        className="panel blood-glow relative overflow-hidden rounded-md p-6 sm:p-10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(5,5,5,0.92) 15%, rgba(5,5,5,0.7) 45%, rgba(146,8,8,0.45) 100%), url('/images/base/fondo-home-togikai.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mist absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blood/20 blur-3xl" aria-hidden />
        <p className="font-title text-sm tracking-[0.2em] text-blood">ARCHIVO CLASIFICADO // NIVEL AKUMA-TACHI</p>
        <h1 className="font-title mt-2 text-5xl tracking-[0.12em] text-gold sm:text-7xl">悪魔</h1>
        <p className="mt-1 text-lg tracking-[0.22em] text-zinc-300">TOGIKAI</p>
        <p className="mt-4 max-w-2xl text-zinc-300">
          No todos los nombres llegan al ranking. Algunos solo quedan en el suelo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-sm border border-blood bg-blood/20 px-4 py-2 text-sm tracking-wider text-zinc-100 hover:bg-blood/35" href="/ranking">Ver ranking</Link>
          <Link className="rounded-sm border border-zinc-700 bg-black/30 px-4 py-2 text-sm tracking-wider hover:border-gold hover:text-gold" href="/luchadores">Ver luchadores</Link>
          <Link className="rounded-sm border border-zinc-700 bg-black/30 px-4 py-2 text-sm tracking-wider hover:border-gold hover:text-gold" href="/combates">Historial de combates</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="panel rounded-md p-4"><p className="text-xs tracking-[0.16em] text-zinc-400">Líder actual</p><p className="font-title text-3xl text-gold">{champion?.alias ?? '-'}</p><p className="text-sm text-zinc-300">{champion?.publicPhrase ?? '-'}</p></article>
        <article className="panel rounded-md p-4"><p className="text-xs tracking-[0.16em] text-zinc-400">Último combate</p><p className="font-title text-3xl text-blood">{latestFight ? `${latestFight.fighterA} vs ${latestFight.fighterB}` : '-'}</p><p className="text-sm text-zinc-300">Victoria: {latestFight?.winner ?? '-'}</p></article>
        {nextCalendarEvent ? (
          <UpcomingEventCard
            name={nextCalendarEvent.fightName}
            targetDateTime={`${nextCalendarEvent.eventDate}T${nextCalendarEvent.eventTime}`}
            href={`/calendario#${encodeURIComponent(nextCalendarEvent.id)}`}
          />
        ) : (
          <article className="panel rounded-md p-4">
            <p className="text-xs tracking-[0.16em] text-zinc-400">Proximo evento</p>
            <p className="font-title mt-1 text-2xl text-zinc-100">No hay eventos registrados.</p>
          </article>
        )}
        <article className="panel rounded-md p-4"><p className="text-xs tracking-[0.16em] text-zinc-400">Luchadores activos</p><p className="font-title text-4xl text-zinc-100">{ranking.filter((f) => f.status === 'Activo').length}</p><p className="text-sm text-zinc-300">Registro vigente</p></article>
      </section>

      <ChampionSpotlight champion={champion} />
      <TopThreeRanking fighters={ranking.slice(0, 3)} />
      <LatestFightShowdown latestFight={latestFight} winner={winner} loser={loser} />
      <SpecialFightsCarousel fights={specialFights} />
    </div>
  );
}

