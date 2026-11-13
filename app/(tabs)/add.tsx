// ============================================
// Modern Add Transaction Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { TransactionType, TransactionFormData } from '@/src/types';
import { getExpenseCategories, getIncomeCategories } from '@/src/utils/categories';
import { THEME } from '@/src/utils/theme';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addTransaction, isLoading } = useTransactionStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dateOption, setDateOption] = useState<'today' | 'yesterday'>('today');

  const categories = type === 'expense' ? getExpenseCategories() : getIncomeCategories();

  const handleQuickAdd = (addVal: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addVal).toString());
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Missing Amount', 'Please enter a valid transaction amount.');
      return;
    }

    if (!category) {
      Alert.alert('Missing Category', 'Please pick a category for this transaction.');
      return;
    }

    if (!user) return;

    const txDate = new Date();
    if (dateOption === 'yesterday') {
      txDate.setDate(txDate.getDate() - 1);
    }

    const data: TransactionFormData = {
      type,
      amount,
      category,
      description: description.trim(),
      date: txDate,
    };

    try {
      await addTransaction(user.uid, data);
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      router.push('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save transaction.');
    }
  };

  const isExpense = type === 'expense';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Add Record</Text>
          <Text style={styles.screenSubtitle}>Keep your ledger updated</Text>
        </View>

        {/* Type Segmented Switcher */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              isExpense && { backgroundColor: THEME.colors.expense },
            ]}
            onPress={() => {
              setType('expense');
              setCategory('');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up-circle"
              size={18}
              color={isExpense ? '#FFFFFF' : THEME.colors.expense}
            />
            <Text style={[styles.segmentText, isExpense && styles.segmentTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              !isExpense && { backgroundColor: THEME.colors.income },
            ]}
            onPress={() => {
              setType('income');
              setCategory('');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-down-circle"
              size={18}
              color={!isExpense ? '#FFFFFF' : THEME.colors.income}
            />
            <Text style={[styles.segmentText, !isExpense && styles.segmentTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input Pad Display */}
        <View style={styles.amountDisplayCard}>
          <Text style={styles.amountCurrencyPrefix}>₱</Text>
          <TextInput
            style={[
              styles.amountInput,
              { color: isExpense ? THEME.colors.expense : THEME.colors.income },
            ]}
            placeholder="0.00"
            placeholderTextColor={THEME.colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus={false}
          />
        </View>

        {/* Quick Amount Shortcuts */}
        <View style={styles.quickShortcutsRow}>
          {[100, 500, 1000, 5000].map((val) => (
            <TouchableOpacity
              key={val}
              style={styles.shortcutChip}
              onPress={() => handleQuickAdd(val)}
              activeOpacity={0.7}
            >
              <Text style={styles.shortcutText}>+₱{val >= 1000 ? `${val / 1000}k` : val}</Text>
            </TouchableOpacity>
          ))}
          {amount.length > 0 && (
            <TouchableOpacity
              style={styles.clearChip}
              onPress={handleClearAmount}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={16} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Grid Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.fieldSectionLabel}>Select Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catCard,
                    isSelected && {
                      borderColor: cat.color,
                      backgroundColor: cat.bgLight,
                      transform: [{ scale: 1.02 }],
                    },
                  ]}
                  onPress={() => setCategory(cat.name)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.catIconWrap,
                      { backgroundColor: isSelected ? cat.color : cat.bgLight },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color={isSelected ? '#FFFFFF' : cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.catCardName,
                      isSelected && { color: cat.color, fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date Selector Chips */}
        <View style={styles.sectionBlock}>
          <Text style={styles.fieldSectionLabel}>Date</Text>
          <View style={styles.dateSelectorRow}>
            <TouchableOpacity
              style={[
                styles.dateChip,
                dateOption === 'today' && styles.dateChipActive,
              ]}
              onPress={() => setDateOption('today')}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={dateOption === 'today' ? '#FFFFFF' : THEME.colors.textSecondary}
              />
              <Text
                style={[
                  styles.dateChipText,
                  dateOption === 'today' && styles.dateChipTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dateChip,
                dateOption === 'yesterday' && styles.dateChipActive,
              ]}
              onPress={() => setDateOption('yesterday')}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={dateOption === 'yesterday' ? '#FFFFFF' : THEME.colors.textSecondary}
              />
              <Text
                style={[
                  styles.dateChipText,
                  dateOption === 'yesterday' && styles.dateChipTextActive,
                ]}
              >
                Yesterday
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description / Note */}
        <View style={styles.sectionBlock}>
          <Text style={styles.fieldSectionLabel}>Note (Optional)</Text>
          <View style={styles.noteInputCard}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={THEME.colors.textMuted}
              style={{ marginTop: 2, marginRight: 8 }}
            />
            <TextInput
              style={styles.noteTextInput}
              placeholder="e.g. Lunch with team, monthly electric bill..."
              placeholderTextColor={THEME.colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        {/* Submit Primary CTA */}
        <TouchableOpacity
          style={[
            styles.submitCTA,
            { backgroundColor: isExpense ? THEME.colors.expense : THEME.colors.income },
            isLoading && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-sharp" size={20} color="#FFFFFF" />
              <Text style={styles.submitCTAText}>
                Record {isExpense ? 'Expense' : 'Income'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
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

  // Segment switcher
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    padding: 4,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 20,
    ...THEME.shadows.card,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    gap: 8,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },

  // Amount Display Card
  amountDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 24,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
    ...THEME.shadows.card,
  },
  amountCurrencyPrefix: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 44,
    fontWeight: '800',
    minWidth: 140,
    textAlign: 'center',
  },

  // Quick Amount Shortcuts
  quickShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  shortcutChip: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  clearChip: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Block
  sectionBlock: {
    marginBottom: 22,
  },
  fieldSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: '31%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catCardName: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },

  // Date Selector
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  dateChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  dateChipTextActive: {
    color: '#FFFFFF',
  },

  // Note Input Card
  noteInputCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  noteTextInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    minHeight: 50,
    textAlignVertical: 'top',
  },

  // Submit CTA
  submitCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: THEME.radius.lg,
    gap: 8,
    marginTop: 8,
    ...THEME.shadows.elevated,
  },
  submitCTAText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
