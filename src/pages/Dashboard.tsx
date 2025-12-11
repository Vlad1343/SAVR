import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Upload, 
  Target, 
  Gift, 
  PiggyBank, 
  TrendingUp, 
  TrendingDown,
  Sparkles,
  Award,
  Flame,
  Coffee,
  ShoppingBag,
  Utensils,
  CreditCard
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Balance", value: "£2,847", change: "+2.3%", icon: TrendingUp, positive: true },
    { label: "Spent This Month", value: "£847", change: "-8%", icon: TrendingDown, positive: true },
    { label: "Saved This Month", value: "£234", change: "+15%", icon: TrendingUp, positive: true },
    { label: "Savings Streak", value: "12 days", subtitle: "New record!", icon: Flame, positive: true },
  ];

  const recentTransactions = [
    { merchant: "Tesco", category: "Groceries", amount: -42.50, date: "Today", icon: ShoppingBag },
    { merchant: "Costa Coffee", category: "Food & Dining", amount: -3.80, date: "Today", icon: Coffee },
    { merchant: "Uber", category: "Transportation", amount: -12.40, date: "Yesterday", icon: CreditCard },
    { merchant: "Deliveroo", category: "Takeaway", amount: -18.90, date: "Yesterday", icon: Utensils },
    { merchant: "Sainsbury's", category: "Groceries", amount: -67.20, date: "2 days ago", icon: ShoppingBag },
  ];

  const spendingCategories = [
    { category: "Food & Dining", amount: 287, percentage: 34, color: "bg-accent" },
    { category: "Shopping", amount: 213, percentage: 25, color: "bg-gold" },
    { category: "Transportation", amount: 156, percentage: 18, color: "bg-bronze" },
    { category: "Entertainment", amount: 124, percentage: 15, color: "bg-silver" },
    { category: "Other", amount: 67, percentage: 8, color: "bg-muted" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">PRISM</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-foreground">Dashboard</Link>
            <Link to="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Transactions</Link>
            <Link to="/challenges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Challenges</Link>
            <Link to="/rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rewards</Link>
            <Link to="/savings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Savings</Link>
            <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Insights</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-gold" />
              <span className="font-mono font-bold text-gold">1,247 pts</span>
            </div>
            <div className="w-8 h-8 rounded-full tier-gold" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.positive ? 'text-success' : 'text-warning'}`} />
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  stat.positive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold font-mono mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-xs text-accent mt-1">{stat.subtitle}</div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Breakdown */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Spending Breakdown</h2>
                <Button variant="outline" size="sm">This Month</Button>
              </div>
              
              <div className="space-y-4">
                {spendingCategories.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="font-mono font-bold">£{item.amount}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <Link to="/transactions">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <transaction.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.merchant}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.date} · {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-warning">
                      £{Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Tier Progress */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold mb-4">Your Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="tier-gold w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  GOLD
                </div>
                <span className="text-sm text-muted-foreground">1,247 / 2,500 pts</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 mb-4">
                <div className="tier-gold h-3 rounded-full" style={{ width: "50%" }} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">1,253 points to Platinum</p>
              <Button variant="outline" size="sm" className="w-full">View Benefits</Button>
            </div>

            {/* Active Challenges */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold mb-4">Active Challenges</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cut coffee spending</span>
                    <span className="text-xs font-bold text-accent">+150 pts</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mb-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: "70%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">4 days left</span>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-transparent border border-gold/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Save £50 this week</span>
                    <span className="text-xs font-bold text-gold">+200 pts</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mb-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: "40%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">6 days left</span>
                </div>
              </div>
              <Link to="/challenges">
                <Button variant="outline" size="sm" className="w-full mt-4">View All Challenges</Button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/upload">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Statement
                  </Button>
                </Link>
                <Link to="/savings">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <PiggyBank className="w-5 h-5 mr-2" />
                    Add to Savings
                  </Button>
                </Link>
                <Link to="/rewards">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Gift className="w-5 h-5 mr-2" />
                    Browse Rewards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
