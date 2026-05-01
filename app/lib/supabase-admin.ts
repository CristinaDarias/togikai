import 'server-only';

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase no configurado para admin');
  }

  return { url, key };
}

export async function supabaseRequest(path: string, init?: RequestInit) {
  const { url, key } = getSupabaseConfig();

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  return response;
}

type FightMini = {
  fighter_a: string;
  fighter_b: string;
  winner: string;
  method: string;
  winner_points: number;
  loser_points: number;
};

type FighterMini = {
  alias: string;
};

export async function syncFighterRecordsFromFights() {
  const [fightsRes, fightersRes] = await Promise.all([
    supabaseRequest('fights?select=fighter_a,fighter_b,winner,method,winner_points,loser_points'),
    supabaseRequest('fighters?select=alias'),
  ]);

  const fights = (await fightsRes.json()) as FightMini[];
  const fighters = (await fightersRes.json()) as FighterMini[];

  const stats = new Map<string, { wins: number; losses: number; kos: number; points: number }>();
  for (const fighter of fighters) {
    stats.set(fighter.alias, { wins: 0, losses: 0, kos: 0, points: 1000 });
  }

  for (const fight of fights) {
    const isDraw = fight.winner.toLowerCase() === 'empate';
    const fighterAStat = stats.get(fight.fighter_a);
    const fighterBStat = stats.get(fight.fighter_b);
    if (!fighterAStat || !fighterBStat) continue;

    if (isDraw) continue;

    const winnerStat = stats.get(fight.winner);
    if (winnerStat) {
      winnerStat.wins += 1;
      winnerStat.points += Number(fight.winner_points || 0);
      const method = fight.method.toUpperCase();
      if (method.includes('KO') || method.includes('TKO')) {
        winnerStat.kos += 1;
      }
    }

    const loserAlias = fight.fighter_a === fight.winner ? fight.fighter_b : fight.fighter_a;
    const loserStat = stats.get(loserAlias);
    if (loserStat) {
      loserStat.losses += 1;
      loserStat.points += Number(fight.loser_points || 0);
    }
  }

  await Promise.all(
    [...stats.entries()].map(([alias, value]) =>
      supabaseRequest(`fighters?alias=eq.${encodeURIComponent(alias)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          wins: value.wins,
          losses: value.losses,
          kos: value.kos,
          points: value.points,
        }),
      }),
    ),
  );
}
