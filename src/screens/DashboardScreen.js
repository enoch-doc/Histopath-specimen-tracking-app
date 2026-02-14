// src/screens/DashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import useAuthStore from '../store/authStore';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Today', value: '12', color: COLORS.primary },
    { label: 'Pending', value: '5', color: COLORS.warning },
    { label: 'In Progress', value: '4', color: COLORS.info },
    { label: 'Completed', value: '3', color: COLORS.success },
  ];

  const quickActions = [
    { 
      title: 'Register Specimen', 
      icon: '➕', 
      color: COLORS.primary,
      screen: 'SpecimenList' // We'll create this later
    },
    { 
      title: 'Scan QR Code', 
      icon: '📷', 
      color: COLORS.success,
      screen: 'Scanner'
    },
    { 
      title: 'View All', 
      icon: '📋', 
      color: COLORS.info,
      screen: 'SpecimenList'
    },
    { 
      title: 'Analytics', 
      icon: '📊', 
      color: COLORS.warning,
      screen: 'Dashboard'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day,</Text>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          <Text style={styles.userRole}>
            {user?.role?.replace('_', ' ').toUpperCase() || 'USER'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.actionEmoji}>{action.icon}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>
            📋 Specimen #S26-00123 moved to Grossing
          </Text>
          <Text style={styles.activityTime}>2 minutes ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>
            ✅ Specimen #S26-00122 completed
          </Text>
          <Text style={styles.activityTime}>15 minutes ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>
            🔴 URGENT: Specimen #S26-00121 registered
          </Text>
          <Text style={styles.activityTime}>1 hour ago</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.sm,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
    marginTop: SIZES.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    marginBottom: SIZES.sm,
    ...SHADOWS.small,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.sm,
    ...SHADOWS.small,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});