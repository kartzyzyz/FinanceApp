// ============================================
// Profile & Settings Screen
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { transactionService } from '@/src/services/transactions';
import { isFirebaseConfigured } from '@/src/services/firebase';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { selectedMonth, selectedYear, fetchByMonth } = useTransactionStore();

  const handleResetData = () => {
    Alert.alert(
      'Reset Sample Data',
      'This will reload the initial demo data with realistic income & expenses.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await transactionService.resetDemoData();
            if (user) {
              await fetchByMonth(user.uid, selectedYear, selectedMonth);
            }
            Alert.alert('Success', 'Demo transactions have been refreshed!');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.displayName || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.displayName || 'Senior Dev'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'seniordev@budgetapp.io'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isFirebaseConfigured() ? 'Firebase Cloud Connected' : 'Offline / Local Mode Active'}
          </Text>
        </View>
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionHeader}>Preferences & Tools</Text>

      <View style={styles.cardGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="cash-outline" size={20} color="#4A90D9" />
            <Text style={styles.settingLabel}>Default Currency</Text>
          </View>
          <Text style={styles.settingValue}>PHP (₱)</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
          <View style={styles.settingLeft}>
            <Ionicons name="refresh-outline" size={20} color="#FF9800" />
            <Text style={styles.settingLabel}>Reload Sample Transactions</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      </View>

      {/* Architecture / Senior Dev Info */}
      <Text style={styles.sectionHeader}>Engineering Architecture</Text>
      <View style={styles.cardGroup}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Framework</Text>
          <Text style={styles.infoVal}>React Native 0.83 + Expo 58</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Language</Text>
          <Text style={styles.infoVal}>TypeScript 5.9 (Strict)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>State Management</Text>
          <Text style={styles.infoVal}>Zustand v5</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Navigation</Text>
          <Text style={styles.infoVal}>Expo Router (File-based)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Backend Provider</Text>
          <Text style={styles.infoVal}>Firebase Auth & Firestore + AsyncStorage</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>BudgetApp v1.0.0-mvp • Team Build</Text>
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
    paddingBottom: 40,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  badge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976D2',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F3F3',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoKey: {
    fontSize: 13,
    color: '#888',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    color: '#FF5252',
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#BBB',
    fontSize: 12,
    marginTop: 24,
  },
});
