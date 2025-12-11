'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CalendarCheck, Zap, Sparkles } from 'lucide-react';

type HousrConfig = {
  rentRate: number;          // pts per £1 rent (e.g., 1)
  billsRate: number;         // pts per £1 bills (e.g., 0.5)
  onTimeBonus: number;       // flat pts for on-time payment (e.g., 150)
  streakBonusPerMonth: number; // pts per month streak (e.g., 100)
};

type Props = {
  monthLabel: string;        // 'November 2025'
  rentPaid: number;          // 1000
  billsPaid: number;         // 50
  paidOnTime: boolean;       // true
  streakMonths: number;      // e.g., 3
  points: number;            // current user points for tier chip
  onRedeem?: () => void;     // open rewards modal
  config?: Partial<HousrConfig>;
};

const defaultConfig: HousrConfig = {
  rentRate: 1,
  billsRate: 0.5,
  onTimeBonus: 150,
  streakBonusPerMonth: 100,
};

// simple count-up
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function tierFromPoints(pts: number) {
  if (pts >= 5000) return { name: 'Platinum', nextAt: null };
  if (pts >= 1500) return { name: 'Gold', nextAt: 5000 };
  if (pts >= 500)  return { name: 'Silver', nextAt: 1500 };
  return { name: 'Bronze', nextAt: 500 };
}

export default function HousrRewards({
  monthLabel,
  rentPaid,
  billsPaid,
  paidOnTime,
  streakMonths,
  points,
  onRedeem,
  config = {},
}: Props) {
  const cfg = { ...defaultConfig, ...config };
  const computed = useMemo(() => {
    const rentPts = Math.round(rentPaid * cfg.rentRate);
    const billsPts = Math.round(billsPaid * cfg.billsRate);
    const onTime = paidOnTime ? cfg.onTimeBonus : 0;
    const streak = streakMonths > 0 ? streakMonths * cfg.streakBonusPerMonth : 0;
    const total = rentPts + billsPts + onTime + streak;
    return { rentPts, billsPts, onTime, streak, total };
  }, [rentPaid, billsPaid, paidOnTime, streakMonths, cfg]);

  const totalUp = useCountUp(computed.total);
  const tier = tierFromPoints(points);
  const ptsToNext = tier.nextAt ? Math.max(0, tier.nextAt - points) : 0;

  return (
    <section
      id="housr-rewards"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(1200px_400px_at_20%_-20%,#5b8cff22,transparent),radial-gradient(800px_300px_at_110%_20%,#8a5bff22,transparent)] bg-[#0e1216] px-6 py-10 md:px-10 md:py-14"
    >
      {/* soft glow ring */}
      <div className="pointer-events-none absolute -inset-10 opacity-40 blur-3xl"
           style={{ background: 'radial-gradient(closest-side, #7aa0ff22, transparent)' }} />
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left: headline & total */}
        <div className="max-w-xl">
          <div className="mb-2 text-sm uppercase tracking-widest text-white/60">
            Housr Rewards · {monthLabel}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Points from your rent & bills.
          </h2>
          <p className="mt-3 text-white/70 max-w-prose">
            Pay via Housr, earn points automatically. On-time payments and streaks multiply your rewards.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/70">This month from Housr</div>
            <div className="mt-2 flex items-baseline gap-2">
              <motion.span
                key={totalUp}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="text-4xl md:text-5xl font-bold text-emerald-400"
              >
                {totalUp.toLocaleString()} pts
              </motion.span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key="coinpulse"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/90 shadow-[0_0_20px_#ffd86b66]"
                  aria-hidden
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-900" />
                </motion.span>
              </AnimatePresence>
            </div>

            {/* tier chip */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="rounded-full bg-white/10 px-2.5 py-1">Tier: {tier.name}</span>
              </div>
              <div className="text-xs text-white/70">
                {tier.nextAt ? `${ptsToNext} pts to next tier` : 'Top tier'}
              </div>
            </div>

            {/* progress bar to next tier */}
            {tier.nextAt && (
              <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  style={{
                    width: `${Math.min(
                      100,
                      ((points - (tier.name === 'Bronze' ? 100 : tier.name === 'Silver' ? 500 : 1500)) /
                        ((tier.nextAt ?? 0) - (tier.name === 'Bronze' ? 100 : tier.name === 'Silver' ? 500 : 1500))) *
                        100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* CTA row */}
          <button
            onClick={onRedeem}
            className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-black shadow-[0_10px_30px_#10b98155]"
          >
            Redeem Rewards
          </button>
        </div>

        {/* Right: breakdown cards */}
        <div className="grid w-full max-w-xl grid-cols-1 sm:grid-cols-2 gap-4">
          <BreakdownCard
            title="Rent payment"
            subtitle={`£${rentPaid.toLocaleString()}`}
            points={computed.rentPts}
            tone="gold"
            icon={<Trophy className="h-4 w-4" />}
          />
          <BreakdownCard
            title="Bills paid"
            subtitle={`£${billsPaid.toLocaleString()}`}
            points={computed.billsPts}
            tone="teal"
            icon={<Zap className="h-4 w-4" />}
          />
          <BreakdownCard
            title="On-time bonus"
            subtitle={paidOnTime ? 'Eligible' : '—'}
            points={computed.onTime}
            tone="silver"
            icon={<CalendarCheck className="h-4 w-4" />}
          />
          <BreakdownCard
            title="Streak"
            subtitle={`${streakMonths} month${streakMonths === 1 ? '' : 's'}`}
            points={computed.streak}
            tone="bronze"
            icon={<Sparkles className="h-4 w-4" />}
          />
        </div>
      </div>
    </section>
  );
}

function BreakdownCard({
  title, subtitle, points, tone, icon,
}: { title: string; subtitle: string; points: number; tone: 'gold'|'teal'|'silver'|'bronze'; icon: React.ReactNode; }) {
  const palette = {
    gold:   'from-[#ffd86b33] to-transparent',
    teal:   'from-[#34ffd133] to-transparent',
    silver: 'from-[#e7eefc33] to-transparent',
    bronze: 'from-[#c57c3f33] to-transparent',
  }[tone];

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
      className={`relative rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden`}
    >
      <div className={`pointer-events-none absolute -inset-10 bg-gradient-to-br ${palette}`} />
      <div className="relative">
        <div className="flex items-center gap-2 text-white/80">
          <div className="rounded-lg bg-white/10 p-1.5">{icon}</div>
          <div className="font-medium">{title}</div>
        </div>
        <div className="mt-1 text-sm text-white/60">{subtitle}</div>
        <div className="mt-3 text-2xl font-bold">{points.toLocaleString()} pts</div>
      </div>
    </motion.div>
  );
}
