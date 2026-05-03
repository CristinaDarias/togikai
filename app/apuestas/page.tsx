import BettingBoard from './_components/betting-board';
import { loadFights, loadFighters } from '../lib/supabase-data';

export default async function ApuestasPage() {
  const [fighters, fights] = await Promise.all([loadFighters(), loadFights()]);
  return <BettingBoard fighters={fighters} fights={fights} />;
}
