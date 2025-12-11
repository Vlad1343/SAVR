import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, ArrowRight, Trophy, CheckCircle2, Crown, Star, Sparkles, Gift, TrendingUp, Receipt, Droplet, Zap } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { SavingsPot3D } from "@/components/SavingsPot3D";
import { RewardsModal } from "@/components/RewardsModal";
import Section from "@/components/Section";
import TierProgress from "@/components/TierProgress";
import SmoothScroll from "@/components/SmoothScroll";
import HousrRewards from "@/components/HousrRewards";
import FinancialAdvisorAI from "@/components/FinancialAdvisorAI";
import TransactionsSection from "@/components/TransactionsSection";
import SmartChallengesPro from "@/components/SmartChallengesPro";
import RewardsPro from "@/components/RewardsPro";
import PremiumSection from "@/components/PremiumSection";
import RewardsModalNew from "@/components/rewards/RewardsModal";
import RewardCard from "@/components/rewards/RewardCard";
import { useRewardsStore } from "@/state/rewardsStore";

/**
 * PRISM – Student Finances. Smarter. Rewarded.
 * Ultra‑premium single‑page experience (Revolut‑style) with long, cinematic sections,
 * horizontal motion on scroll, metallic tiers, and interactive visuals.
 *
 * Tech: React + Tailwind + Framer Motion + Recharts
 *
 * Sections (keep only these):
 * 1) Hero (balance, points, CTAs)
 * 2) Intelligence (donut breakdown + trend line)
 * 3) Challenges (interactive cards, tilt)
 * 4) Rewards (metallic tier carousel + progress)
 * 5) CTA
 */

// ---------------- Demo Data ----------------
const BALANCE = 2847;
const POINTS = 1250; // Silver

const spendBreakdown = [{
  name: "Food",
  value: 38
}, {
  name: "Transport",
  value: 17
}, {
  name: "Entertainment",
  value: 15
}, {
  name: "Bills",
  value: 20
}, {
  name: "Other",
  value: 10
}];
const monthlyTrend = [{
  m: "Apr",
  v: 812
}, {
  m: "May",
  v: 793
}, {
  m: "Jun",
  v: 768
}, {
  m: "Jul",
  v: 845
}, {
  m: "Aug",
  v: 807
}, {
  m: "Sep",
  v: 829
}];
const CHALLENGES = [{
  id: 1,
  icon: Receipt,
  label: "Pay utilities before the due date",
  pts: 80,
  progress: 0.65
}, {
  id: 2,
  icon: Droplet,
  label: "Cut down shower time or reduce water usage by 10%",
  pts: 120,
  progress: 0.42
}, {
  id: 3,
  icon: Zap,
  label: "Turn off lights + appliances when not needed",
  pts: 150,
  progress: 0.78
}];
const COLORS = ["#34d399", "#10b981", "#a7f3d0", "#6ee7b7", "#064e3b"];
function Card({
  children,
  className = ""
}: React.PropsWithChildren<{
  className?: string;
}>) {
  return <div className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>
      {children}
    </div>;
}
export default function PrismLanding() {
  const [openRewards, setOpenRewards] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sync points from new rewards store
  const { rewards, points, openRedeem, setPoints } = useRewardsStore();
  useEffect(() => { setPoints(POINTS); }, [setPoints]);
  
  // Scroll-based animations for hero
  const { scrollY } = useScroll();
  const heroX = useTransform(scrollY, [0, 250], [0, 28]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.65]);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      console.log('CSV file selected:', file.name);
      // TODO: Process CSV file here
    } else {
      alert('Please select a valid CSV file');
    }
  };
  const donutData = useMemo(() => spendBreakdown.map((d, i) => ({
    ...d,
    color: COLORS[i % COLORS.length]
  })), []);
  return <SmoothScroll>
      <div className="min-h-screen bg-gradient-to-b from-background via-surface-card to-background text-white selection:bg-emerald-500/30">
        {/* NAV */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-emerald-500/20 grid place-content-center"><span className="block size-2.5 rounded-sm bg-emerald-400" /></div>
              <span className="font-semibold tracking-wide">SAVR</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
              <a href="#hero" className="hover:text-white">Home</a>
              <a href="#insights" className="hover:text-white">Insights</a>
              <a href="#transactions" className="hover:text-white">Transactions</a>
              <a href="#challenges" className="hover:text-white">Challenges</a>
              <a href="#rewards" className="hover:text-white">Rewards</a>
            </nav>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </header>

        {/* HERO */}
        <Section id="hero">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.16),transparent_60%)]" />
          
          {/* Premium grain overlay */}
          <div className="premium-grain absolute inset-0 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <motion.h1 
                style={{ 
                  x: heroX, 
                  opacity: heroOpacity
                }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
                className="text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight"
              >
                Your Money.
                <span className="block text-emerald-400">Decoded & Rewarded.</span>
              </motion.h1>
              <p className="text-white/70 text-lg max-w-lg">AI that helps you spend better, save faster, and earn real rewards.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 premium-shine concave-surface">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">Current Balance</div>
                  <div className="mt-2 text-4xl font-bold tabular-nums">£{BALANCE.toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-2 text-emerald-400/80 text-sm"><TrendingUp className="size-4" />+2.3% this month</div>
                </Card>
                <Card className="p-5 premium-shine concave-surface">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">Reward Points</div>
                  <div className="mt-2 text-4xl font-bold tabular-nums">{points.toLocaleString()}</div>
                </Card>
              </div>

              <TierProgress points={points} />

              <div className="flex flex-wrap items-center gap-3">
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                <button onClick={handleUploadClick} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-shadow">
                  <Upload className="size-4" /> Upload CSV
                </button>
                <button onClick={() => rewards.length > 0 && openRedeem(rewards[0])} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 px-6 py-4 font-semibold text-emerald-300 hover:bg-emerald-500/10">
                  View Rewards <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Right: 3D Pot */}
            <SavingsPot3D balance={BALANCE} goal={5000} points={points} />
          </div>
        </Section>

        {/* INSIGHTS */}
        <PremiumSection theme="analytical">
          <Section id="insights" headline="Intelligence" subhead="Spending breakdown, trends, and personalized savings tips.">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donut breakdown */}
            <Card className="p-6 concave-surface float-subtle">
              <div className="text-sm text-white/70 mb-4">Spending breakdown</div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} innerRadius={70} outerRadius={110} dataKey="value">
                      {donutData.map((entry, index) => <Cell key={`c-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {donutData.map(d => <div key={d.name} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{
                  background: d.color
                }} />
                    <span className="text-white/80">{d.name} — {d.value}%</span>
                  </div>)}
              </div>
            </Card>

            {/* Trend + bullets */}
            <Card className="p-6 concave-surface">
              <div className="text-sm text-white/70 mb-4">Monthly trend</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{
                  left: 0,
                  right: 0,
                  top: 8,
                  bottom: 0
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="m" stroke="#9ca3af" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} width={32} />
                    <Line type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2.4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-white/85">
                <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> 23% more on Deliveroo on Sundays</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> 2 unused subscriptions detected</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /> You're £45 below top savers</div>
              </div>
            </Card>
          </div>
          </Section>
        </PremiumSection>

        {/* HOUSR REWARDS */}
        <PremiumSection theme="default">
          <Section id="housr" headline="Housr Rewards" subhead="Earn points every month from rent and bills paid on time.">
          <HousrRewards
            monthLabel="November 2025"
            rentPaid={1000}
            billsPaid={50}
            paidOnTime={true}
            streakMonths={3}
            points={points}
            onRedeem={() => rewards.length > 0 && openRedeem(rewards[0])}
            config={{
              rentRate: 1,
              billsRate: 0.5,
              onTimeBonus: 150,
              streakBonusPerMonth: 100,
            }}
          />
          </Section>
        </PremiumSection>

        {/* AI FINANCIAL ADVISOR */}
        <PremiumSection theme="analytical">
          <FinancialAdvisorAI />
        </PremiumSection>

        {/* CHALLENGES */}
        <PremiumSection theme="gamified">
          <SmartChallengesPro challenges={CHALLENGES} />
        </PremiumSection>

        {/* REWARDS */}
        <PremiumSection theme="luxury">
          <Section id="rewards" headline="Redeem Rewards" subhead="Unlock exclusive perks with your points — swipe to claim with QR codes.">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#7a4b2b] to-[#bf8a5a] text-white">
                  <h3 className="text-lg font-semibold mb-2">Bronze</h3>
                  <p className="text-sm opacity-80 mb-4">100–499 pts</p>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Student discounts</li>
                    <li>• Cashback vouchers</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#585c68] to-[#b9c4cf] text-white">
                  <h3 className="text-lg font-semibold mb-2">Silver</h3>
                  <p className="text-sm opacity-80 mb-4">500–1,499 pts</p>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Cinema passes</li>
                    <li>• Restaurant deals</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#9a7a2f] to-[#f0d27a] text-white">
                  <h3 className="text-lg font-semibold mb-2">Gold</h3>
                  <p className="text-sm opacity-80 mb-4">1,500–4,999 pts</p>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Luxury experiences</li>
                    <li>• Weekend getaways</li>
                  </ul>
                </div>
                
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#5b6a78] to-[#c0d8ee] text-white">
                  <h3 className="text-lg font-semibold mb-2">Platinum</h3>
                  <p className="text-sm opacity-80 mb-4">5,000+ pts</p>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li>• Premium gyms</li>
                    <li>• Designer rentals</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map(r => <RewardCard key={r.id} reward={r} />)}
              </div>
            </div>
          </Section>
        </PremiumSection>

        {/* TRANSACTIONS */}
        <PremiumSection theme="default">
          <Section id="transactions" headline="Transaction History" subhead="Track every payment and purchase with detailed insights.">
            <TransactionsSection />
          </Section>
        </PremiumSection>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-8 text-sm text-white/60 flex items-center justify-between">
            <div>© {new Date().getFullYear()} PRISM</div>
            <div className="flex items-center gap-6"><a className="hover:text-white" href="#">Privacy</a><a className="hover:text-white" href="#">Terms</a></div>
          </div>
        </footer>

        <RewardsModal 
          open={openRewards} 
          onClose={() => setOpenRewards(false)} 
          points={points} 
          onRedeem={r => {
            console.log('Redeem', r.id);
            setOpenRewards(false);
          }} 
        />
        
        <RewardsModalNew />
      </div>
    </SmoothScroll>;
}