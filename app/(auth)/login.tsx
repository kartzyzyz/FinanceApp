// ============================================
// Modern Login Screen (Fintech Luxury UI)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/authStore';
import { isValidEmail } from '@/src/utils/helpers';
import { THEME } from '@/src/utils/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInDemo, isLoading, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();

    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Check your credentials.');
    }
  };

  const handleDemoAccess = async () => {
    try {
      await signInDemo();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Icon & Welcome Header */}
        <View style={styles.brandSection}>
          <View style={styles.iconEmblem}>
            <Ionicons name="wallet-sharp" size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>BudgetApp</Text>
          <Text style={styles.brandSubtitle}>Personal Finance & Wealth Tracking</Text>
        </View>

        {/* Input Card Container */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formDesc}>Sign in to manage your budget and savings</Text>

          {/* Email Field */}
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={19} color={THEME.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Email address"
              placeholderTextColor={THEME.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={19} color={THEME.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor={THEME.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={19}
                color={THEME.colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Primary Sign In Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* One-Tap Senior Dev Guest Access Button */}
          <TouchableOpacity
            style={styles.demoAccessBtn}
            onPress={handleDemoAccess}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-sharp" size={17} color={THEME.colors.primary} />
            <Text style={styles.demoAccessBtnText}>Explore App (1-Tap Demo)</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconEmblem: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.elevated,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 14,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },

  // Form Card
  formCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  formDesc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 2,
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    paddingVertical: 14,
  },
  primaryBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    ...THEME.shadows.elevated,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginHorizontal: 10,
  },

  // Demo Button
  demoAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 8,
  },
  demoAccessBtnText: {
    color: THEME.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerPrompt: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
});
