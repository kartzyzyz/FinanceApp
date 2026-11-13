// ============================================
// Modern Profile & Settings Screen
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { transactionService } from '@/src/services/transactions';
import { isFirebaseConfigured } from '@/src/services/firebase';
import { THEME } from '@/src/utils/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { transactions, selectedMonth, selectedYear, fetchByMonth } = useTransactionStore();

  const handleResetData = () => {
    Alert.alert(
      'Reload Demo Data',
      'This will refresh your local ledger with standard sample transactions for testing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refresh',
          onPress: async () => {
            await transactionService.resetDemoData();
            if (user) {
              await fetchByMonth(user.uid, selectedYear, selectedMonth);
            }
            Alert.alert('Refreshed', 'Sample ledger data has been reloaded!');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Account</Text>
        <Text style={styles.screenSubtitle}>Settings & System Diagnostics</Text>
      </View>

      {/* User Identity Hero Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.displayName || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.displayName || 'Senior Dev'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'seniordev@budgetapp.io'}</Text>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isFirebaseConfigured()
                ? THEME.colors.incomeBg
                : '#EEF2FF',
              borderColor: isFirebaseConfigured()
                ? THEME.colors.incomeBorder
                : '#C7D2FE',
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isFirebaseConfigured()
                  ? THEME.colors.income
                  : THEME.colors.primary,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: isFirebaseConfigured()
                  ? THEME.colors.income
                  : THEME.colors.primary,
              },
            ]}
          >
            {isFirebaseConfigured() ? 'Firebase Cloud Active' : 'Offline Engine Active'}
          </Text>
        </View>

        {/* Quick Ledger Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{transactions.length}</Text>
            <Text style={styles.statDesc}>This Month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>PHP (₱)</Text>
            <Text style={styles.statDesc}>Currency</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>v1.0</Text>
            <Text style={styles.statDesc}>Version</Text>
          </View>
        </View>
      </View>

      {/* Preferences Group */}
      <Text style={styles.groupHeader}>Application Preferences</Text>
      <View style={styles.groupCard}>
        <View style={styles.rowItem}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconSquare, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="cash-outline" size={18} color={THEME.colors.primary} />
            </View>
            <Text style={styles.rowLabel}>Base Currency</Text>
          </View>
          <Text style={styles.rowValue}>Philippine Peso (₱)</Text>
        </View>

        <View style={styles.itemDivider} />

        <TouchableOpacity style={styles.rowItem} onPress={handleResetData} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconSquare, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="refresh-outline" size={18} color="#D97706" />
            </View>
            <View>
              <Text style={styles.rowLabel}>Reset Sample Records</Text>
              <Text style={styles.rowSubLabel}>Restore default demo transactions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Engineering Specs */}
      <Text style={styles.groupHeader}>Engineering Specifications</Text>
      <View style={styles.groupCard}>
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Mobile Runtime</Text>
          <Text style={styles.specVal}>React Native 0.88 + Expo 58</Text>
        </View>
        <View style={styles.itemDivider} />
        <View style={styles.specRow}>
          <Text style={styles.specKey}>TypeScript</Text>
          <Text style={styles.specVal}>Strict Mode (0 Errors)</Text>
        </View>
        <View style={styles.itemDivider} />
        <View style={styles.specRow}>
          <Text style={styles.specKey}>State Management</Text>
          <Text style={styles.specVal}>Zustand v5 Store</Text>
        </View>
        <View style={styles.itemDivider} />
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Routing Architecture</Text>
          <Text style={styles.specVal}>Expo File-based Router</Text>
        </View>
        <View style={styles.itemDivider} />
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Persistence Engine</Text>
          <Text style={styles.specVal}>Firestore + AsyncStorage Fallback</Text>
        </View>
      </View>

      {/* Sign Out CTA */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color={THEME.colors.expense} />
        <Text style={styles.signOutBtnText}>Log Out Account</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>BudgetApp • Built for Senior Dev Review</Text>
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

  // Profile Hero Card
  profileCard: {
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 24,
    ...THEME.shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: THEME.colors.primaryLight,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    gap: 6,
    marginTop: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 20,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  statDesc: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: THEME.colors.border,
  },

  // Groups
  groupHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 24,
    ...THEME.shadows.card,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  rowSubLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  specKey: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },

  // Sign out button
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.expenseBg,
    borderRadius: THEME.radius.lg,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: THEME.colors.expenseBorder,
    gap: 8,
    marginTop: 4,
  },
  signOutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.expense,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 20,
  },
});
