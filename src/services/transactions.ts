// ============================================
// Transaction Service - Firestore + Local Storage
// ============================================

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, isFirebaseConfigured } from './firebase';
import { Transaction, TransactionFormData } from '../types';

const COLLECTION = 'transactions';
const LOCAL_TX_KEY = '@budget_app_transactions';

const INITIAL_SAMPLE_TRANSACTIONS: (now: Date) => Transaction[] = (now: Date) => {
  const y = now.getFullYear();
  const m = now.getMonth();
  return [
    {
      id: 'tx_demo_1',
      userId: 'user_demo_senior_dev',
      type: 'income',
      amount: 65000,
      category: 'Salary',
      description: 'Monthly Tech Lead Salary',
      date: new Date(y, m, 1, 9, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_2',
      userId: 'user_demo_senior_dev',
      type: 'income',
      amount: 18500,
      category: 'Freelance',
      description: 'Mobile App Architecture Consulting',
      date: new Date(y, m, 5, 14, 30).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_3',
      userId: 'user_demo_senior_dev',
      type: 'expense',
      amount: 4500,
      category: 'Groceries',
      description: 'Weekly supermarket supplies',
      date: new Date(y, m, 8, 18, 15).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_4',
      userId: 'user_demo_senior_dev',
      type: 'expense',
      amount: 3200,
      category: 'Bills & Utilities',
      description: 'Fiber Internet & Electricity bill',
      date: new Date(y, m, 10, 11, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_5',
      userId: 'user_demo_senior_dev',
      type: 'expense',
      amount: 1850,
      category: 'Food & Dining',
      description: 'Dinner with engineering team',
      date: new Date(y, m, 11, 20, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_6',
      userId: 'user_demo_senior_dev',
      type: 'expense',
      amount: 2400,
      category: 'Transportation',
      description: 'Gasoline & Expressway tolls',
      date: new Date(y, m, 12, 8, 45).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tx_demo_7',
      userId: 'user_demo_senior_dev',
      type: 'expense',
      amount: 5200,
      category: 'Shopping',
      description: 'New Mechanical Keyboard',
      date: new Date(y, m, 13, 16, 20).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

async function getLocalTransactions(): Promise<Transaction[]> {
  const json = await AsyncStorage.getItem(LOCAL_TX_KEY);
  if (!json) {
    const seed = INITIAL_SAMPLE_TRANSACTIONS(new Date());
    await AsyncStorage.setItem(LOCAL_TX_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

async function saveLocalTransactions(txs: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_TX_KEY, JSON.stringify(txs));
}

export const transactionService = {
  // Add a new transaction
  async add(userId: string, data: TransactionFormData): Promise<string> {
    const now = new Date().toISOString();
    const amountVal = parseFloat(data.amount);

    if (isFirebaseConfigured()) {
      const docRef = await addDoc(collection(db, COLLECTION), {
        userId,
        type: data.type,
        amount: amountVal,
        category: data.category,
        description: data.description,
        date: data.date.toISOString(),
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    }

    // Local / Offline mode
    const txs = await getLocalTransactions();
    const id = 'tx_' + Date.now();
    const newTx: Transaction = {
      id,
      userId,
      type: data.type,
      amount: amountVal,
      category: data.category,
      description: data.description,
      date: data.date.toISOString(),
      createdAt: now,
      updatedAt: now,
    };
    txs.unshift(newTx);
    await saveLocalTransactions(txs);
    return id;
  },

  // Get all transactions for a user in a given month
  async getByMonth(userId: string, year: number, month: number): Promise<Transaction[]> {
    if (isFirebaseConfigured()) {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Transaction[];
    }

    // Local / Offline mode
    const all = await getLocalTransactions();
    return all
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get all transactions for a user
  async getAll(userId: string): Promise<Transaction[]> {
    if (isFirebaseConfigured()) {
      const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Transaction[];
    }

    const all = await getLocalTransactions();
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Update a transaction
  async update(id: string, data: Partial<TransactionFormData>): Promise<void> {
    if (isFirebaseConfigured()) {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        date: data.date ? data.date.toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const txs = await getLocalTransactions();
    const index = txs.findIndex((t) => t.id === id);
    if (index !== -1) {
      txs[index] = {
        ...txs[index],
        type: data.type ?? txs[index].type,
        amount: data.amount ? parseFloat(data.amount) : txs[index].amount,
        category: data.category ?? txs[index].category,
        description: data.description ?? txs[index].description,
        date: data.date ? data.date.toISOString() : txs[index].date,
        updatedAt: new Date().toISOString(),
      };
      await saveLocalTransactions(txs);
    }
  },

  // Delete a transaction
  async delete(id: string): Promise<void> {
    if (isFirebaseConfigured()) {
      await deleteDoc(doc(db, COLLECTION, id));
      return;
    }

    const txs = await getLocalTransactions();
    const filtered = txs.filter((t) => t.id !== id);
    await saveLocalTransactions(filtered);
  },

  // Reset demo sample data
  async resetDemoData(): Promise<void> {
    const seed = INITIAL_SAMPLE_TRANSACTIONS(new Date());
    await saveLocalTransactions(seed);
  },
};
