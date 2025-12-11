export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Reward {
  id: string;
  title: string;
  vendor: string;
  pts: number;
  tier: Tier;
  stock?: number; // mock inventory
  description?: string;
  image?: string; // optional card bg
}

export interface Ticket {
  id: string;
  rewardId: string;
  rewardTitle: string;
  vendor: string;
  ptsSpent: number;
  code: string;        // short code shown above QR
  qrDataUrl: string;   // generated with `qrcode`
  issuedAt: number;
  expiresAt: number;   // unix ms
  status: 'active' | 'used' | 'expired';
}
