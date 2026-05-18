'use client';

import { useMemo, useState } from 'react';
import type { FightRecord } from '../../../lib/data';

const PAGE_SIZE = 5;

export default function FightHistoryPaginated({ fights, fighterAlias }: { fights: FightRecord[]; fighterAlias: string }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(fights.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visible = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return fights.slice(start, start + PAGE_SIZE);
  }, [fights, safePage]);

  return (
    <div className="mt-4 space-y-3">
      {visible.map((fight) => {
        const isDraw = fight.winner.toLowerCase() === 'empate';
        const isWinner = !isDraw && fight.winner.toLowerCase() === fighterAlias.toLowerCase();
        const rival = fight.fighterA.toLowerCase() === fighterAlias.toLowerCase() ? fight.fighterB : fight.fighterA;
        const points = isDraw ? '0' : isWinner ? `+${fight.pointsDelta.winner}` : `${fight.pointsDelta.loser}`;
        const outcomeLabel = isDraw ? 'Empate' : isWinner ? 'Victoria' : 'Derrota';
        const outcomeColor = isDraw ? 'text-zinc-300' : isWinner ? 'text-gold' : 'text-blood';

        return (
          <article key={fight.id} className="rounded border border-zinc-800 bg-black/30 p-4">
            <p className="text-xs tracking-[0.16em] text-zinc-500">{fight.id} | {fight.date}</p>
            <p className="mt-1 text-sm text-zinc-300">Rival: <span className="text-zinc-100">{rival}</span></p>
            <p className={`text-sm ${outcomeColor}`}>
              Resultado: {outcomeLabel} - {fight.method}
            </p>
            <p className="text-sm text-zinc-400">Puntos: {points}</p>
            <p className="mt-2 text-zinc-300">{fight.chronicle}</p>
          </article>
        );
      })}

      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {'<'}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`rounded border px-3 py-1 text-xs transition ${
                pageNumber === safePage
                  ? 'border-blood bg-blood/20 text-zinc-100'
                  : 'border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
}
