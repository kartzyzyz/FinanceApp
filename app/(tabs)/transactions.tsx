// ============================================
// Transactions History Screen
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, formatDate, getMonthName } from '@/src/utils/helpers';
import { getCategoryByName } from '@/src/utils/categories';
import { Transaction } from '@/src/types';

export default function TransactionsScreen() {
  const { user } = useAuthStore();
  const {
    transactions,
    isLoading,
    selectedMonth,
    selectedYear,
    setMonth,
    fetchByMonth,
    deleteTransaction,
  } = useTransactionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesSearch =
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery);
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setMonth(12, selectedYear - 1);
    } else {
      setMonth(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setMonth(1, selectedYear + 1);
    } else {
      setMonth(selectedMonth + 1, selectedYear);
    }
  };

  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete ${tx.category} (${formatCurrency(tx.amount)})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(tx.id);
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const cat = getCategoryByName(item.category);
    const isIncome = item.type === 'income';

    return (
      <View style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: (cat?.color || '#4A90D9') + '20' },
          ]}
        >
          <Ionicons
            name={(cat?.icon as any) || 'receipt-outline'}
            size={22}
            color={cat?.color || '#4A90D9'}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description || 'No notes'}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? '#4CAF50' : '#FF5252' },
            ]}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(item.amount)}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color="#BBB" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Navigator */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {getMonthName(selectedMonth)} {selectedYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search category, note, amount..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'expense', 'income'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              filterType === tab && styles.filterTabActive,
            ]}
            onPress={() => setFilterType(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === tab && styles.filterTabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              if (user) fetchByMonth(user.uid, selectedYear, selectedMonth);
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={54} color="#D0D0D0" />
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or add a new transaction.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EBEBEB',
  },
  filterTabActive: {
    backgroundColor: '#4A90D9',
  },
  filterTabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  description: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});
