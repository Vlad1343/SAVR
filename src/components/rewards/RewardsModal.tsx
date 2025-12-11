import { useState } from 'react';
import { useRewardsStore } from '@/state/rewardsStore';
import { Reward } from './RewardTypes';
import SwipeToRedeem from './SwipeToRedeem';
import QRTicket from './QRTicket';

export default function RewardsModal() {
  const { modalOpen, pendingReward, closeModal, canRedeem, redeem, history } = useRewardsStore();
  const [stage, setStage] = useState<'details' | 'swipe' | 'qr'>('details');
  const [busy, setBusy] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  if (!modalOpen || !pendingReward) return null;

  const r: Reward = pendingReward;

  const startSwipe = () => setStage('swipe');

  const doRedeem = async () => {
    if (!canRedeem(r) || busy) return;
    setBusy(true);
    try {
      const t = await redeem(r);
      setTicketId(t.id);
      setStage('qr');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    setStage('details');
    setTicketId(null);
    closeModal();
  };

  const currentTicket = ticketId ? history.find(h => h.id === ticketId) : null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900/90 ring-1 ring-white/10 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white/90 font-semibold">Redeem Rewards</div>
          <button onClick={handleClose}
                  className="text-white/50 hover:text-white/80">✕</button>
        </div>

        {stage === 'details' && (
          <div className="space-y-4">
            <div>
              <div className="text-white/90 text-lg font-medium">{r.title}</div>
              <div className="text-white/60 text-sm">{r.vendor}</div>
            </div>
            <p className="text-white/60 text-sm">
              Confirm redemption. You'll receive a time-limited QR code to present at the vendor.
            </p>
            <div className="flex gap-2">
              <button
                onClick={startSwipe}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15">
                Continue
              </button>
              <div className="ml-auto text-emerald-400 text-sm">{r.pts} pts</div>
            </div>
          </div>
        )}

        {stage === 'swipe' && (
          <div className="space-y-4">
            <div className="text-white/80">Swipe to claim</div>
            <SwipeToRedeem onSuccess={doRedeem} disabled={busy || !canRedeem(r)} />
            <button
              onClick={() => setStage('details')}
              className="text-white/50 text-sm underline">
              Back
            </button>
          </div>
        )}

        {stage === 'qr' && currentTicket && (
          <QRTicket ticket={currentTicket} />
        )}
      </div>
    </div>
  );
}
