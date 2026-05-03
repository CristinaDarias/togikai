'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FightRecord, Fighter } from '../../lib/data';

type FighterStats = {
  fighter: Fighter;
  totalFights: number;
  winrate: number;
  koRate: number;
  streakLabel: string;
  recentPointsDiff: number;
};

type MatchupStats = {
  meetings: number;
  winsA: number;
  winsB: number;
  draws: number;
};

function getFighterImage(alias: string, imageUrl?: string) {
  if (imageUrl && imageUrl.trim()) return imageUrl;
  const slug = alias.toLowerCase();
  if (slug === 'amaterasu' || slug === 'gyuki') return `/images/fighters/${slug}.png`;
  return '/images/fighters/sin-foto.png';
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computeStreak(alias: string, fights: FightRecord[]) {
  let count = 0;
  let mode: 'W' | 'L' | 'E' | null = null;

  for (const fight of fights) {
    const involved = [fight.fighterA.toLowerCase(), fight.fighterB.toLowerCase()].includes(alias.toLowerCase());
    if (!involved) continue;

    const result = fight.winner.toLowerCase() === 'empate'
      ? 'E'
      : fight.winner.toLowerCase() === alias.toLowerCase()
        ? 'W'
        : 'L';

    if (!mode) {
      mode = result;
      count = 1;
      continue;
    }

    if (result === mode) count += 1;
    else break;
  }

  if (!mode) return 'Sin racha';
  return `${mode}${count}`;
}

function recentDiff(alias: string, fights: FightRecord[]) {
  const relevant = fights.filter((fight) =>
    [fight.fighterA.toLowerCase(), fight.fighterB.toLowerCase()].includes(alias.toLowerCase()),
  ).slice(0, 3);

  return relevant.reduce((acc, fight) => {
    if (fight.winner.toLowerCase() === 'empate') return acc;
    if (fight.winner.toLowerCase() === alias.toLowerCase()) return acc + fight.pointsDelta.winner;
    return acc + fight.pointsDelta.loser;
  }, 0);
}

function matchup(a: string, b: string, fights: FightRecord[]): MatchupStats {
  const relevant = fights.filter((fight) => {
    const fA = fight.fighterA.toLowerCase();
    const fB = fight.fighterB.toLowerCase();
    const aL = a.toLowerCase();
    const bL = b.toLowerCase();
    return (fA === aL && fB === bL) || (fA === bL && fB === aL);
  });

  let winsA = 0;
  let winsB = 0;
  let draws = 0;

  for (const fight of relevant) {
    const winner = fight.winner.toLowerCase();
    if (winner === 'empate') draws += 1;
    else if (winner === a.toLowerCase()) winsA += 1;
    else if (winner === b.toLowerCase()) winsB += 1;
  }

  return { meetings: relevant.length, winsA, winsB, draws };
}

function computeScore(stat: FighterStats, maxPoints: number, maxRecent: number) {
  const pointsNorm = maxPoints > 0 ? stat.fighter.points / maxPoints : 0;
  const winNorm = stat.winrate / 100;
  const koNorm = stat.koRate / 100;
  const streakNorm = stat.streakLabel.startsWith('W')
    ? Math.min(Number(stat.streakLabel.slice(1)) / 6, 1)
    : stat.streakLabel.startsWith('L')
      ? 0
      : 0.45;
  const experienceNorm = Math.min(stat.totalFights / 30, 1);
  const recentNorm = maxRecent > 0 ? (stat.recentPointsDiff + maxRecent) / (2 * maxRecent) : 0.5;

  return pointsNorm * 0.24 + winNorm * 0.22 + koNorm * 0.1 + streakNorm * 0.12 + experienceNorm * 0.14 + recentNorm * 0.18;
}

function probability(scoreA: number, scoreB: number, matchupBoost: number) {
  const delta = (scoreA - scoreB) + matchupBoost;
  const pA = 1 / (1 + Math.exp(-delta * 5.4));
  return {
    a: clamp(pA * 100, 1, 99),
    b: clamp((1 - pA) * 100, 1, 99),
  };
}

function useAnimatedPercent(target: number) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const from = valueRef.current;
    const duration = 900;

    const step = (time: number) => {
      if (!start) start = time;
      const t = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function FighterSlotCard({ label, stat }: { label: string; stat?: FighterStats }) {
  if (!stat) {
    return (
      <div className="flex h-full min-h-[380px] items-center justify-center rounded-md border border-zinc-700/70 bg-black/30 text-zinc-500">
        Suelta aquí una tarjeta para {label}
      </div>
    );
  }

  return (
    <div className="h-full rounded-md border border-zinc-700/80 bg-black/35 p-4">
      <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded">
        <Image src={getFighterImage(stat.fighter.alias, stat.fighter.imageUrl)} alt={stat.fighter.alias} fill unoptimized className="object-cover" sizes="420px" />
      </div>
      <h3 className="font-title text-4xl text-gold">{stat.fighter.alias}</h3>
      <p className="mb-3 text-sm text-zinc-300">{stat.fighter.publicPhrase}</p>
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
        <p>Puntos ranking: <span className="text-zinc-100">{stat.fighter.points}</span></p>
        <p>Victorias: <span className="text-zinc-100">{stat.fighter.wins}</span></p>
        <p>Derrotas: <span className="text-zinc-100">{stat.fighter.losses}</span></p>
        <p>Winrate: <span className="text-zinc-100">{stat.winrate.toFixed(1)}%</span></p>
        <p>KO rate: <span className="text-zinc-100">{stat.koRate.toFixed(1)}%</span></p>
        <p>Racha actual: <span className="text-zinc-100">{stat.streakLabel}</span></p>
        <p>Combates totales: <span className="text-zinc-100">{stat.totalFights}</span></p>
        <p>Diferencia reciente: <span className="text-zinc-100">{stat.recentPointsDiff >= 0 ? `+${stat.recentPointsDiff}` : stat.recentPointsDiff}</span></p>
      </div>
    </div>
  );
}

export default function BettingBoard({ fighters, fights }: { fighters: Fighter[]; fights: FightRecord[] }) {
  const [fighterA, setFighterA] = useState<string | null>(null);
  const [fighterB, setFighterB] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const mapped = fighters.map((fighter) => {
      const totalFights = fighter.wins + fighter.losses;
      const winrate = totalFights === 0 ? 0 : (fighter.wins / totalFights) * 100;
      const koRate = fighter.wins === 0 ? 0 : (fighter.kos / fighter.wins) * 100;

      return {
        fighter,
        totalFights,
        winrate,
        koRate,
        streakLabel: computeStreak(fighter.alias, fights),
        recentPointsDiff: recentDiff(fighter.alias, fights),
      } as FighterStats;
    });

    return new Map(mapped.map((item) => [item.fighter.alias.toLowerCase(), item]));
  }, [fighters, fights]);

  const statA = fighterA ? stats.get(fighterA.toLowerCase()) : undefined;
  const statB = fighterB ? stats.get(fighterB.toLowerCase()) : undefined;

  const computed = useMemo(() => {
    if (!statA || !statB) return null;

    const maxPoints = Math.max(...fighters.map((f) => f.points), 1);
    const maxRecent = Math.max(...Array.from(stats.values()).map((s) => Math.abs(s.recentPointsDiff)), 1);
    const scoreA = computeScore(statA, maxPoints, maxRecent);
    const scoreB = computeScore(statB, maxPoints, maxRecent);
    const h2h = matchup(statA.fighter.alias, statB.fighter.alias, fights);
    const h2hBias = h2h.meetings > 0 ? (h2h.winsA - h2h.winsB) / (h2h.meetings * 10) : 0;

    return {
      result: probability(scoreA, scoreB, h2hBias),
      matchup: h2h,
    };
  }, [statA, statB, fighters, fights, stats]);

  function onDrop(slot: 'A' | 'B', alias: string) {
    if (!alias) return;
    if (slot === 'A') setFighterA(alias);
    if (slot === 'B') setFighterB(alias);
  }

  const animatedA = useAnimatedPercent(computed?.result.a ?? 0);
  const animatedB = useAnimatedPercent(computed?.result.b ?? 0);

  const filteredFighters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fighters;
    return fighters.filter((fighter) => fighter.alias.toLowerCase().includes(q));
  }, [fighters, search]);

  return (
    <section className="space-y-6">
      <h1 className="font-title text-5xl tracking-[0.12em] text-gold">Apuestas</h1>

      <div className="panel rounded-md p-4">
        <div className="mb-4">
          <div>
            <label htmlFor="bet-search" className="mb-2 block text-xs tracking-[0.16em] text-zinc-500">BUSCAR LUCHADOR</label>
            <input
              id="bet-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Alias"
              className="w-full rounded border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-blood/70"
            />
          </div>
        </div>

        <p className="mb-3 text-xs tracking-[0.16em] text-zinc-500">ARRASTRA LUCHADORES</p>
        <div className="bet-fighters-strip flex gap-3 overflow-x-auto pb-2">
          {filteredFighters.map((fighter) => {
            const total = fighter.wins + fighter.losses;
            const winrate = total === 0 ? 0 : (fighter.wins / total) * 100;
            return (
              <div
                key={fighter.alias}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', fighter.alias)}
                className="min-w-[170px] cursor-pointer rounded-md border border-zinc-700 bg-black/35 p-2"
              >
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded">
                  <Image src={getFighterImage(fighter.alias, fighter.imageUrl)} alt={fighter.alias} fill unoptimized className="object-cover" sizes="160px" />
                </div>
                <p className="font-title text-2xl text-zinc-100">{fighter.alias}</p>
                <p className="text-xs text-zinc-400">Winrate: {winrate.toFixed(1)}%</p>
              </div>
            );
          })}
          {filteredFighters.length === 0 && (
            <p className="py-6 text-sm text-zinc-400">No hay luchadores para esa búsqueda.</p>
          )}
        </div>
      </div>

      {computed && statA && statB && (
        <div className="panel rounded-md p-5 text-center">
          <p className="text-sm text-zinc-400">Probabilidad calculada automáticamente</p>
          <p className="font-title mt-2 text-4xl text-gold">{statA.fighter.alias}: {animatedA.toFixed(1)}%</p>
          <p className="font-title text-4xl text-zinc-100">{statB.fighter.alias}: {animatedB.toFixed(1)}%</p>
          <p className="mt-3 text-xs text-zinc-400">
            Historial directo: {computed.matchup.meetings} peleas · {statA.fighter.alias} {computed.matchup.winsA} - {computed.matchup.winsB} {statB.fighter.alias} · Empates: {computed.matchup.draws}
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop('A', e.dataTransfer.getData('text/plain'))}>
          <FighterSlotCard label="Luchador A" stat={statA} />
        </div>

        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop('B', e.dataTransfer.getData('text/plain'))}>
          <FighterSlotCard label="Luchador B" stat={statB} />
        </div>
      </div>
    </section>
  );
}
