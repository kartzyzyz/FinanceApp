// ============================================
// Modern Category System & Color Palettes
// ============================================

import { Category } from '../types';

export interface CategoryEnhanced extends Category {
  bgLight: string;
}

export const DEFAULT_CATEGORIES: CategoryEnhanced[] = [
  // Expense categories
  {
    id: '1',
    name: 'Food & Dining',
    icon: 'restaurant-outline',
    color: '#F43F5E',
    bgLight: '#FFF1F2',
    type: 'expense',
  },
  {
    id: '2',
    name: 'Transportation',
    icon: 'car-outline',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    type: 'expense',
  },
  {
    id: '3',
    name: 'Shopping',
    icon: 'bag-handle-outline',
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    type: 'expense',
  },
  {
    id: '4',
    name: 'Bills & Utilities',
    icon: 'flash-outline',
    color: '#D97706',
    bgLight: '#FFFBEB',
    type: 'expense',
  },
  {
    id: '5',
    name: 'Entertainment',
    icon: 'game-controller-outline',
    color: '#EC4899',
    bgLight: '#FDF2F8',
    type: 'expense',
  },
  {
    id: '6',
    name: 'Health & Medical',
    icon: 'medkit-outline',
    color: '#EF4444',
    bgLight: '#FEF2F2',
    type: 'expense',
  },
  {
    id: '7',
    name: 'Education',
    icon: 'school-outline',
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    type: 'expense',
  },
  {
    id: '8',
    name: 'Groceries',
    icon: 'cart-outline',
    color: '#10B981',
    bgLight: '#ECFDF5',
    type: 'expense',
  },
  {
    id: '9',
    name: 'Personal Care',
    icon: 'sparkles-outline',
    color: '#14B8A6',
    bgLight: '#F0FDFA',
    type: 'expense',
  },
  {
    id: '10',
    name: 'Others',
    icon: 'ellipsis-horizontal-circle-outline',
    color: '#64748B',
    bgLight: '#F8FAFC',
    type: 'expense',
  },

  // Income categories
  {
    id: '11',
    name: 'Salary',
    icon: 'briefcase-outline',
    color: '#059669',
    bgLight: '#ECFDF5',
    type: 'income',
  },
  {
    id: '12',
    name: 'Freelance',
    icon: 'laptop-outline',
    color: '#4F46E5',
    bgLight: '#EEF2FF',
    type: 'income',
  },
  {
    id: '13',
    name: 'Investments',
    icon: 'trending-up-outline',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    type: 'income',
  },
  {
    id: '14',
    name: 'Business',
    icon: 'storefront-outline',
    color: '#D97706',
    bgLight: '#FFFBEB',
    type: 'income',
  },
  {
    id: '15',
    name: 'Other Income',
    icon: 'cash-outline',
    color: '#10B981',
    bgLight: '#ECFDF5',
    type: 'income',
  },
];

export const getExpenseCategories = () => DEFAULT_CATEGORIES.filter((c) => c.type === 'expense');
export const getIncomeCategories = () => DEFAULT_CATEGORIES.filter((c) => c.type === 'income');
export const getCategoryByName = (name: string): CategoryEnhanced | undefined =>
  DEFAULT_CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase()) ||
  DEFAULT_CATEGORIES.find((c) => name.toLowerCase().includes(c.name.toLowerCase()));
