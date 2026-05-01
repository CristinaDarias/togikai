import 'server-only';

import { fights as localFights, fighters as localFighters, type FightRecord, type Fighter } from './data';

type SupabaseFighter = {
  alias: string;
  codename: string;
  full_name: string;
  public_phrase: string | null;
  image_url: string | null;
  points: number;
  wins: number;
  losses: number;
  kos: number;
  style: string;
  status: Fighter['status'];
};

type SupabaseFight = {
  id: string;
  date: string;
  fighter_a: string;
  fighter_b: string;
  winner: string;
  method: string;
  winner_points: number;
  loser_points: number;
  chronicle: string;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

async function supabaseGet<T>(path: string): Promise<T[]> {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase no configurado');

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase error: ${response.status} ${message}`);
  }

  return response.json() as Promise<T[]>;
}

export async function loadFighters(): Promise<Fighter[]> {
  try {
    const rows = await supabaseGet<SupabaseFighter>('fighters?select=*&order=points.desc');
    return rows.map((row) => ({
      alias: row.alias,
      codename: row.codename,
      fullName: row.full_name,
      publicPhrase: row.public_phrase ?? '',
      imageUrl: row.image_url ?? undefined,
      points: row.points,
      wins: row.wins,
      losses: row.losses,
      kos: row.kos,
      style: row.style,
      status: row.status,
    }));
  } catch {
    return localFighters;
  }
}

export async function loadFights(): Promise<FightRecord[]> {
  try {
    const rows = await supabaseGet<SupabaseFight>('fights?select=*&order=id.desc');
    return rows.map((row) => ({
      id: row.id,
      date: row.date,
      fighterA: row.fighter_a,
      fighterB: row.fighter_b,
      winner: row.winner,
      method: row.method,
      pointsDelta: {
        winner: row.winner_points,
        loser: row.loser_points,
      },
      chronicle: row.chronicle,
    }));
  } catch {
    return localFights;
  }
}


