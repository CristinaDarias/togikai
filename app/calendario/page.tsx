import CalendarEventsSections from './_components/calendar-events-sections';
import { loadCalendarEvents, loadFighters } from '../lib/supabase-data';

export default async function CalendarioPage() {
  const [events, fighters] = await Promise.all([loadCalendarEvents(), loadFighters()]);

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
        <CalendarEventsSections events={events} fighters={fighters} />
      )}
    </section>
  );
}
