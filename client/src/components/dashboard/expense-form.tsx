import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertExpenseSchema, type InsertExpense } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Check } from 'lucide-react';

const categories = [
  { value: 'Food', label: '🍽️ Food', emoji: '🍽️' },
  { value: 'Transport', label: '🚗 Transport', emoji: '🚗' },
  { value: 'Shopping', label: '🛍️ Shopping', emoji: '🛍️' },
  { value: 'Bills', label: '📄 Bills', emoji: '📄' },
  { value: 'Others', label: '📦 Others', emoji: '📦' },
];

export function ExpenseForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertExpense>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertExpense) => {
      return await apiRequest('POST', '/api/expenses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      setShowSuccess(true);
      form.reset({
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      
      toast({
        title: "Expense added!",
        description: "Your expense has been successfully recorded.",
      });

      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExpense) => {
    mutation.mutate({
      ...data,
      amount: Number(data.amount),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Add New Expense</h2>
        <p className="text-muted-foreground">Track your spending in real-time</p>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Amount ($)
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="text-lg pl-8"
                  {...form.register('amount', { valueAsNumber: true })}
                  data-testid="input-amount"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </Label>
              <Select 
                onValueChange={(value) => form.setValue('category', value)}
                value={form.watch('category')}
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-foreground">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                {...form.register('date')}
                data-testid="input-date"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium text-foreground">
                Note (optional)
              </Label>
              <Input
                id="note"
                type="text"
                placeholder="Add a description..."
                {...form.register('note')}
                data-testid="input-note"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-3 text-lg font-semibold"
              disabled={mutation.isPending}
              data-testid="button-add-expense"
            >
              {mutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Expense</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          data-testid="success-popup"
        >
          <Card className="p-8 text-center success-popup">
            <CardContent>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Expense Added!</h3>
              <p className="text-muted-foreground">Your expense has been successfully recorded.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
