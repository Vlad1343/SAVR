'use client';
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Star, Gift, Rocket, Coffee, Film, Dumbbell, BedDouble, Plane, X } from 'lucide-react';

type TierKey = 'bronze' | 'silver' | 'gold' | 'platinum';

type Reward = {
  id: string;
  title: string;
  points: number;
  tier: TierKey;
  left?: number;
  category: 'Food' | 'Entertainment' | 'Fitness' | 'Travel' | 'Shopping';
  blurb: string;
};

const TIERS: Record<TierKey, {
  name: string;
  range: string;
  grad: string;
  ring: string;
  icon: any;
  perks: string[];
  pitch: string;
  glow: string;
}> = {
  bronze: {
    name: 'Bronze',
    range: '100–499 pts',
    grad: 'from-[#c57c3f]/40 to-[#c57c3f]/10',
    ring: 'ring-[#c57c3f]/40',
    icon: Gift,
    perks: ['Student discounts', 'Cashback vouchers'],
    pitch: 'Start earning easy perks on everyday spends.',
    glow: '#c57c3f',
  },
  silver: {
    name: 'Silver',
    range: '500–1,499 pts',
    grad: 'from-[#dfe5f2]/40 to-[#dfe5f2]/10',
    ring: 'ring-[#dfe5f2]/40',
    icon: Star,
    perks: ['Restaurant deals', 'Cinema passes'],
    pitch: 'Upsize your perks with better dining & entertainment.',
    glow: '#dfe5f2',
  },
  gold: {
    name: 'Gold',
    range: '1,500–4,999 pts',
    grad: 'from-[#ffd86b]/40 to-[#ffd86b]/10',
    ring: 'ring-[#ffd86b]/40',
    icon: Crown,
    perks: ['Luxury experiences', 'Weekend getaways'],
    pitch: 'Unlock aspirational rewards and premium experiences.',
    glow: '#ffd86b',
  },
  platinum: {
    name: 'Platinum',
    range: '5,000+ pts',
    grad: 'from-[#9fd3ff]/40 to-[#b78aff]/10',
    ring: 'ring-[#b78aff]/40',
    icon: Sparkles,
    perks: ['Premium gyms', 'Designer rentals'],
    pitch: 'Top-tier access. The best perks we offer.',
    glow: '#b78aff',
  },
};

const ICON_BY_CAT: Record<Reward['category'], any> = {
  Food: Coffee,
  Entertainment: Film,
  Fitness: Dumbbell,
  Travel: Plane,
  Shopping: Gift,
};

const DEMO_REWARDS: Reward[] = [
  { id: 'r1', title: 'Deliveroo £10 Credit', points: 350, tier: 'bronze', left: 18, category: 'Food', blurb: 'Dinner, sorted.' },
  { id: 'r2', title: 'Vue Cinema Tickets x2', points: 600, tier: 'silver', left: 12, category: 'Entertainment', blurb: 'New release night.' },
  { id: 'r3', title: 'Gym Day Pass', points: 520, tier: 'silver', left: 30, category: 'Fitness', blurb: 'Sweat the smart way.' },
  { id: 'r4', title: 'Restaurant £25 Voucher', points: 950, tier: 'silver', left: 9, category: 'Food', blurb: 'Treat your crew.' },
  { id: 'r5', title: 'Spa Afternoon for 2', points: 1800, tier: 'gold', left: 6, category: 'Travel', blurb: 'Unwind in style.' },
  { id: 'r6', title: 'B&B Weekend (1 night)', points: 2400, tier: 'gold', left: 4, category: 'Travel', blurb: 'Mini escape.' },
  { id: 'r7', title: 'Premium Gym Month', points: 5200, tier: 'platinum', left: 3, category: 'Fitness', blurb: 'Level up fitness.' },
  { id: 'r8', title: 'Designer Bag Rental (1 wk)', points: 5600, tier: 'platinum', left: 5, category: 'Shopping', blurb: 'Statement week.' },
];

function tierFromPoints(pts: number): TierKey {
  if (pts >= 5000) return 'platinum';
  if (pts >= 1500) return 'gold';
  if (pts >= 500) return 'silver';
  return 'bronze';
}

function CategoryArt({ category }: { category: Reward['category'] }) {
  const Icon = ICON_BY_CAT[category];
  const palette =
    category === 'Food' ? 'from-emerald-400/30 to-teal-300/10'
    : category === 'Entertainment' ? 'from-fuchsia-400/30 to-indigo-300/10'
    : category === 'Fitness' ? 'from-amber-400/30 to-yellow-300/10'
    : category === 'Travel' ? 'from-sky-400/30 to-cyan-300/10'
    : 'from-zinc-300/30 to-zinc-100/10';

  return (
    <div className="relative h-32 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
      <div className={`absolute inset-0 bg-gradient-to-br ${palette}`} />
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute inset-0 grid place-content-center">
        <Icon className="h-8 w-8 text-white/90" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -inset-x-20 top-1/2 h-16 bg-white/20 blur-lg"
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 2.4, repeat: Infinity, ease: [0.33,1,0.68,1] }}
          style={{ mixBlendMode: 'soft-light' }}
        />
      </div>
    </div>
  );
}

function RewardCard({
  r,
  canRedeem,
  onRedeem,
}: { r: Reward; canRedeem: boolean; onRedeem: (r: Reward) => void }) {
  const TierIcon = TIERS[r.tier].icon;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-3"
    >
      <CategoryArt category={r.category} />
      <div className="flex items-center justify-between">
        <div className="font-semibold">{r.title}</div>
        <div className="text-xs rounded-full bg-black/60 border border-white/10 px-2 py-0.5">
          {r.points.toLocaleString()} pts
        </div>
      </div>
      <div className="text-sm text-white/70">{r.blurb}</div>
      <div className="flex items-center justify-between text-xs">
        <div className="inline-flex items-center gap-1 text-white/70">
          <TierIcon className="h-3.5 w-3.5" />
          <span className="capitalize">{r.tier}</span>
          {typeof r.left === 'number' && <span className="ml-2 text-amber-300">{r.left} left</span>}
        </div>
        <button
          disabled={!canRedeem}
          onClick={() => canRedeem && onRedeem(r)}
          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 font-medium ${
            canRedeem
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-white/10 text-white/50'
          }`}
        >
          Redeem
        </button>
      </div>
    </motion.div>
  );
}

function TierBanner({ currentTier, points }: { currentTier: TierKey; points: number }) {
  const info = TIERS[currentTier];
  const next: TierKey | null =
    currentTier === 'bronze' ? 'silver'
    : currentTier === 'silver' ? 'gold'
    : currentTier === 'gold' ? 'platinum'
    : null;

  const ptsToNext =
    next === 'silver' ? Math.max(0, 500 - points)
    : next === 'gold' ? Math.max(0, 1500 - points)
    : next === 'platinum' ? Math.max(0, 5000 - points)
    : 0;

  const NextIcon = next ? TIERS[next].icon : Rocket;
  const CurIcon = info.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      animate={{ boxShadow: `0 0 25px ${info.glow}` }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 p-5 ring-1 ${info.ring} bg-gradient-to-br ${info.grad} backdrop-blur-lg`}
    >
      <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CurIcon className="h-5 w-5" />
          <div className="text-xl font-semibold">{info.name}</div>
          <div className="text-xs ml-2 rounded-full bg-black/60 border border-white/10 px-2 py-0.5">{info.range}</div>
        </div>
        <div className="text-white/80">{info.pitch}</div>
      </div>
      <div className="relative z-10 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
        {info.perks.map((p, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">{p}</div>
        ))}
      </div>

      {next && (
        <div className="relative z-10 mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <NextIcon className="h-4 w-4" />
            <span>You're <span className="text-emerald-400 font-semibold">{ptsToNext} pts</span> from <b className="capitalize">{next}</b> — bigger perks await.</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
              style={{
                width:
                  next === 'silver' ? `${Math.min(100, (points / 500) * 100)}%` :
                  next === 'gold' ? `${Math.min(100, (points / 1500) * 100)}%` :
                  next === 'platinum' ? `${Math.min(100, (points / 5000) * 100)}%` : '100%',
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function RewardsModal({
  open,
  onClose,
  points = 1250,
  onRedeem,
}: {
  open: boolean;
  onClose: () => void;
  points?: number;
  onRedeem?: (reward: Reward) => void;
}) {
  const currentTier = tierFromPoints(points);
  const [tab, setTab] = useState<'available' | 'near' | 'all'>('available');

  const filtered = useMemo(() => {
    if (tab === 'available') return DEMO_REWARDS.filter(r => r.points <= points);
    if (tab === 'near')     return DEMO_REWARDS.filter(r => r.points > points && r.points - points <= 250);
    return DEMO_REWARDS;
  }, [tab, points]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-black/50 backdrop-blur-xl"
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-emerald-300" />
                <div className="text-lg font-semibold">Redeem Rewards</div>
                <div className="ml-2 text-xs text-white/70">You have <b>{points.toLocaleString()}</b> pts</div>
              </div>
              <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/10 p-2 hover:bg-white/20">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5">
              <TierBanner currentTier={currentTier} points={points} />
            </div>

            <div className="px-5 mt-4">
              <div className="inline-flex rounded-xl border border-white/10 bg-black/30 p-1">
                {(['available','near','all'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                      tab === t ? 'bg-emerald-500 text-black font-semibold' : 'text-white/70'
                    }`}
                  >
                    {t === 'available' ? 'Available now' : t === 'near' ? 'Near unlock' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 mt-5">
              <div className="text-sm text-white/70 mb-2">Featured</div>
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
                {filtered.slice(0, 5).map(r => (
                  <div key={r.id} className="min-w-[260px] snap-start">
                    <RewardCard r={r} canRedeem={r.points <= points} onRedeem={(rw) => onRedeem?.(rw)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 pt-4 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(r => (
                  <RewardCard key={r.id} r={r} canRedeem={r.points <= points} onRedeem={(rw) => onRedeem?.(rw)} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
