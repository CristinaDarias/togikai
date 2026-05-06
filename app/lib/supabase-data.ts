import 'server-only';

import {
  fights as localFights,
  fighters as localFighters,
  specialFights as localSpecialFights,
  type FightRecord,
  type Fighter,
  type SpecialFight,
} from './data';

type SupabaseFighter = {
  alias: string;
  codename: string;
  full_name: string;
  public_phrase: string | null;
  image_url: string | null;
  image_url_hover: string | null;
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

type SupabaseSpecialFight = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

async function supabaseGet<T>(path: string): Promise<T[]> {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase no configurado');

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${config.publishableKey}`,
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
      imageHoverUrl: row.image_url_hover ?? undefined,
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

export async function loadSpecialFights(): Promise<SpecialFight[]> {
  try {
    const rows = await supabaseGet<SupabaseSpecialFight>('special_fights?select=*&order=display_order.asc');
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      displayOrder: row.display_order,
    }));
  } catch {
    return localSpecialFights;
  }
}
