// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import useAuthStore from '../store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.full_name}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
        
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.lg,
    marginTop: SIZES.lg,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});