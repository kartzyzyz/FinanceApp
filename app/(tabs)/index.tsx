// ============================================
// Dashboard Screen (Home)
// ============================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency, getGreeting, getMonthName } from '@/src/utils/helpers';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    transactions,
    isLoading,
    selectedMonth,
    selectedYear,
    fetchByMonth,
    getMonthlySummary,
  } = useTransactionStore();

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
    >
      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>{user?.displayName || 'User'} 👋</Text>
        <Text style={styles.monthLabel}>
          {getMonthName(selectedMonth)} {selectedYear}
        </Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            { color: summary.balance >= 0 ? '#4CAF50' : '#FF5252' },
          ]}
        >
          {formatCurrency(summary.balance)}
        </Text>

        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeBox}>
            <View style={styles.iconRow}>
              <Ionicons name="arrow-down-circle" size={20} color="#4CAF50" />
              <Text style={styles.ieLabel}>Income</Text>
            </View>
            <Text style={styles.incomeAmount}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.expenseBox}>
            <View style={styles.iconRow}>
              <Ionicons name="arrow-up-circle" size={20} color="#FF5252" />
              <Text style={styles.ieLabel}>Expenses</Text>
            </View>
            <Text style={styles.expenseAmount}>
              {formatCurrency(summary.totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => router.push('/(tabs)/add')}
        >
          <Ionicons name="add-circle" size={28} color="#4A90D9" />
          <Text style={styles.quickActionText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => router.push('/(tabs)/transactions')}
        >
          <Ionicons name="list" size={28} color="#4A90D9" />
          <Text style={styles.quickActionText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => router.push('/(tabs)/budget')}
        >
          <Ionicons name="pie-chart" size={28} color="#4A90D9" />
          <Text style={styles.quickActionText}>Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first transaction
            </Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDesc}>{item.description || 'No description'}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.type === 'income' ? '#4CAF50' : '#FF5252' },
                ]}
              >
                {item.type === 'income' ? '+' : '-'}
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#888',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  monthLabel: {
    fontSize: 14,
    color: '#4A90D9',
    marginTop: 4,
    fontWeight: '600',
  },
  balanceCard: {
    margin: 20,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
  },
  balanceLabel: {
    color: '#AAA',
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  incomeBox: {
    flex: 1,
  },
  expenseBox: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ieLabel: {
    color: '#AAA',
    fontSize: 13,
  },
  incomeAmount: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  expenseAmount: {
    color: '#FF5252',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionBtn: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    fontWeight: '500',
  },
  recentSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  seeAll: {
    color: '#4A90D9',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  transactionDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
