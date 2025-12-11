import { Reward } from './RewardTypes';
import { useRewardsStore } from '@/state/rewardsStore';

export default function RewardCard({ reward }: { reward: Reward }) {
  const { openRedeem, canRedeem, points } = useRewardsStore();

  const disabled = !canRedeem(reward) || (reward.stock !== undefined && reward.stock <= 0);

  return (
    <div className="group relative rounded-2xl p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60
                    ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-white/90 font-medium">{reward.title}</div>
          <div className="text-white/50 text-sm">{reward.vendor}</div>
        </div>
        <div className="text-emerald-400 text-sm">{reward.pts} pts</div>
      </div>

      {reward.description && (
        <p className="text-white/60 text-sm mt-3">{reward.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-white/50">
          {disabled ? `Need ${Math.max(0, reward.pts - points)} more` : (reward.stock ? `${reward.stock} left` : '')}
        </div>
        <button
          onClick={() => openRedeem(reward)}
          disabled={disabled}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
                      ${disabled ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'}`}>
          Redeem
        </button>
      </div>
    </div>
  );
}
