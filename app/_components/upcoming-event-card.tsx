'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type UpcomingEventCardProps = {
  name: string;
  targetDateTime: string;
  href: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTargetMs(targetDateTime: string) {
  return new Date(targetDateTime).getTime();
}

function getCountdown(targetMs: number): Countdown {
  const now = Date.now();
  const distance = Math.max(0, targetMs - now);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function pad2(value: number) {
  return value.toString().padStart(2, '0');
}

export default function UpcomingEventCard({ name, targetDateTime, href }: UpcomingEventCardProps) {
  const targetMs = useMemo(() => getTargetMs(targetDateTime), [targetDateTime]);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(getCountdown(targetMs));
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetMs));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetMs]);

  return (
    <Link
      href={href}
      className="panel rounded-md p-4 transition hover:border-gold/60 hover:shadow-[0_0_24px_rgba(202,166,93,0.2)]"
    >
      <p className="text-xs tracking-[0.16em] text-zinc-400">Proximo evento</p>
      <div className="mt-1 flex items-center gap-1 text-zinc-100">
        <p className="font-title rounded border border-zinc-700 bg-black/30 px-2 py-1 text-xl">{pad2(countdown?.days ?? 0)}D</p>
        <span className="font-title text-lg text-zinc-400">:</span>
        <p className="font-title rounded border border-zinc-700 bg-black/30 px-2 py-1 text-xl">{pad2(countdown?.hours ?? 0)}H</p>
        <span className="font-title text-lg text-zinc-400">:</span>
        <p className="font-title rounded border border-zinc-700 bg-black/30 px-2 py-1 text-xl">{pad2(countdown?.minutes ?? 0)}M</p>
        <span className="font-title text-lg text-zinc-400">:</span>
        <p className="font-title rounded border border-zinc-700 bg-black/30 px-2 py-1 text-xl">{pad2(countdown?.seconds ?? 0)}S</p>
      </div>
      <p className="mt-1 text-sm text-zinc-300">{name}</p>
    </Link>
  );
}
