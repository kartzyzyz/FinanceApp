// ============================================
// Modern Registration Screen
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
import { isValidEmail, isValidPassword } from '@/src/utils/helpers';
import { THEME } from '@/src/utils/theme';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, clearError } = useAuthStore();

  const handleRegister = async () => {
    clearError();

    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Required Fields', 'Please complete all form fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please provide a valid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Password Length', 'Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Confirmation password does not match.');
      return;
    }

    try {
      await signUp(email.trim(), password, displayName.trim());
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Something went wrong.');
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
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.iconEmblem}>
            <Ionicons name="person-add-sharp" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>Create Account</Text>
          <Text style={styles.brandSubtitle}>Take control of your financial destiny</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name */}
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={19} color={THEME.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Full name"
              placeholderTextColor={THEME.colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
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

          {/* Password */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={19} color={THEME.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Create password"
              placeholderTextColor={THEME.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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

          {/* Confirm Password */}
          <View style={styles.inputWrap}>
            <Ionicons name="shield-checkmark-outline" size={19} color={THEME.colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Confirm password"
              placeholderTextColor={THEME.colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign In</Text>
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
    marginBottom: 28,
  },
  iconEmblem: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.elevated,
  },
  brandTitle: {
    fontSize: 26,
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

  formCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
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
    marginTop: 8,
    ...THEME.shadows.elevated,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

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
