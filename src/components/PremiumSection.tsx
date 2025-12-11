import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumSectionProps {
  children: ReactNode;
  theme?: "default" | "gamified" | "analytical" | "luxury";
  className?: string;
}

export default function PremiumSection({ 
  children, 
  theme = "default",
  className = "" 
}: PremiumSectionProps) {
  
  const themeBackgrounds = {
    default: "bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent_60%)]",
    gamified: "bg-[radial-gradient(ellipse_140%_70%_at_50%_0%,rgba(52,211,153,0.15),rgba(16,185,129,0.08)_50%,transparent_70%)]",
    analytical: "bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,transparent_50%,rgba(52,211,153,0.06)_100%)]",
    luxury: "bg-[radial-gradient(ellipse_100%_80%_at_50%_20%,rgba(212,175,55,0.08),rgba(192,192,192,0.05)_40%,transparent_70%)]"
  };

  return (
    <div className={`relative premium-grain ${className}`}>
      {/* Top edge glow */}
      <div className="edge-glow" />
      
      {/* Gradient wave background */}
      <div className={`gradient-wave ${themeBackgrounds[theme]}`} />
      
      {/* Sparkle particles (subtle) */}
      {theme === "luxury" && (
        <>
          <div className="sparkle" style={{ top: "15%", left: "20%", animationDelay: "0s" }} />
          <div className="sparkle" style={{ top: "40%", right: "25%", animationDelay: "1.5s" }} />
          <div className="sparkle" style={{ bottom: "30%", left: "35%", animationDelay: "3s" }} />
        </>
      )}
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
