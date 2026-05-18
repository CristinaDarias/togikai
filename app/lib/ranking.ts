import { getRank, type Fighter } from './data';

type RankedFighter = Fighter & {
  position: number;
  rank: ReturnType<typeof getRank>;
  winrate: number;
  totalFights: number;
};

function getTotalFights(wins: number, losses: number) {
  return wins + losses;
}

function getOrderingWinrate(wins: number, losses: number) {
  const total = getTotalFights(wins, losses);
  return total > 5 ? wins / total : 0;
}

export function buildRanking(fighters: Fighter[], options?: { excludeSuspended?: boolean }): RankedFighter[] {
  const source = options?.excludeSuspended
    ? fighters.filter((fighter) => fighter.status !== 'Suspendido')
    : fighters;

  return [...source]
    .sort((a, b) => {
      const byPoints = b.points - a.points;
      if (byPoints !== 0) return byPoints;

      const byWinrate = getOrderingWinrate(b.wins, b.losses) - getOrderingWinrate(a.wins, a.losses);
      if (byWinrate !== 0) return byWinrate;

      const byWins = b.wins - a.wins;
      if (byWins !== 0) return byWins;

      const byKos = b.kos - a.kos;
      if (byKos !== 0) return byKos;

      const byTotalFights = getTotalFights(b.wins, b.losses) - getTotalFights(a.wins, a.losses);
      if (byTotalFights !== 0) return byTotalFights;

      return a.alias.localeCompare(b.alias, 'es', { sensitivity: 'base' });
    })
    .map((fighter, index) => {
      const totalFights = getTotalFights(fighter.wins, fighter.losses);
      const winrate = totalFights === 0 ? 0 : (fighter.wins / totalFights) * 100;
      return {
        position: index + 1,
        ...fighter,
        rank: getRank(fighter.points),
        winrate,
        totalFights,
      };
    });
}

