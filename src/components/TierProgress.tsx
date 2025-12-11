'use client';
import React from 'react';

function tierFromPoints(pts: number) {
  if (pts >= 5000) return { name: 'Platinum', nextAt: null, base: 5000 };
  if (pts >= 1500) return { name: 'Gold', nextAt: 5000, base: 1500 };
  if (pts >= 500)  return { name: 'Silver', nextAt: 1500, base: 500 };
  return { name: 'Bronze', nextAt: 500, base: 100 };
}

export default function TierProgress({ points }: { points: number }) {
  const t = tierFromPoints(points);
  const pct = t.nextAt ? Math.min(1, (points - t.base) / (t.nextAt - t.base)) : 1;
  const left = t.nextAt ? Math.max(0, t.nextAt - points) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{t.name}</div>
        <div className="text-sm text-white/70">{points.toLocaleString()} pts</div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="mt-2 text-xs text-white/70">
        {t.nextAt ? `${left} pts to next tier` : "You're at the top tier"}
      </div>
    </div>
  );
}
