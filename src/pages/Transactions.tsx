import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles,
  Award,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import transactionsData from "../../financial logic/mock_transactions.json";
import { format, parseISO } from "date-fns";

type Transaction = {
  user_id: string;
  ts: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
};

type GroupedTransactions = {
  [year: string]: {
    [month: string]: Transaction[];
  };
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Group transactions by year and month
  const groupedTransactions = useMemo(() => {
    const grouped: GroupedTransactions = {};
    
    (transactionsData as Transaction[]).forEach((transaction) => {
      const date = parseISO(transaction.ts);
      const year = format(date, "yyyy");
      const month = format(date, "MMMM");
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      grouped[year][month].push(transaction);
    });

    // Sort transactions within each month
    Object.keys(grouped).forEach((year) => {
      Object.keys(grouped[year]).forEach((month) => {
        grouped[year][month].sort((a, b) => {
          if (sortBy === "date") {
            return new Date(b.ts).getTime() - new Date(a.ts).getTime();
          }
          return Math.abs(b.amount) - Math.abs(a.amount);
        });
      });
    });

    return grouped;
  }, [sortBy]);

  // Filter transactions based on search query
  const filteredGrouped = useMemo(() => {
    if (!searchQuery) return groupedTransactions;

    const filtered: GroupedTransactions = {};
    const query = searchQuery.toLowerCase();

    Object.entries(groupedTransactions).forEach(([year, months]) => {
      Object.entries(months).forEach(([month, transactions]) => {
        const matchingTransactions = transactions.filter(
          (t) =>
            t.merchant.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            format(parseISO(t.ts), "PPP").toLowerCase().includes(query)
        );

        if (matchingTransactions.length > 0) {
          if (!filtered[year]) filtered[year] = {};
          filtered[year][month] = matchingTransactions;
        }
      });
    });

    return filtered;
  }, [groupedTransactions, searchQuery]);

  // Calculate monthly summary
  const getMonthSummary = (transactions: Transaction[]) => {
    const spent = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const received = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    return { spent, received };
  };

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(yearMonth)) {
        next.delete(yearMonth);
      } else {
        next.add(yearMonth);
      }
      return next;
    });
  };

  const sortedYears = Object.keys(filteredGrouped).sort((a, b) => Number(b) - Number(a));

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
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/transactions" className="text-sm font-medium text-foreground">
              Transactions
            </Link>
            <Link to="/challenges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Challenges
            </Link>
            <Link to="/rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Rewards
            </Link>
            <Link to="/savings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Savings
            </Link>
            <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Insights
            </Link>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View and analyze all your transactions organized by year and month
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by merchant, category, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
              className="gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort by {sortBy === "date" ? "Date" : "Amount"}
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {sortedYears.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            sortedYears.map((year) => (
              <div key={year} className="bg-card rounded-2xl border border-border overflow-hidden">
                <Collapsible open={expandedYears.has(year)} onOpenChange={() => toggleYear(year)}>
                  <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {expandedYears.has(year) ? (
                        <ChevronDown className="w-5 h-5 text-accent" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      )}
                      <h2 className="text-2xl font-bold">{year}</h2>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Object.keys(filteredGrouped[year]).length} months
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {Object.entries(filteredGrouped[year])
                        .sort((a, b) => {
                          const months = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ];
                          return months.indexOf(b[0]) - months.indexOf(a[0]);
                        })
                        .map(([month, transactions]) => {
                          const yearMonth = `${year}-${month}`;
                          const { spent, received } = getMonthSummary(transactions);

                          return (
                            <div key={month} className="bg-secondary/30 rounded-xl overflow-hidden">
                              <Collapsible
                                open={expandedMonths.has(yearMonth)}
                                onOpenChange={() => toggleMonth(yearMonth)}
                              >
                                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    {expandedMonths.has(yearMonth) ? (
                                      <ChevronDown className="w-4 h-4 text-accent" />
                                    ) : (
                                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <h3 className="text-lg font-semibold">{month}</h3>
                                  </div>
                                  <div className="flex gap-6 text-sm">
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground mb-1">Spent</div>
                                      <div className="font-mono font-bold text-destructive">
                                        £{spent.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground mb-1">Received</div>
                                      <div className="font-mono font-bold text-success">
                                        £{received.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="px-4 pb-4 space-y-2">
                                    {transactions.map((transaction, idx) => {
                                      const date = parseISO(transaction.ts);
                                      const isPositive = transaction.amount > 0;

                                      return (
                                        <div
                                          key={idx}
                                          className="bg-card rounded-lg p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                              <h4 className="font-semibold">{transaction.merchant}</h4>
                                              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize">
                                                {transaction.category.replace("_", " ")}
                                              </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              {format(date, "PPP 'at' p")}
                                            </div>
                                          </div>
                                          <div
                                            className={`font-mono font-bold text-lg ${
                                              isPositive ? "text-success" : "text-destructive"
                                            }`}
                                          >
                                            {isPositive ? "+" : "-"}£{Math.abs(transaction.amount).toFixed(2)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          );
                        })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
