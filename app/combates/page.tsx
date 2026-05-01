import { loadFights } from '../lib/supabase-data';

export default async function FightHistoryPage() {
  const fights = await loadFights();

  return (
    <section className="space-y-4">
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Historial de Combates</h1>
      <div className="space-y-4">
        {fights.map((fight) => (
          <article key={fight.id} className="panel rounded-md border-l-2 border-l-blood p-5">
            <p className="text-xs tracking-[0.16em] text-zinc-500">{fight.id} | {fight.date}</p>
            <h2 className="font-title text-3xl text-zinc-100">{fight.fighterA} vs {fight.fighterB}</h2>
            <p className="text-sm text-zinc-300">Ganador: <span className="text-gold">{fight.winner}</span> · Método: {fight.method}</p>
            <p className="text-sm text-zinc-400">Puntos: ganador +{fight.pointsDelta.winner} / perdedor {fight.pointsDelta.loser}</p>
            <p className="mt-3 text-zinc-300">{fight.chronicle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
