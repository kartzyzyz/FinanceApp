// ============================================
// Budget App - Core Type Definitions
// ============================================

// --- User Types ---
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
}

// --- Transaction Types ---
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: string;
  category: string;
  description: string;
  date: Date;
}

// --- Category Types ---
export interface Category {
  id: string;
  name: string;
  icon: string; // Ionicons name
  color: string; // hex color
  type: TransactionType;
}

// --- Budget Types ---
export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string; // YYYY-MM format
}

// --- Summary / Dashboard Types ---
export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// --- Navigation Types ---
export type RootTabParamList = {
  index: undefined;
  transactions: undefined;
  add: undefined;
  budget: undefined;
  profile: undefined;
};
