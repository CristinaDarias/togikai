'use client';

import { useState } from 'react';

type MatchupsRevealProps = {
  eventId: string;
  matchups: string;
  fighters: Array<{ alias: string; imageUrl?: string }>;
};

type Pair = {
  fighterA: string;
  fighterB: string;
};

function parseMatchups(matchups: string): Pair[] {
  return matchups
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^(.*?)\s+vs\.?\s+(.*?)$/i);
      if (match) return { fighterA: match[1].trim(), fighterB: match[2].trim() };
      return { fighterA: chunk.trim(), fighterB: 'Por definir' };
    });
}

export default function MatchupsReveal({ eventId, matchups, fighters }: MatchupsRevealProps) {
  const [revealed, setRevealed] = useState(false);

  const pairs = parseMatchups(matchups);
  void fighters;
  if (!pairs.length) return <p className="mt-1 text-sm text-zinc-400">Emparejamientos por definir.</p>;

  return (
    <div className="mt-2 space-y-2">
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="rounded border border-blood bg-blood/20 px-3 py-1 text-xs tracking-[0.12em] text-zinc-100 transition hover:bg-blood/35"
        >
          Revelar emparejamientos
        </button>
      ) : (
        <div className="mt-2 overflow-hidden rounded border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-black/30 text-zinc-400">
              <tr>
                <th className="px-3 py-2 text-left font-normal">Combate</th>
                <th className="px-3 py-2 text-left font-normal">Luchador A</th>
                <th className="px-3 py-2 text-left font-normal">Luchador B</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, index) => (
                <tr key={`${eventId}-matchup-${index}`} className="border-t border-zinc-800/80 text-zinc-300">
                  <td className="px-3 py-2">#{index + 1}</td>
                  <td className="px-3 py-2">{pair.fighterA}</td>
                  <td className="px-3 py-2">{pair.fighterB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
