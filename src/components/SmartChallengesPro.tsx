import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Utensils, Footprints } from 'lucide-react';

type Challenge = {
  id: number;
  label: string;
  progress: number;
  pts: number;
  icon: React.ComponentType<{ className?: string }>;
};

const CHALLENGE_COLORS = {
  1: '#ffb347', // Coffee - orange
  2: '#80ffe5', // Meals - teal
  3: '#9fd3ff', // Walk - blue
};

export default function SmartChallengesPro({
  challenges,
}: {
  challenges: Challenge[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="challenges"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e1216] to-[#0b0f13] px-6 py-12 md:px-10 md:py-16"
    >
      {/* Glowing background animation */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(800px_300px_at_50%_20%,#00ffb011,transparent)]"
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
          Smart Challenges
        </h2>
        <p className="mt-3 text-white/70 max-w-xl mx-auto">
          Small habits, big rewards. Complete micro-challenges and let AI turn your daily actions into savings.
        </p>
      </div>

      {/* Challenge Cards */}
      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {challenges.map((c, i) => {
          const Icon = c.icon;
          const color = CHALLENGE_COLORS[c.id as keyof typeof CHALLENGE_COLORS] || '#34d399';
          const progressPercent = Math.round(c.progress * 100);
          
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 110 }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 30px ${color}33`,
                transition: { duration: 0.3 },
              }}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg overflow-hidden premium-shine concave-surface transform-gpu"
            >
              <div
                className="pointer-events-none absolute -inset-10 opacity-60"
                style={{
                  background: `radial-gradient(circle at 30% -10%, ${color}22, transparent 70%)`,
                }}
              />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="rounded-xl bg-white/10 p-2 text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <div className="text-xs text-white/60">+{c.pts} pts</div>
                </div>

                <h3 className="text-lg font-semibold text-white">{c.label}</h3>

                {/* Progress bar with dynamic fill */}
                <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>

                <div className="mt-2 text-sm text-white/70">
                  {progressPercent}% complete
                </div>

                {/* Subtle glow effect at 100% */}
                {mounted && progressPercent === 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,#00ffbb22,transparent)]"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* motivational tagline */}
      <motion.div
        className="relative z-10 mt-10 text-center text-emerald-300 font-medium text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Complete all 3 this week to earn a household eco-bonus 🌱
      </motion.div>
    </section>
  );
}
