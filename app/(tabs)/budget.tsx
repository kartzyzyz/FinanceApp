// ============================================
// Modern Budget Targets & Analytics Screen
// ============================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, getMonthName } from '@/src/utils/helpers';
import { getCategoryByName } from '@/src/utils/categories';
import { THEME } from '@/src/utils/theme';

const DEFAULT_CATEGORY_LIMITS: Record<string, number> = {
  'Food & Dining': 6000,
  'Groceries': 10000,
  'Shopping': 7000,
  'Bills & Utilities': 8000,
  'Transportation': 5000,
  'Entertainment': 4000,
  'Health & Medical': 5000,
  'Education': 6000,
  'Personal Care': 3000,
  'Others': 4000,
};

export default function BudgetScreen() {
  const { selectedMonth, selectedYear, getMonthlySummary } = useTransactionStore();
  const summary = getMonthlySummary();

  const totalMonthlyTarget = 40000;
  const budgetUsagePercent = Math.min(
    150,
    Math.round((summary.totalExpenses / totalMonthlyTarget) * 100)
  );

  const isOverBudget = summary.totalExpenses > totalMonthlyTarget;
  const isNearLimit = !isOverBudget && budgetUsagePercent >= 80;

  const categoryBudgetItems = useMemo(() => {
    return summary.categoryBreakdown.map((item) => {
      const limit = DEFAULT_CATEGORY_LIMITS[item.category] || 5000;
      const percent = Math.min(150, Math.round((item.amount / limit) * 100));
      const remaining = Math.max(0, limit - item.amount);
      const isOver = item.amount > limit;
      return {
        ...item,
        limit,
        percent,
        remaining,
        isOver,
      };
    });
  }, [summary.categoryBreakdown]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Budget & Targets</Text>
        <Text style={styles.screenSubtitle}>
          {getMonthName(selectedMonth)} {selectedYear} Financial Plan
        </Text>
      </View>

      {/* Main Budget Health Card */}
      <View style={styles.masterBudgetCard}>
        <View style={styles.masterTopRow}>
          <View>
            <Text style={styles.masterLabel}>TOTAL MONTHLY CAP</Text>
            <Text style={styles.masterAmount}>
              {formatCurrency(summary.totalExpenses)}
              <Text style={styles.masterTotal}> / {formatCurrency(totalMonthlyTarget)}</Text>
            </Text>
          </View>

          <View
            style={[
              styles.healthPill,
              {
                backgroundColor: isOverBudget
                  ? THEME.colors.expenseBg
                  : isNearLimit
                  ? THEME.colors.warningBg
                  : THEME.colors.incomeBg,
                borderColor: isOverBudget
                  ? THEME.colors.expenseBorder
                  : isNearLimit
                  ? '#FDE68A'
                  : THEME.colors.incomeBorder,
              },
            ]}
          >
            <Ionicons
              name={
                isOverBudget
                  ? 'alert-circle'
                  : isNearLimit
                  ? 'warning-outline'
                  : 'shield-checkmark'
              }
              size={14}
              color={
                isOverBudget
                  ? THEME.colors.expense
                  : isNearLimit
                  ? THEME.colors.warning
                  : THEME.colors.income
              }
            />
            <Text
              style={[
                styles.healthText,
                {
                  color: isOverBudget
                    ? THEME.colors.expense
                    : isNearLimit
                    ? '#B45309'
                    : THEME.colors.income,
                },
              ]}
            >
              {isOverBudget ? 'Exceeded' : isNearLimit ? 'Near Cap' : 'On Track'}
            </Text>
          </View>
        </View>

        {/* Master Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, budgetUsagePercent)}%`,
                backgroundColor: isOverBudget
                  ? THEME.colors.expense
                  : isNearLimit
                  ? THEME.colors.warning
                  : THEME.colors.income,
              },
            ]}
          />
        </View>

        {/* Footer Metrics */}
        <View style={styles.masterFooterRow}>
          <Text style={styles.metricText}>{budgetUsagePercent}% of limit used</Text>
          <Text style={styles.metricText}>
            {isOverBudget
              ? `Over by ${formatCurrency(summary.totalExpenses - totalMonthlyTarget)}`
              : `${formatCurrency(totalMonthlyTarget - summary.totalExpenses)} left`}
          </Text>
        </View>
      </View>

      {/* Smart Financial Advice Banner */}
      <View style={styles.insightBanner}>
        <View style={styles.insightIconCircle}>
          <Ionicons name="sparkles" size={18} color="#D97706" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Financial Health Assessment</Text>
          <Text style={styles.insightBody}>
            {summary.totalIncome > 0
              ? `You've conserved ${Math.max(
                  0,
                  Math.round((summary.balance / summary.totalIncome) * 100)
                )}% of total revenue. Keeping total expenses under 50% guarantees rapid wealth accumulation.`
              : 'Add your salary and revenue streams to unlock automatic savings rate optimization.'}
          </Text>
        </View>
      </View>

      {/* Category Breakdown Header */}
      <Text style={styles.sectionHeader}>Category Budget Limits</Text>

      {categoryBudgetItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pie-chart-outline" size={38} color={THEME.colors.textMuted} />
          <Text style={styles.emptyTitle}>No Expenses Logged Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add daily transactions to track category limits in real-time.
          </Text>
        </View>
      ) : (
        categoryBudgetItems.map((catItem) => {
          const catMeta = getCategoryByName(catItem.category);

          return (
            <View key={catItem.category} style={styles.categoryCard}>
              <View style={styles.catTopRow}>
                <View style={styles.catIdentity}>
                  <View
                    style={[
                      styles.catIconWrap,
                      { backgroundColor: catMeta?.bgLight || THEME.colors.surfaceSubtle },
                    ]}
                  >
                    <Ionicons
                      name={(catMeta?.icon as any) || 'pricetag-outline'}
                      size={18}
                      color={catMeta?.color || THEME.colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.catTitle}>{catItem.category}</Text>
                    <Text style={styles.catLimitText}>
                      Cap: {formatCurrency(catItem.limit)}
                    </Text>
                  </View>
                </View>

                <View style={styles.catSpendArea}>
                  <Text style={styles.catSpentText}>
                    {formatCurrency(catItem.amount)}
                  </Text>
                  <Text
                    style={[
                      styles.catStatusText,
                      {
                        color: catItem.isOver
                          ? THEME.colors.expense
                          : catItem.percent >= 80
                          ? THEME.colors.warning
                          : THEME.colors.income,
                      },
                    ]}
                  >
                    {catItem.isOver
                      ? `Over by ${formatCurrency(catItem.amount - catItem.limit)}`
                      : `${formatCurrency(catItem.remaining)} left`}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.catProgressTrack}>
                <View
                  style={[
                    styles.catProgressFill,
                    {
                      width: `${Math.min(100, catItem.percent)}%`,
                      backgroundColor: catItem.isOver
                        ? THEME.colors.expense
                        : catMeta?.color || THEME.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 28,
  },
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },

  // Master Budget Card
  masterBudgetCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
    ...THEME.shadows.card,
  },
  masterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  masterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  masterAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  masterTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  healthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    gap: 4,
  },
  healthText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  masterFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },

  // Insight Banner
  insightBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 24,
    gap: 12,
  },
  insightIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  insightBody: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 3,
    lineHeight: 17,
  },

  // Section Header
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  // Category Card
  categoryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  catLimitText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  catSpendArea: {
    alignItems: 'flex-end',
  },
  catSpentText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  catStatusText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  catProgressTrack: {
    height: 6,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
});
