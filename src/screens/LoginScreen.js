// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import useAuthStore from '../store/authStore';
import { Image } from 'react-native';
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter both email and password');
      return;
    }

    const result = await login(email.trim().toLowerCase(), password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#2563EB', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Header Section */}
          <View style={styles.headerSection}>
            {/* TODO: Replace with actual LAUTECH logo */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🏥</Text>
            </View>
            
            <Text style={styles.appTitle}>HistoPath Tracker</Text>
            <View style={styles.divider} />
            <Text style={styles.hospitalName}>
              Ladoke Akintola University of Technology
            </Text>
            <Text style={styles.hospitalName}>Teaching Hospital, Ogbomoso</Text>
            <Text style={styles.departmentName}>Histopathology Department</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.instructionText}>
                Sign in to access specimen tracking
              </Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                emailFocused && styles.inputContainerFocused
              ]}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@lautech.edu.ng"
                  placeholderTextColor={COLORS.gray400}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputContainer,
                passwordFocused && styles.inputContainerFocused
              ]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.gray400}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => Alert.alert('Contact Admin', 'Please contact system administrator to reset your password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isLoading ? [COLORS.gray400, COLORS.gray500] : [COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={COLORS.white} size="small" />
                    <Text style={styles.signInButtonText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>Need access? </Text>
              <TouchableOpacity onPress={() => Alert.alert('Request Access', 'Please contact the IT Administrator or HOD to create an account for you.')}>
                <Text style={styles.helpLink}>Contact Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Streamlining Specimen Workflow & Tracking
            </Text>
            <Text style={styles.versionText}>Version 1.0.0 • 2026</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SIZES.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.sm,
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
    marginVertical: SIZES.sm,
  },
  hospitalName: {
    fontSize: SIZES.body,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  hospitalSubName: {
    fontSize: SIZES.bodySmall,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
  departmentName: {
    fontSize: SIZES.bodySmall,
    color: COLORS.white,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: SIZES.xs,
    fontStyle: 'italic',
  },
  loginCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.lg,
    ...SHADOWS.large,
  },
  cardHeader: {
    marginBottom: SIZES.lg,
  },
  welcomeText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  instructionText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  inputWrapper: {
    marginBottom: SIZES.md,
  },
  inputLabel: {
    fontSize: SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.inputHeight,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.gray50,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: SIZES.xs,
    marginBottom: SIZES.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: SIZES.bodySmall,
    fontWeight: '600',
  },
  signInButton: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.lg,
  },
  helpText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  helpLink: {
    fontSize: SIZES.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: SIZES.xl,
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  footerText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  versionText: {
    fontSize: SIZES.caption,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: SIZES.xs,
  },
});