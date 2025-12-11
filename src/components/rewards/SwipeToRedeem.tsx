import { motion, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export default function SwipeToRedeem({ onSuccess, disabled }: { onSuccess: () => void; disabled?: boolean; }) {
  const x = useMotionValue(0);

  useEffect(() => {
    const unsub = x.on('change', (v) => {
      if (v > 240 && !disabled) {
        onSuccess();
      }
    });
    return () => unsub();
  }, [x, onSuccess, disabled]);

  return (
    <div className={`relative w-full h-12 rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
      <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
        {disabled ? 'Insufficient points' : 'Swipe to claim →'}
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 260 }}
        style={{ x }}
        className="relative z-10 h-12 w-12 rounded-xl bg-emerald-500 shadow-lg cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.98 }}
      />
    </div>
  );
}
