import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import { Reward, Ticket, Tier } from '@/components/rewards/RewardTypes';
import { MOCK_REWARDS, pointsToTier } from '@/lib/rewards';

interface RewardsState {
  points: number;
  rewards: Reward[];
  history: Ticket[];
  modalOpen: boolean;
  pendingReward: Reward | null;
  
  // Actions
  setPoints: (pts: number) => void;
  addPoints: (delta: number) => void;
  openRedeem: (reward: Reward) => void;
  closeModal: () => void;
  canRedeem: (reward: Reward) => boolean;
  redeem: (reward: Reward) => Promise<Ticket>;
  markUsed: (ticketId: string) => void;
  expireTickets: () => void;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      points: 1250, // demo balance
      rewards: MOCK_REWARDS,
      history: [],
      modalOpen: false,
      pendingReward: null,

      setPoints: (pts) => set({ points: pts }),
      
      addPoints: (delta) => {
        const newPts = Math.max(0, get().points + delta);
        set({ points: newPts });
      },

      openRedeem: (reward) => set({ modalOpen: true, pendingReward: reward }),
      
      closeModal: () => set({ modalOpen: false, pendingReward: null }),

      canRedeem: (reward) => {
        const state = get();
        if (state.points < reward.pts) return false;
        if (reward.stock !== undefined && reward.stock <= 0) return false;
        
        const userTier = pointsToTier(state.points);
        const tierOrder: Tier[] = ['bronze', 'silver', 'gold', 'platinum'];
        return tierOrder.indexOf(userTier) >= tierOrder.indexOf(reward.tier);
      },

      redeem: async (reward) => {
        const state = get();
        if (!state.canRedeem(reward)) {
          throw new Error('Cannot redeem this reward');
        }

        // Deduct points
        const newPoints = state.points - reward.pts;
        
        // Update stock if applicable
        const updatedRewards = state.rewards.map(r =>
          r.id === reward.id && r.stock !== undefined
            ? { ...r, stock: r.stock - 1 }
            : r
        );

        // Generate ticket
        const ticketId = nanoid(12);
        const code = nanoid(8).toUpperCase();
        const now = Date.now();
        const expiresAt = now + 10 * 60 * 1000; // 10 minutes

        const qrPayload = JSON.stringify({
          type: 'savr.redeem',
          ticketId,
          rewardId: reward.id,
          code,
          issuedAt: now,
          expiresAt,
        });

        const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 512, margin: 1 });

        const ticket: Ticket = {
          id: ticketId,
          rewardId: reward.id,
          rewardTitle: reward.title,
          vendor: reward.vendor,
          ptsSpent: reward.pts,
          code,
          qrDataUrl,
          issuedAt: now,
          expiresAt,
          status: 'active',
        };

        set({
          points: newPoints,
          rewards: updatedRewards,
          history: [ticket, ...state.history],
        });

        return ticket;
      },

      markUsed: (ticketId) => {
        const updated = get().history.map(t =>
          t.id === ticketId ? { ...t, status: 'used' as const } : t
        );
        set({ history: updated });
      },

      expireTickets: () => {
        const now = Date.now();
        const updated = get().history.map(t =>
          t.status === 'active' && t.expiresAt < now
            ? { ...t, status: 'expired' as const }
            : t
        );
        set({ history: updated });
      },
    }),
    { name: 'savr-rewards-v2' }
  )
);
