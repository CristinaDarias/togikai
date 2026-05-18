import { NextResponse } from 'next/server';
import { requireSupabaseAdmin } from '../../../lib/admin-supabase-auth';
import { supabaseRequest } from '../../../lib/supabase-admin';

type FightPayload = {
  id: string;
  fighter_a: string;
  fighter_b: string;
  winner: string;
  method: string;
  winner_points: number;
  loser_points: number;
};

type FighterStats = {
  alias: string;
  points: number;
  wins: number;
  losses: number;
  kos: number;
};

type Delta = {
  points: number;
  wins: number;
  losses: number;
  kos: number;
};

function isDraw(winner: string) {
  return winner.toLowerCase() === 'empate';
}

function buildFightDelta(fight: FightPayload, sign: 1 | -1) {
  const deltas = new Map<string, Delta>();
  const push = (alias: string, delta: Delta) => {
    const prev = deltas.get(alias) ?? { points: 0, wins: 0, losses: 0, kos: 0 };
    deltas.set(alias, {
      points: prev.points + delta.points,
      wins: prev.wins + delta.wins,
      losses: prev.losses + delta.losses,
      kos: prev.kos + delta.kos,
    });
  };

  if (isDraw(fight.winner)) return deltas;

  const winner = fight.winner;
  const loser = fight.fighter_a === winner ? fight.fighter_b : fight.fighter_a;
  const method = fight.method.toUpperCase();
  const koDelta = method.includes('KO') || method.includes('TKO') ? sign : 0;

  push(winner, {
    points: Number(fight.winner_points || 0) * sign,
    wins: 1 * sign,
    losses: 0,
    kos: koDelta,
  });

  push(loser, {
    points: Number(fight.loser_points || 0) * sign,
    wins: 0,
    losses: 1 * sign,
    kos: 0,
  });

  return deltas;
}

async function fetchFightById(id: string) {
  const res = await supabaseRequest(`fights?id=eq.${encodeURIComponent(id)}&select=*`);
  const rows = (await res.json()) as FightPayload[];
  return rows[0] ?? null;
}

async function fetchFighterByAlias(alias: string) {
  const res = await supabaseRequest(`fighters?alias=eq.${encodeURIComponent(alias)}&select=alias,points,wins,losses,kos`);
  const rows = (await res.json()) as FighterStats[];
  return rows[0] ?? null;
}

async function applyDeltas(deltas: Map<string, Delta>) {
  await Promise.all(
    [...deltas.entries()].map(async ([alias, delta]) => {
      const fighter = await fetchFighterByAlias(alias);
      if (!fighter) return;

      await supabaseRequest(`fighters?alias=eq.${encodeURIComponent(alias)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          points: fighter.points + delta.points,
          wins: fighter.wins + delta.wins,
          losses: fighter.losses + delta.losses,
          kos: fighter.kos + delta.kos,
        }),
      });
    }),
  );
}

export async function GET(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const response = await supabaseRequest('fights?select=*&order=id.desc');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const payload = (await request.json()) as FightPayload;
    await supabaseRequest('fights', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
    await applyDeltas(buildFightDelta(payload, 1));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const payload = (await request.json()) as FightPayload;
    const id = payload.id;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const previous = await fetchFightById(id);
    if (!previous) return NextResponse.json({ error: 'combate no encontrado' }, { status: 404 });

    await supabaseRequest(`fights?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    const deltas = new Map<string, Delta>();
    const revert = buildFightDelta(previous, -1);
    const apply = buildFightDelta(payload, 1);
    for (const [alias, delta] of [...revert.entries(), ...apply.entries()]) {
      const prev = deltas.get(alias) ?? { points: 0, wins: 0, losses: 0, kos: 0 };
      deltas.set(alias, {
        points: prev.points + delta.points,
        wins: prev.wins + delta.wins,
        losses: prev.losses + delta.losses,
        kos: prev.kos + delta.kos,
      });
    }
    await applyDeltas(deltas);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const previous = await fetchFightById(id);
    if (!previous) return NextResponse.json({ error: 'combate no encontrado' }, { status: 404 });

    await supabaseRequest(`fights?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    await applyDeltas(buildFightDelta(previous, -1));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
