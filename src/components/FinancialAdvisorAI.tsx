'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Coffee, CreditCard, Car, ArrowDownCircle } from 'lucide-react';

type Advice = {
  id: string;
  title: string;
  description: string;
  icon: 'coffee' | 'card' | 'car';
  color: string;
  gradient: string;
};

const iconMap = {
  coffee: Coffee,
  card: CreditCard,
  car: Car,
};

export default function FinancialAdvisorAI({
  advices = [
    {
      id: 'coffee',
      title: 'Coffee shop spending up 28%',
      description: 'Try brewing at home twice a week — could save ~£35/month.',
      icon: 'coffee' as const,
      color: '#ffb347',
      gradient: 'from-[#ffb34722] to-transparent',
    },
    {
      id: 'subs',
      title: '3 active subscriptions unused',
      description: 'Cancel or pause them to free ~£18/month.',
      icon: 'card' as const,
      color: '#80ffe5',
      gradient: 'from-[#80ffe522] to-transparent',
    },
    {
      id: 'ride',
      title: 'Ride-hail costs 40% above average',
      description: 'Walk or bus once a week — £20 saved and 100 pts earned.',
      icon: 'car' as const,
      color: '#9fd3ff',
      gradient: 'from-[#9fd3ff22] to-transparent',
    },
  ],
}: { advices?: Advice[] }) {
  return (
    <section
      id="financial-advisor"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e1216] to-[#0b0f13] px-6 py-12 md:px-10 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_-10%,#00ffb011,transparent)] blur-3xl" />
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300 mb-2">
          <Lightbulb className="h-4 w-4" />
          AI-Powered Insights
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Your Finances, Decoded by AI.
        </h2>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Real-time analysis of your spending, habits, and savings opportunities — simplified into
          three actionable insights each week.
        </p>
      </div>

      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {advices.map((a, i) => {
          const IconComponent = iconMap[a.icon];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 120 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden p-6 cursor-default"
            >
              <div
                className={`absolute -inset-10 bg-gradient-to-br ${a.gradient} opacity-70 pointer-events-none`}
              />
              <div className="relative flex flex-col items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.05, 0.95, 1] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="rounded-2xl p-3"
                  style={{
                    background: `radial-gradient(circle at center, ${a.color}33, transparent)`,
                  }}
                >
                  <IconComponent className="h-6 w-6" style={{ color: a.color }} />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{a.description}</p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-emerald-300 text-sm font-medium">
                  <ArrowDownCircle className="h-4 w-4" />
                  Expected saving visible in next 30 days
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* decorative animated pulse */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(600px_300px_at_60%_20%,#10b98111,transparent)]"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  );
}
