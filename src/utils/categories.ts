// ============================================
// Default Categories
// ============================================

import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense categories
  { id: '1', name: 'Food & Dining', icon: 'fast-food', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transportation', icon: 'car', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'bag-handle', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Bills & Utilities', icon: 'flash', color: '#FFA726', type: 'expense' },
  { id: '5', name: 'Entertainment', icon: 'game-controller', color: '#AB47BC', type: 'expense' },
  { id: '6', name: 'Health', icon: 'medkit', color: '#EF5350', type: 'expense' },
  { id: '7', name: 'Education', icon: 'school', color: '#42A5F5', type: 'expense' },
  { id: '8', name: 'Personal Care', icon: 'heart', color: '#EC407A', type: 'expense' },
  { id: '9', name: 'Groceries', icon: 'cart', color: '#66BB6A', type: 'expense' },
  { id: '10', name: 'Others', icon: 'ellipsis-horizontal', color: '#78909C', type: 'expense' },

  // Income categories
  { id: '11', name: 'Salary', icon: 'wallet', color: '#26A69A', type: 'income' },
  { id: '12', name: 'Freelance', icon: 'laptop', color: '#5C6BC0', type: 'income' },
  { id: '13', name: 'Business', icon: 'briefcase', color: '#8D6E63', type: 'income' },
  { id: '14', name: 'Investments', icon: 'trending-up', color: '#29B6F6', type: 'income' },
  { id: '15', name: 'Other Income', icon: 'cash', color: '#9CCC65', type: 'income' },
];

export const getExpenseCategories = () => DEFAULT_CATEGORIES.filter((c) => c.type === 'expense');
export const getIncomeCategories = () => DEFAULT_CATEGORIES.filter((c) => c.type === 'income');
export const getCategoryByName = (name: string) => DEFAULT_CATEGORIES.find((c) => c.name === name);
