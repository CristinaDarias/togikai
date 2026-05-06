'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import type { FightRecord, Fighter } from '../lib/data';
import { createSupabaseBrowserClient } from '../lib/supabase-browser';

type SupabaseFighterRow = {
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

type SupabaseFightRow = {
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

type AdminFightForm = {
  id: string;
  date: string;
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  winnerPoints: string;
  loserPoints: string;
  chronicle: string;
};

const supabase = createSupabaseBrowserClient();

const emptyFighterForm: Fighter = {
  alias: '',
  codename: '',
  fullName: '',
  publicPhrase: '',
  imageUrl: '',
  points: 1000,
  wins: 0,
  losses: 0,
  kos: 0,
  style: '',
  status: 'Activo',
};

const emptyFightForm: AdminFightForm = {
  id: '',
  date: '',
  fighterA: '',
  fighterB: '',
  winner: '',
  method: '',
  winnerPoints: '0',
  loserPoints: '0',
  chronicle: '',
};

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [fightersState, setFightersState] = useState<Fighter[]>([]);
  const [fightsState, setFightsState] = useState<FightRecord[]>([]);

  const [fighterForm, setFighterForm] = useState<Fighter>(emptyFighterForm);
  const [fightForm, setFightForm] = useState<AdminFightForm>(emptyFightForm);

  const [editingFighterAlias, setEditingFighterAlias] = useState<string | null>(null);
  const [editingFightId, setEditingFightId] = useState<string | null>(null);

  const aliases = useMemo(() => fightersState.map((f) => f.alias), [fightersState]);

  function authHeaders(currentSession?: Session | null) {
    const active = currentSession ?? session;
    if (!active?.access_token) return null;
    return `Bearer ${active.access_token}`;
  }

  async function adminFetch(url: string, init?: RequestInit, currentSession?: Session | null) {
    const headers = new Headers(init?.headers);
    const auth = authHeaders(currentSession);
    if (auth) headers.set('Authorization', auth);

    return fetch(url, {
      ...init,
      headers,
    });
  }

  function mapFighter(row: SupabaseFighterRow): Fighter {
    return {
      alias: row.alias,
      codename: row.codename,
      fullName: row.full_name,
      publicPhrase: row.public_phrase ?? '',
      imageUrl: row.image_url ?? '',
      imageHoverUrl: row.image_url_hover ?? '',
      points: row.points,
      wins: row.wins,
      losses: row.losses,
      kos: row.kos,
      style: row.style,
      status: row.status,
    };
  }

  function mapFight(row: SupabaseFightRow): FightRecord {
    return {
      id: row.id,
      date: row.date,
      fighterA: row.fighter_a,
      fighterB: row.fighter_b,
      winner: row.winner,
      method: row.method,
      pointsDelta: { winner: row.winner_points, loser: row.loser_points },
      chronicle: row.chronicle,
    };
  }

  async function loadAll(currentSession: Session) {
    setLoading(true);
    setError('');
    try {
      const [fightersRes, fightsRes] = await Promise.all([
        adminFetch('/api/admin/fighters', { cache: 'no-store' }, currentSession),
        adminFetch('/api/admin/fights', { cache: 'no-store' }, currentSession),
      ]);

      if (
        fightersRes.status === 401 ||
        fightsRes.status === 401 ||
        fightersRes.status === 403 ||
        fightsRes.status === 403
      ) {
        setSession(null);
        throw new Error('No autorizado. Revisa permisos de admin.');
      }

      if (!fightersRes.ok || !fightsRes.ok) throw new Error('No se pudo cargar desde Supabase');

      const fightersRows = (await fightersRes.json()) as SupabaseFighterRow[];
      const fightsRows = (await fightsRes.json()) as SupabaseFightRow[];

      setFightersState(fightersRows.map(mapFighter));
      setFightsState(fightsRows.map(mapFight));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      if (data.session) await loadAll(data.session);
      else setLoading(false);
    }

    bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setFightersState([]);
    setFightsState([]);
    setEditingFighterAlias(null);
    setEditingFightId(null);
    setFighterForm(emptyFighterForm);
    setFightForm(emptyFightForm);
    router.replace('/admin/login');
    router.refresh();
  }

  function startEditFighter(fighter: Fighter) {
    setEditingFighterAlias(fighter.alias);
    setFighterForm({ ...fighter });
  }

  function cancelEditFighter() {
    setEditingFighterAlias(null);
    setFighterForm(emptyFighterForm);
  }

  async function saveFighter() {
    if (!fighterForm.alias.trim() || !fighterForm.fullName.trim()) return;

    const payload = {
      alias: fighterForm.alias.trim(),
      codename: fighterForm.codename,
      full_name: fighterForm.fullName.trim(),
      public_phrase: fighterForm.publicPhrase?.trim() || null,
      image_url: fighterForm.imageUrl?.trim() || null,
      image_url_hover: fighterForm.imageHoverUrl?.trim() || null,
      points: fighterForm.points,
      wins: fighterForm.wins,
      losses: fighterForm.losses,
      kos: fighterForm.kos,
      style: fighterForm.style,
      status: fighterForm.status,
    };

    const method = editingFighterAlias ? 'PATCH' : 'POST';
    const response = await adminFetch('/api/admin/fighters', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? 'Error guardando luchador');
      return;
    }

    cancelEditFighter();
    if (session) await loadAll(session);
  }

  async function deleteFighter(alias: string) {
    if (!window.confirm(`Eliminar al luchador ${alias}?`)) return;

    const response = await adminFetch(`/api/admin/fighters?alias=${encodeURIComponent(alias)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? 'Error eliminando luchador');
      return;
    }

    if (editingFighterAlias === alias) cancelEditFighter();
    if (session) await loadAll(session);
  }

  function startEditFight(fight: FightRecord) {
    setEditingFightId(fight.id);
    setFightForm({
      id: fight.id,
      date: fight.date,
      fighterA: fight.fighterA,
      fighterB: fight.fighterB,
      winner: fight.winner === 'Empate' ? '' : fight.winner,
      method: fight.method,
      winnerPoints: String(fight.pointsDelta.winner),
      loserPoints: String(fight.pointsDelta.loser),
      chronicle: fight.chronicle,
    });
  }

  function cancelEditFight() {
    setEditingFightId(null);
    setFightForm(emptyFightForm);
  }

  async function saveFight() {
    if (!fightForm.id || !fightForm.date || !fightForm.fighterA || !fightForm.fighterB || !fightForm.method) return;

    const payload = {
      id: fightForm.id,
      date: fightForm.date,
      fighter_a: fightForm.fighterA,
      fighter_b: fightForm.fighterB,
      winner: fightForm.winner || 'Empate',
      method: fightForm.method,
      winner_points: Number(fightForm.winnerPoints || 0),
      loser_points: Number(fightForm.loserPoints || 0),
      chronicle: fightForm.chronicle || 'Sin cronica registrada.',
    };

    const method = editingFightId ? 'PATCH' : 'POST';
    const response = await adminFetch('/api/admin/fights', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? 'Error guardando combate');
      return;
    }

    cancelEditFight();
    if (session) await loadAll(session);
  }

  async function deleteFight(id: string) {
    if (!window.confirm(`Eliminar el combate ${id}?`)) return;

    const response = await adminFetch(`/api/admin/fights?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? 'Error eliminando combate');
      return;
    }

    if (editingFightId === id) cancelEditFight();
    if (session) await loadAll(session);
  }

  if (loading && !session) {
    return (
      <section className="panel mx-auto max-w-xl rounded-md p-6 sm:p-8">
        <p className="text-sm text-zinc-400">Verificando acceso...</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="panel mx-auto max-w-xl rounded-md p-6 sm:p-8">
        <p className="text-sm text-zinc-400">Redirigiendo al login de administracion...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Panel Admin</h1>
        <button onClick={logout} className="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-blood hover:text-blood">Cerrar sesion</button>
      </div>
      {error && <p className="rounded border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-red-200">{error}</p>}
      {loading && <p className="text-sm text-zinc-400">Sincronizando...</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="panel rounded-md p-5">
          <h2 className="font-title text-3xl text-zinc-100">{editingFighterAlias ? 'Editar Luchador' : 'Nuevo Luchador'}</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <input value={fighterForm.alias} onChange={(e) => setFighterForm((p) => ({ ...p, alias: e.target.value }))} placeholder="Alias" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.codename} onChange={(e) => setFighterForm((p) => ({ ...p, codename: e.target.value }))} placeholder="Codename" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.fullName} onChange={(e) => setFighterForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Nombre real" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.publicPhrase ?? ''} onChange={(e) => setFighterForm((p) => ({ ...p, publicPhrase: e.target.value }))} placeholder="Frase publica" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.imageUrl ?? ''} onChange={(e) => setFighterForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="URL imagen" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.imageHoverUrl ?? ''} onChange={(e) => setFighterForm((p) => ({ ...p, imageHoverUrl: e.target.value }))} placeholder="URL imagen hover (segunda imagen)" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input value={fighterForm.style} onChange={(e) => setFighterForm((p) => ({ ...p, style: e.target.value }))} placeholder="Estilo de lucha" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={fighterForm.points} onChange={(e) => setFighterForm((p) => ({ ...p, points: Number(e.target.value) }))} placeholder="Puntos" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
              <select value={fighterForm.status} onChange={(e) => setFighterForm((p) => ({ ...p, status: e.target.value as Fighter['status'] }))} className="rounded border border-zinc-700 bg-black/40 px-3 py-2">
                <option>Activo</option><option>Lesionado</option><option>Suspendido</option>
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={saveFighter} className="rounded border border-gold bg-gold/20 px-4 py-2 hover:bg-gold/35">{editingFighterAlias ? 'Guardar cambios' : 'Anadir luchador'}</button>
              {editingFighterAlias && <button onClick={cancelEditFighter} className="rounded border border-zinc-700 px-4 py-2">Cancelar</button>}
            </div>
          </div>
        </article>

        <article className="panel rounded-md p-5">
          <h2 className="font-title text-3xl text-zinc-100">{editingFightId ? 'Editar Combate' : 'Nuevo Combate'}</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <input value={fightForm.id} onChange={(e) => setFightForm((p) => ({ ...p, id: e.target.value }))} placeholder="ID" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <input type="date" value={fightForm.date} onChange={(e) => setFightForm((p) => ({ ...p, date: e.target.value }))} className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <select value={fightForm.fighterA} onChange={(e) => setFightForm((p) => ({ ...p, fighterA: e.target.value }))} className="rounded border border-zinc-700 bg-black/40 px-3 py-2"><option value="">Luchador A</option>{aliases.map((a) => <option key={a}>{a}</option>)}</select>
            <select value={fightForm.fighterB} onChange={(e) => setFightForm((p) => ({ ...p, fighterB: e.target.value }))} className="rounded border border-zinc-700 bg-black/40 px-3 py-2"><option value="">Luchador B</option>{aliases.map((a) => <option key={a}>{a}</option>)}</select>
            <select value={fightForm.winner} onChange={(e) => setFightForm((p) => ({ ...p, winner: e.target.value }))} className="rounded border border-zinc-700 bg-black/40 px-3 py-2"><option value="">Empate</option>{aliases.map((a) => <option key={a}>{a}</option>)}</select>
            <input value={fightForm.method} onChange={(e) => setFightForm((p) => ({ ...p, method: e.target.value }))} placeholder="Metodo" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={fightForm.winnerPoints} onChange={(e) => setFightForm((p) => ({ ...p, winnerPoints: e.target.value }))} placeholder="Puntos ganador" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
              <input type="number" value={fightForm.loserPoints} onChange={(e) => setFightForm((p) => ({ ...p, loserPoints: e.target.value }))} placeholder="Puntos perdedor" className="rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            </div>
            <textarea value={fightForm.chronicle} onChange={(e) => setFightForm((p) => ({ ...p, chronicle: e.target.value }))} placeholder="Cronica" className="min-h-24 rounded border border-zinc-700 bg-black/40 px-3 py-2" />
            <div className="mt-2 flex gap-2">
              <button onClick={saveFight} className="rounded border border-blood bg-blood/20 px-4 py-2 hover:bg-blood/35">{editingFightId ? 'Guardar cambios' : 'Anadir combate'}</button>
              {editingFightId && <button onClick={cancelEditFight} className="rounded border border-zinc-700 px-4 py-2">Cancelar</button>}
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="panel rounded-md p-5">
          <h3 className="font-title text-2xl text-zinc-100">Luchadores ({fightersState.length})</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {fightersState.map((f) => (
              <li key={f.alias} className="rounded border border-zinc-800 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span>[{f.codename}] {f.alias} · {f.fullName}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEditFighter(f)} className="rounded border border-zinc-700 px-2 py-1 text-xs">Editar</button>
                    <button onClick={() => deleteFighter(f.alias)} className="rounded border border-zinc-700 px-2 py-1 text-xs hover:border-blood hover:text-blood">Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel rounded-md p-5">
          <h3 className="font-title text-2xl text-zinc-100">Combates ({fightsState.length})</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {fightsState.slice(0, 20).map((f) => (
              <li key={f.id} className="rounded border border-zinc-800 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span>{f.id} · {f.fighterA} vs {f.fighterB} · {f.winner}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEditFight(f)} className="rounded border border-zinc-700 px-2 py-1 text-xs">Editar</button>
                    <button onClick={() => deleteFight(f.id)} className="rounded border border-zinc-700 px-2 py-1 text-xs hover:border-blood hover:text-blood">Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
