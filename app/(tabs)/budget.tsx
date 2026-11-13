// ============================================
// Budget & Analytics Screen
// ============================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, getMonthName } from '@/src/utils/helpers';
import { getCategoryByName } from '@/src/utils/categories';

// Default budget threshold per category for demonstration
const DEFAULT_CATEGORY_LIMITS: Record<string, number> = {
  'Food & Dining': 5000,
  'Groceries': 8000,
  'Shopping': 6000,
  'Bills & Utilities': 7000,
  'Transportation': 4000,
  'Entertainment': 3000,
  'Health': 4000,
  'Education': 5000,
  'Others': 3000,
};

export default function BudgetScreen() {
  const { selectedMonth, selectedYear, getMonthlySummary } = useTransactionStore();
  const summary = getMonthlySummary();

  const totalMonthlyBudget = 35000;
  const budgetUsagePercent = Math.min(
    100,
    Math.round((summary.totalExpenses / totalMonthlyBudget) * 100)
  );

  const categoryBudgetItems = useMemo(() => {
    return summary.categoryBreakdown.map((item) => {
      const limit = DEFAULT_CATEGORY_LIMITS[item.category] || 5000;
      const percent = Math.min(100, Math.round((item.amount / limit) * 100));
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Month Label */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Budget & Targets</Text>
        <Text style={styles.subtitle}>
          {getMonthName(selectedMonth)} {selectedYear}
        </Text>
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Overall Monthly Budget</Text>
          <Text style={styles.overviewRatio}>
            {formatCurrency(summary.totalExpenses)} / {formatCurrency(totalMonthlyBudget)}
          </Text>
        </View>

        {/* Master Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${budgetUsagePercent}%`,
                backgroundColor:
                  budgetUsagePercent > 90
                    ? '#FF5252'
                    : budgetUsagePercent > 75
                    ? '#FFA726'
                    : '#4CAF50',
              },
            ]}
          />
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statText}>
            {budgetUsagePercent}% spent
          </Text>
          <Text style={styles.statText}>
            {formatCurrency(Math.max(0, totalMonthlyBudget - summary.totalExpenses))} remaining
          </Text>
        </View>
      </View>

      {/* Category Budget Section */}
      <Text style={styles.sectionHeading}>Category Budget Tracking</Text>

      {categoryBudgetItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="pie-chart-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No expenses logged this month</Text>
          <Text style={styles.emptySubtext}>
            Log your transactions to track against your budget limits.
          </Text>
        </View>
      ) : (
        categoryBudgetItems.map((catItem) => {
          const catMeta = getCategoryByName(catItem.category);
          return (
            <View key={catItem.category} style={styles.categoryCard}>
              <View style={styles.catTopRow}>
                <View style={styles.catInfo}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: (catMeta?.color || '#4A90D9') + '20' },
                    ]}
                  >
                    <Ionicons
                      name={(catMeta?.icon as any) || 'pricetag-outline'}
                      size={18}
                      color={catMeta?.color || '#4A90D9'}
                    />
                  </View>
                  <View>
                    <Text style={styles.catName}>{catItem.category}</Text>
                    <Text style={styles.catLimit}>
                      Limit: {formatCurrency(catItem.limit)}
                    </Text>
                  </View>
                </View>

                <View style={styles.catSpendContainer}>
                  <Text style={styles.catSpent}>
                    {formatCurrency(catItem.amount)}
                  </Text>
                  <Text
                    style={[
                      styles.catStatus,
                      { color: catItem.isOver ? '#FF5252' : '#4CAF50' },
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
                      width: `${catItem.percent}%`,
                      backgroundColor: catItem.isOver
                        ? '#FF5252'
                        : catMeta?.color || '#4A90D9',
                    },
                  ]}
                />
              </View>
            </View>
          );
        })
      )}

      {/* Spending Tips Card */}
      <View style={styles.tipsCard}>
        <Ionicons name="bulb-outline" size={24} color="#FFA726" />
        <View style={styles.tipsContent}>
          <Text style={styles.tipsTitle}>Smart Financial Insight</Text>
          <Text style={styles.tipsDesc}>
            {summary.totalIncome > 0
              ? `Your savings rate is currently ${Math.max(
                  0,
                  Math.round((summary.balance / summary.totalIncome) * 100)
                )}%. Target 20%+ for long-term financial security.`
              : 'Add your income sources to unlock savings rate analytics and predictive tips.'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  overviewRatio: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A90D9',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  catLimit: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  catSpendContainer: {
    alignItems: 'flex-end',
  },
  catSpent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  catStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  catProgressTrack: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 4,
    textAlign: 'center',
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8D6E63',
  },
  tipsDesc: {
    fontSize: 12,
    color: '#5D4037',
    marginTop: 3,
    lineHeight: 17,
  },
});
