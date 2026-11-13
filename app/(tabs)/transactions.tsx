// ============================================
// Modern Transactions Ledger & History Screen
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, formatDate, getMonthName } from '@/src/utils/helpers';
import { getCategoryByName } from '@/src/utils/categories';
import { Transaction } from '@/src/types';
import { THEME } from '@/src/utils/theme';

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
    getMonthlySummary,
  } = useTransactionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  const summary = getMonthlySummary();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.amount.toString().includes(q);
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
      `Delete "${tx.category}" for ${formatCurrency(tx.amount)}?`,
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

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const cat = getCategoryByName(item.category);
    const isIncome = item.type === 'income';

    return (
      <View style={styles.card}>
        <View
          style={[
            styles.catIconWrap,
            { backgroundColor: cat?.bgLight || THEME.colors.surfaceSubtle },
          ]}
        >
          <Ionicons
            name={(cat?.icon as any) || 'pricetag-outline'}
            size={20}
            color={cat?.color || THEME.colors.primary}
          />
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.catName}>{item.category}</Text>
          <Text style={styles.txDescription} numberOfLines={1}>
            {item.description || 'No notes added'}
          </Text>
          <Text style={styles.txDate}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.cardActionArea}>
          <Text
            style={[
              styles.txAmount,
              { color: isIncome ? THEME.colors.income : THEME.colors.textPrimary },
            ]}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(item.amount)}
          </Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={15} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Month Switcher */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Transaction Ledger</Text>
          <Text style={styles.screenSubtitle}>
            {getMonthName(selectedMonth)} {selectedYear}
          </Text>
        </View>

        <View style={styles.monthNavPill}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrow}>
            <Ionicons name="chevron-back" size={16} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.navDivider} />
          <TouchableOpacity onPress={handleNextMonth} style={styles.navArrow}>
            <Ionicons name="chevron-forward" size={16} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mini Financial Summary Strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryIncomeVal}>+{formatCurrency(summary.totalIncome)}</Text>
        </View>
        <View style={styles.summarySeparator} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Spent</Text>
          <Text style={styles.summaryExpenseVal}>-{formatCurrency(summary.totalExpenses)}</Text>
        </View>
        <View style={styles.summarySeparator} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Flow</Text>
          <Text
            style={[
              styles.summaryNetVal,
              { color: summary.balance >= 0 ? THEME.colors.income : THEME.colors.expense },
            ]}
          >
            {formatCurrency(summary.balance)}
          </Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by category, note, or amount..."
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs Row */}
      <View style={styles.filterPillsRow}>
        {(['all', 'expense', 'income'] as const).map((tab) => {
          const isActive = filterType === tab;
          const count =
            tab === 'all'
              ? transactions.length
              : transactions.filter((t) => t.type === tab).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setFilterType(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                <Text style={[styles.countText, isActive && styles.countTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              if (user) fetchByMonth(user.uid, selectedYear, selectedMonth);
            }}
            tintColor={THEME.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={28} color={THEME.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No matching transactions</Text>
            <Text style={styles.emptyDesc}>
              {searchQuery.length > 0
                ? 'Try a different keyword or clear the search filter.'
                : 'There are no records for this month yet.'}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchBtnText}>Reset Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 28,
    paddingBottom: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  monthNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  navArrow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navDivider: {
    width: 1,
    height: 16,
    backgroundColor: THEME.colors.border,
  },

  // Summary Strip
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: THEME.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  summaryIncomeVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.income,
  },
  summaryExpenseVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.expense,
  },
  summaryNetVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  summarySeparator: {
    width: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 4,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginHorizontal: 18,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
    ...THEME.shadows.card,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },

  // Filter Pills
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  countTextActive: {
    color: '#FFFFFF',
  },

  // List Content
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  txDescription: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  txDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 3,
  },
  cardActionArea: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },

  // Empty Container
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  clearSearchBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  clearSearchBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
});
