import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { CustomPieChart } from '@/components/ui/pie-chart';
import { 
  TrendingUp, 
  PiggyBank, 
  Receipt, 
  ArrowUp, 
  ArrowDown,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Package
} from 'lucide-react';
import type { Expense } from '@shared/schema';

const categoryIcons = {
  Food: Utensils,
  Transport: Car, 
  Shopping: ShoppingBag,
  Bills: FileText,
  Others: Package,
};

const categoryColors = {
  Food: 'hsl(0 84% 60%)',
  Transport: 'hsl(203 89% 53%)',
  Shopping: 'hsl(280 65% 60%)',
  Bills: 'hsl(42 92% 56%)',
  Others: 'hsl(158 64% 52%)',
};

export function Dashboard() {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });

    const totalMonthly = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyBudget = 4000; // This could come from user settings
    const budgetRemaining = monthlyBudget - totalMonthly;
    
    // Category breakdown
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categoryColors[category as keyof typeof categoryColors] || 'hsl(215 20% 65%)',
    }));

    return {
      totalMonthly,
      budgetRemaining,
      totalExpenses: monthlyExpenses.length,
      chartData,
      recentTransactions: expenses.slice(0, 3),
    };
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Financial Overview</h2>
        <p className="text-muted-foreground">Track your spending and stay on budget</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="text-monthly-total">
                    <AnimatedCounter value={stats.totalMonthly} prefix="$" />
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-500 flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  12.5%
                </span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Remaining</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-budget-remaining">
                    <AnimatedCounter value={stats.budgetRemaining} prefix="$" />
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-primary flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  {((stats.budgetRemaining / 4000) * 100).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-2">of monthly budget</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-bold text-foreground" data-testid="text-total-expenses">
                    <AnimatedCounter value={stats.totalExpenses} />
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-primary flex items-center">
                  <span className="mr-1">+</span>
                  {Math.floor(stats.totalExpenses / 4)} this week
                </span>
                <span className="text-muted-foreground ml-2">transactions</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container rounded-lg p-4">
                {stats.chartData.length > 0 ? (
                  <CustomPieChart data={stats.chartData} />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-muted-foreground">No expenses yet</p>
                      <p className="text-sm text-muted-foreground">Add your first expense to see the breakdown</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentTransactions.length > 0 ? (
                  stats.recentTransactions.map((transaction) => {
                    const Icon = categoryIcons[transaction.category as keyof typeof categoryIcons] || Package;
                    const color = categoryColors[transaction.category as keyof typeof categoryColors] || 'hsl(215 20% 65%)';
                    
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-muted/10 rounded-lg"
                        data-testid={`transaction-${transaction.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{transaction.note || 'No description'}</p>
                            <p className="text-sm text-muted-foreground">{transaction.category}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-foreground">-${transaction.amount.toFixed(2)}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💳</div>
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground">Start adding expenses to see them here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
