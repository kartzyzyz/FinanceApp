// ============================================
// Modern Dashboard Screen (Fintech Luxury UI)
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, getGreeting, getMonthName } from '@/src/utils/helpers';
import { getCategoryByName } from '@/src/utils/categories';
import { THEME } from '@/src/utils/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    transactions,
    isLoading,
    selectedMonth,
    selectedYear,
    setMonth,
    fetchByMonth,
    getMonthlySummary,
  } = useTransactionStore();

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const summary = getMonthlySummary();

  useEffect(() => {
    if (user) {
      fetchByMonth(user.uid, selectedYear, selectedMonth);
    }
  }, [user, selectedMonth, selectedYear]);

  const onRefresh = () => {
    if (user) {
      fetchByMonth(user.uid, selectedYear, selectedMonth);
    }
  };

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

  const savingsRate =
    summary.totalIncome > 0
      ? Math.max(0, Math.round(((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100))
      : 0;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={THEME.colors.primary}
        />
      }
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarText}>
              {(user?.displayName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.displayName || 'Senior Dev'}</Text>
          </View>
        </View>

        {/* Month Selector Pill */}
        <View style={styles.monthPill}>
          <TouchableOpacity onPress={handlePrevMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-back" size={16} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.monthPillText}>
            {getMonthName(selectedMonth).slice(0, 3)} {selectedYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-forward" size={16} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Financial Balance Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>TOTAL NET BALANCE</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.heroBalance}>
                {isBalanceHidden ? '••••••••' : formatCurrency(summary.balance)}
              </Text>
              <TouchableOpacity
                onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                style={styles.eyeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                  size={19}
                  color={THEME.colors.heroSubtext}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Savings Badge */}
          {summary.totalIncome > 0 && (
            <View style={styles.savingsBadge}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={styles.savingsText}>{savingsRate}% Saved</Text>
            </View>
          )}
        </View>

        {/* Income / Expense Dual Pods */}
        <View style={styles.dualPodContainer}>
          {/* Income Pod */}
          <View style={styles.pod}>
            <View style={styles.podHeader}>
              <View style={[styles.arrowBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="arrow-down" size={14} color="#10B981" />
              </View>
              <Text style={styles.podLabel}>Income</Text>
            </View>
            <Text style={styles.incomeVal}>
              {isBalanceHidden ? '••••••' : formatCurrency(summary.totalIncome)}
            </Text>
          </View>

          <View style={styles.podDivider} />

          {/* Expense Pod */}
          <View style={styles.pod}>
            <View style={styles.podHeader}>
              <View style={[styles.arrowBadge, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
                <Ionicons name="arrow-up" size={14} color="#F43F5E" />
              </View>
              <Text style={styles.podLabel}>Expenses</Text>
            </View>
            <Text style={styles.expenseVal}>
              {isBalanceHidden ? '••••••' : formatCurrency(summary.totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Action Navigation Buttons */}
      <View style={styles.quickActionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/add')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="add-circle" size={24} color={THEME.colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Add Tx</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/transactions')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="receipt-outline" size={22} color="#059669" />
          </View>
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/budget')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="pie-chart-outline" size={22} color="#D97706" />
          </View>
          <Text style={styles.actionLabel}>Budgets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Ionicons name="options-outline" size={22} color="#475569" />
          </View>
          <Text style={styles.actionLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Category Spending Multi-Color Breakdown Bar */}
      {summary.categoryBreakdown.length > 0 && (
        <View style={styles.cardContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Spending Breakdown</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/budget')}>
              <Text style={styles.seeAllText}>Analysis</Text>
            </TouchableOpacity>
          </View>

          {/* Segmented Bar */}
          <View style={styles.segmentedBar}>
            {summary.categoryBreakdown.map((item, index) => (
              <View
                key={item.category}
                style={{
                  flex: Math.max(0.05, item.percentage / 100),
                  backgroundColor: item.color,
                  height: 8,
                  borderTopLeftRadius: index === 0 ? 4 : 0,
                  borderBottomLeftRadius: index === 0 ? 4 : 0,
                  borderTopRightRadius: index === summary.categoryBreakdown.length - 1 ? 4 : 0,
                  borderBottomRightRadius: index === summary.categoryBreakdown.length - 1 ? 4 : 0,
                  marginRight: 2,
                }}
              />
            ))}
          </View>

          {/* Category Chips row */}
          <View style={styles.categoryChipsRow}>
            {summary.categoryBreakdown.slice(0, 3).map((item) => (
              <View key={item.category} style={styles.categoryLegendChip}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel} numberOfLines={1}>
                  {item.category}
                </Text>
                <Text style={styles.legendPct}>{Math.round(item.percentage)}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recent Transactions Feed */}
      <View style={styles.recentSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.seeAllText}>View All ({transactions.length})</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="wallet-outline" size={32} color={THEME.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Transactions Logged</Text>
            <Text style={styles.emptyDesc}>
              Tap the (+) button to record your first income or expense for this month.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.emptyBtnText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.slice(0, 5).map((item) => {
            const cat = getCategoryByName(item.category);
            const isIncome = item.type === 'income';

            return (
              <View key={item.id} style={styles.txRow}>
                <View
                  style={[
                    styles.txIconBox,
                    { backgroundColor: cat?.bgLight || THEME.colors.surfaceSubtle },
                  ]}
                >
                  <Ionicons
                    name={(cat?.icon as any) || 'pricetag-outline'}
                    size={20}
                    color={cat?.color || THEME.colors.primary}
                  />
                </View>

                <View style={styles.txInfo}>
                  <Text style={styles.txCategory}>{item.category}</Text>
                  <Text style={styles.txDesc} numberOfLines={1}>
                    {item.description || 'General transaction'}
                  </Text>
                </View>

                <View style={styles.txAmountContainer}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: isIncome ? THEME.colors.income : THEME.colors.textPrimary },
                    ]}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.txDate}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 28,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
    ...THEME.shadows.card,
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: 18,
    backgroundColor: THEME.colors.heroBg,
    borderRadius: THEME.radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: THEME.colors.heroBorder,
    ...THEME.shadows.hero,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.heroSubtext,
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  heroBalance: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.heroText,
    letterSpacing: -0.5,
  },
  eyeBtn: {
    padding: 4,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },

  // Dual Pods
  dualPodContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.heroCard,
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  pod: {
    flex: 1,
  },
  podHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  arrowBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podLabel: {
    fontSize: 12,
    color: THEME.colors.heroSubtext,
    fontWeight: '600',
  },
  incomeVal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#34D399',
  },
  expenseVal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FB7185',
  },
  podDivider: {
    width: 1,
    backgroundColor: THEME.colors.heroBorder,
    marginHorizontal: 14,
  },

  // Quick Action Buttons
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  actionBtn: {
    alignItems: 'center',
    width: 76,
  },
  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    ...THEME.shadows.card,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 8,
  },

  // Card Container for Breakdown
  cardContainer: {
    backgroundColor: THEME.colors.surface,
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: THEME.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 6,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  categoryLegendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    maxWidth: 90,
  },
  legendPct: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },

  // Recent Transactions
  recentSection: {
    paddingHorizontal: 18,
  },
  txRow: {
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
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  txDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  txDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 32,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    gap: 6,
    marginTop: 16,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
