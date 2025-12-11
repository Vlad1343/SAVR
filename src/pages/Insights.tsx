import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp } from "lucide-react";

const Insights = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">PRISM</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/challenges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Challenges</Link>
            <Link to="/rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rewards</Link>
            <Link to="/savings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Savings</Link>
            <Link to="/insights" className="text-sm font-medium text-foreground">Insights</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Insights & Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your spending patterns</p>
        </div>

        <div className="text-center py-20">
          <TrendingUp className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Analytics Coming Soon</h2>
          <p className="text-muted-foreground">Upload statements to see detailed spending analytics</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
