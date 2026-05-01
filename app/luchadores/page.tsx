import { getRank } from '../lib/data';
import { loadFighters } from '../lib/supabase-data';
import FightersExplorer from './_components/fighters-explorer';

export default async function FightersPage() {
  const fighters = await loadFighters();
  const listing = [...fighters]
    .sort((a, b) => a.alias.localeCompare(b.alias, 'es', { sensitivity: 'base' }))
    .map((fighter) => ({ ...fighter, rank: getRank(fighter.points) }));

  return (
    <section className="space-y-4">
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Archivo de Luchadores</h1>
      <FightersExplorer fighters={listing} />
    </section>
  );
}
