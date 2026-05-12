import Link from 'next/link';
import MatchupsReveal from './_components/matchups-reveal';
import { loadCalendarEvents, loadFighters } from '../lib/supabase-data';

function parseMatchups(matchups: string) {
  return matchups
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^(.*?)\s+vs\.?\s+(.*?)$/i);
      if (match) return { fighterA: match[1].trim(), fighterB: match[2].trim() };
      return { fighterA: chunk.trim(), fighterB: 'Por definir' };
    });
}

export default async function CalendarioPage() {
  const [events, fighters] = await Promise.all([loadCalendarEvents(), loadFighters()]);
  const now = Date.now();

  const withTimestamp = events.map((event) => ({
    ...event,
    timestamp: new Date(`${event.eventDate}T${event.eventTime}`).getTime(),
  }));

  const upcomingEvents = withTimestamp
    .filter((event) => event.timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp);

  const pastEvents = withTimestamp
    .filter((event) => event.timestamp < now)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <section className="space-y-6">
      <div className="panel rounded-md p-6 sm:p-8">
        <p className="text-xs tracking-[0.16em] text-zinc-500">PROGRAMACION OFICIAL</p>
        <h1 className="font-title mt-1 text-5xl tracking-[0.12em] text-gold">Calendario</h1>
        <p className="mt-2 text-sm text-zinc-400 font-bold">Al finalizar los combates principales de cada evento, los luchadores pasaran a una Winners Queue o una Loosers Queue dependiendo del resultado de su combate.</p>
        <p className="mt-2 text-xs text-zinc-400 italic">Winners Queue: enfrentamientos entre los ganadores de la ronda principal. Loosers Queue: enfrentamientos entre los luchadores derrotados en la ronda principal.</p>
      </div>

      {events.length === 0 ? (
        <div className="panel rounded-md p-6 text-sm text-zinc-400">No hay combates programados todavia.</div>
      ) : (
        <div className="space-y-6">
          {upcomingEvents.length > 0 && (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <article id={event.id} key={event.id} className="panel scroll-mt-24 rounded-md p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs tracking-[0.16em] text-zinc-500">{event.id}</p>
                    <p className="text-sm text-zinc-300">{event.eventDate} - {event.eventTime}</p>
                  </div>
                  <h2 className="font-title mt-2 text-3xl text-zinc-100">{event.fightName}</h2>
                  <div className="mt-3">
                    <p className="text-sm text-zinc-300">Convocados:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.fightersCalled
                        .split(',')
                        .map((fighter) => fighter.trim())
                        .filter(Boolean).length === 0 ? (
                        <p className="text-sm text-zinc-400">Luchadores aun por confirmar.</p>
                      ) : (
                        event.fightersCalled
                          .split(',')
                          .map((fighter) => fighter.trim())
                          .filter(Boolean)
                          .map((fighter) => (
                            <Link
                              key={`${event.id}-${fighter}`}
                              href={`/luchadores/${fighter.toLowerCase()}`}
                              className="rounded border border-zinc-700 bg-black/35 px-3 py-1 text-xs tracking-[0.08em] text-zinc-100 transition hover:border-blood hover:text-blood"
                            >
                              {fighter}
                            </Link>
                          ))
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-zinc-300">Emparejamientos:</p>
                    <MatchupsReveal eventId={event.id} matchups={event.matchups} fighters={fighters} />
                  </div>
                </article>
              ))}
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-title text-3xl tracking-[0.1em] text-zinc-400">Eventos pasados</h2>
              {pastEvents.map((event) => (
                <article id={event.id} key={event.id} className="panel scroll-mt-24 rounded-md p-5 opacity-55 saturate-50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs tracking-[0.16em] text-zinc-500">{event.id}</p>
                    <p className="text-sm text-zinc-400">{event.eventDate} - {event.eventTime}</p>
                  </div>
                  <h3 className="font-title mt-2 text-3xl text-zinc-300">{event.fightName}</h3>
                  <div className="mt-3">
                    <p className="text-sm text-zinc-400">Convocados:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.fightersCalled
                        .split(',')
                        .map((fighter) => fighter.trim())
                        .filter(Boolean).length === 0 ? (
                        <p className="text-sm text-zinc-500">Luchadores aun por confirmar.</p>
                      ) : (
                        event.fightersCalled
                          .split(',')
                          .map((fighter) => fighter.trim())
                          .filter(Boolean)
                          .map((fighter) => (
                            <Link
                              key={`${event.id}-${fighter}`}
                              href={`/luchadores/${fighter.toLowerCase()}`}
                              className="rounded border border-zinc-700 bg-black/35 px-3 py-1 text-xs tracking-[0.08em] text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
                            >
                              {fighter}
                            </Link>
                          ))
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-zinc-400">Emparejamientos:</p>
                    {parseMatchups(event.matchups).length === 0 ? (
                      <p className="mt-1 text-sm text-zinc-500">Emparejamientos por definir.</p>
                    ) : (
                      <div className="mt-2 overflow-hidden rounded border border-zinc-800">
                        <table className="w-full text-sm">
                          <thead className="bg-black/30 text-zinc-400">
                            <tr>
                              <th className="px-3 py-2 text-left font-normal">Combate</th>
                              <th className="px-3 py-2 text-left font-normal">Luchador A</th>
                              <th className="px-3 py-2 text-left font-normal">Luchador B</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parseMatchups(event.matchups).map((pair, index) => (
                              <tr key={`${event.id}-past-matchup-${index}`} className="border-t border-zinc-800/80 text-zinc-300">
                                <td className="px-3 py-2">#{index + 1}</td>
                                <td className="px-3 py-2">{pair.fighterA}</td>
                                <td className="px-3 py-2">{pair.fighterB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
