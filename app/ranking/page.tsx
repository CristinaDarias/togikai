import Link from 'next/link';
import { getRank } from '../lib/data';
import { loadFighters } from '../lib/supabase-data';

const topStyles = ['text-gold border-gold/60 bg-gold/10', 'text-zinc-100 border-zinc-500 bg-zinc-500/10', 'text-blood border-blood/60 bg-blood/10'];

export default async function RankingPage() {
  const fighters = await loadFighters();
  const ranking = [...fighters]
    .sort((a, b) => b.points - a.points)
    .map((fighter, index) => ({ position: index + 1, ...fighter, rank: getRank(fighter.points) }));

  return (
    <section className="space-y-4">
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Ranking Provisional</h1>
      <div className="panel overflow-x-auto rounded-md">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs tracking-[0.14em] text-zinc-400">
            <tr>{['Pos', 'Alias', 'Puntos', 'Victorias', 'Derrotas', 'KOs', 'Rango'].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {ranking.map((fighter, index) => {
              const href = `/luchadores/${fighter.alias.toLowerCase()}`;

              return (
                <tr key={fighter.alias} className={`border-b border-zinc-900 transition hover:bg-blood/10 ${index < 3 ? topStyles[index] : ''}`}>
                  <td className="px-4 py-3 font-title text-xl"><Link className="block" href={href}>#{fighter.position}</Link></td>
                  <td className="px-4 py-3 font-semibold"><Link className="block" href={href}>[{fighter.codename}] {fighter.alias}</Link></td>
                  <td className="px-4 py-3"><Link className="block" href={href}>{fighter.points}</Link></td>
                  <td className="px-4 py-3"><Link className="block" href={href}>{fighter.wins}</Link></td>
                  <td className="px-4 py-3"><Link className="block" href={href}>{fighter.losses}</Link></td>
                  <td className="px-4 py-3"><Link className="block" href={href}>{fighter.kos}</Link></td>
                  <td className="px-4 py-3"><Link className="block" href={href}>{fighter.rank}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="panel rounded-md p-4 text-sm text-zinc-300">
        <p>👑 鬼王 Oni-ō — 2200+ | 🩸 鬼 Oni — 1800–2199 | 🥇 修羅 Shura — 1400–1799 | 🥈 戦士 Senshi — 1000–1399 | 🥉 見習い Minarai — 0–999</p>
      </div>
    </section>
  );
}

