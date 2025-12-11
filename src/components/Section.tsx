'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { PropsWithChildren, useRef } from 'react';

type Props = PropsWithChildren<{
  id: string;
  headline?: string;
  subhead?: string;
  dark?: boolean;
}>;

export default function Section({ id, headline, subhead, dark, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['-20%', '70%'] });
  const glow = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{
        boxShadow: useTransform(glow, (v) => `0 0 ${v * 50}px rgba(0,255,176,${v})`),
      }}
      className="relative transition-all duration-700 ease-in-out py-20 px-6 rounded-[32px] mb-10 bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-lg"
    >
      {/* seam between sections */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
      <motion.div className="mx-auto max-w-6xl">
        {headline && (
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{headline}</h2>
            {subhead && <p className="text-white/70 mt-3 max-w-2xl">{subhead}</p>}
          </div>
        )}
        {children}
      </motion.div>
    </motion.section>
  );
}
