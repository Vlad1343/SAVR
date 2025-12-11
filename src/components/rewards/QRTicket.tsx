import { useEffect, useMemo, useState } from 'react';
import { Ticket } from './RewardTypes';
import { useRewardsStore } from '@/state/rewardsStore';

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function QRTicket({ ticket }: { ticket: Ticket }) {
  const { markUsed } = useRewardsStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, Math.floor((ticket.expiresAt - now) / 1000));
  const expired = remaining <= 0 || ticket.status === 'expired';

  const statusText = useMemo(() => {
    if (ticket.status === 'used') return 'Used';
    if (expired) return 'Expired';
    return `Expires in ${fmt(remaining)}`;
  }, [ticket.status, expired, remaining]);

  return (
    <div className="space-y-4">
      <div className="text-white/80 text-lg font-semibold">{ticket.rewardTitle}</div>
      <div className="text-white/60 text-sm">{ticket.vendor}</div>
      <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
        <img src={ticket.qrDataUrl} alt="QR code" className="mx-auto h-48 w-48" />
        <div className="mt-3 text-center text-white/70 tracking-[0.2em]">{ticket.code}</div>
      </div>
      <div className={`text-sm ${expired ? 'text-red-300' : 'text-white/70'}`}>{statusText}</div>

      <div className="flex gap-2">
        <button
          onClick={() => markUsed(ticket.id)}
          disabled={expired || ticket.status === 'used'}
          className="px-3 py-2 rounded-lg bg-emerald-500 text-slate-900 text-sm font-medium disabled:bg-white/10 disabled:text-white/30">
          Mark collected
        </button>
        <div className="ml-auto text-white/50 text-xs">Spent {ticket.ptsSpent} pts</div>
      </div>
    </div>
  );
}
