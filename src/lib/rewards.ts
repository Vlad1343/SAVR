import { Reward, Tier } from '@/components/rewards/RewardTypes';

export const TIERS: Record<Tier, { label: string; min: number; max?: number }> = {
  bronze:   { label: 'Bronze',   min: 100,  max: 499 },
  silver:   { label: 'Silver',   min: 500,  max: 1499 },
  gold:     { label: 'Gold',     min: 1500, max: 4999 },
  platinum: { label: 'Platinum', min: 5000 },
};

export const MOCK_REWARDS: Reward[] = [
  { id: 'coffee-10', title: '£10 Coffee Voucher', vendor: 'Campus Coffee', pts: 250, tier: 'bronze', stock: 40, description: 'Treat yourself or a friend.' },
  { id: 'cinema-2x', title: 'Vue Cinema Tickets x2', vendor: 'Vue', pts: 600, tier: 'silver', stock: 12, description: 'New release night.' },
  { id: 'gym-day',   title: 'Premium Gym Day Pass', vendor: 'Anytime Fitness', pts: 520, tier: 'silver', stock: 30, description: 'Train, swim, sauna — full package.' },
  { id: 'spotify-1m',title: '1 mo Spotify Premium', vendor: 'Spotify', pts: 750, tier: 'silver', stock: 50, description: 'Music on us for a month.' },
  { id: 'deliveroo-10', title: 'Deliveroo £10 Credit', vendor: 'Deliveroo', pts: 350, tier: 'bronze', stock: 18, description: 'Dinner, sorted.' },
];

export function pointsToTier(points: number): Tier {
  if (points >= 5000) return 'platinum';
  if (points >= 1500) return 'gold';
  if (points >= 500)  return 'silver';
  return 'bronze';
}
