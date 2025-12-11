import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function TransactionsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(["2024"]));
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(["2024-November"]));
  const [showAll, setShowAll] = useState(false);

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

  // Limit to show only recent month initially
  const displayedGrouped = useMemo(() => {
    if (showAll) return filteredGrouped;
    
    const limited: GroupedTransactions = {};
    const sortedYears = Object.keys(filteredGrouped).sort((a, b) => Number(b) - Number(a));
    
    if (sortedYears.length > 0) {
      const latestYear = sortedYears[0];
      const months = filteredGrouped[latestYear];
      const sortedMonths = Object.entries(months).sort((a, b) => {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames.indexOf(b[0]) - monthNames.indexOf(a[0]);
      });
      
      if (sortedMonths.length > 0) {
        limited[latestYear] = { [sortedMonths[0][0]]: sortedMonths[0][1].slice(0, 5) };
      }
    }
    
    return limited;
  }, [filteredGrouped, showAll]);

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

  const sortedYears = Object.keys(displayedGrouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      {showAll && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search by merchant, category, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
              className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort by {sortBy === "date" ? "Date" : "Amount"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        {sortedYears.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No transactions found</h3>
            <p className="text-white/60">Try adjusting your search filters</p>
          </div>
        ) : (
          sortedYears.map((year, yearIndex) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: yearIndex * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              <Collapsible open={expandedYears.has(year)} onOpenChange={() => toggleYear(year)}>
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    {expandedYears.has(year) ? (
                      <ChevronDown className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white/50" />
                    )}
                    <h2 className="text-2xl font-bold">{year}</h2>
                  </div>
                  <div className="text-sm text-white/60">
                    {Object.keys(displayedGrouped[year]).length} {showAll ? "months" : "month"}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3">
                    {Object.entries(displayedGrouped[year])
                      .sort((a, b) => {
                        const months = [
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ];
                        return months.indexOf(b[0]) - months.indexOf(a[0]);
                      })
                      .map(([month, transactions], monthIndex) => {
                        const yearMonth = `${year}-${month}`;
                        const { spent, received } = getMonthSummary(transactions);

                        return (
                          <motion.div
                            key={month}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: monthIndex * 0.1 }}
                            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                          >
                            <Collapsible
                              open={expandedMonths.has(yearMonth)}
                              onOpenChange={() => toggleMonth(yearMonth)}
                            >
                              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                  {expandedMonths.has(yearMonth) ? (
                                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <ChevronUp className="w-4 h-4 text-white/50" />
                                  )}
                                  <h3 className="text-lg font-semibold">{month}</h3>
                                </div>
                                <div className="flex gap-6 text-sm">
                                  <div className="text-right">
                                    <div className="text-xs text-white/50 mb-1">Spent</div>
                                    <div className="font-mono font-bold text-red-400">
                                      £{spent.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-white/50 mb-1">Received</div>
                                    <div className="font-mono font-bold text-emerald-400">
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
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-semibold">{transaction.merchant}</h4>
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-300 capitalize">
                                              {transaction.category.replace("_", " ")}
                                            </span>
                                          </div>
                                          <div className="text-sm text-white/50">
                                            {format(date, "PPP 'at' p")}
                                          </div>
                                        </div>
                                        <div
                                          className={`font-mono font-bold text-lg ${
                                            isPositive ? "text-emerald-400" : "text-red-400"
                                          }`}
                                        >
                                          {isPositive ? "+" : "-"}£{Math.abs(transaction.amount).toFixed(2)}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </motion.div>
                        );
                      })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ))
        )}
      </div>

      {/* Show More/Less Button */}
      {!showAll && (
        <div className="text-center">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            View All Transactions
          </Button>
        </div>
      )}
    </div>
  );
}
