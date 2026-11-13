// ============================================
// Zustand Transaction Store
// ============================================

import { create } from 'zustand';
import { Transaction, TransactionFormData, MonthlySummary, CategoryBreakdown } from '../types';
import { transactionService } from '../services/transactions';
import { DEFAULT_CATEGORIES } from '../utils/categories';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: number; // 1-12
  selectedYear: number;

  // Actions
  fetchTransactions: (userId: string) => Promise<void>;
  fetchByMonth: (userId: string, year: number, month: number) => Promise<void>;
  addTransaction: (userId: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setMonth: (month: number, year: number) => void;
  clearError: () => void;

  // Computed
  getMonthlySummary: () => MonthlySummary;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),

  fetchTransactions: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await transactionService.getAll(userId);
      set({ transactions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchByMonth: async (userId, year, month) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await transactionService.getByMonth(userId, year, month);
      set({ transactions, isLoading: false, selectedMonth: month, selectedYear: year });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTransaction: async (userId, data) => {
    try {
      set({ isLoading: true, error: null });
      await transactionService.add(userId, data);
      // Refetch current month's transactions
      const { selectedYear, selectedMonth } = get();
      const transactions = await transactionService.getByMonth(userId, selectedYear, selectedMonth);
      set({ transactions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await transactionService.delete(id);
      const transactions = get().transactions.filter((t) => t.id !== id);
      set({ transactions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setMonth: (month, year) => set({ selectedMonth: month, selectedYear: year }),
  clearError: () => set({ error: null }),

  getMonthlySummary: (): MonthlySummary => {
    const { transactions } = get();
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Build category breakdown for expenses
    const categoryMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => {
        const cat = DEFAULT_CATEGORIES.find((c) => c.name === category);
        return {
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
          color: cat?.color || '#999999',
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      categoryBreakdown,
    };
  },
}));
