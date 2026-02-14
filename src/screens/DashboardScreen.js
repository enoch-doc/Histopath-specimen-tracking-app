// src/screens/DashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import useAuthStore from '../store/authStore';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user } = useAuthStore();

  // Role-based stats
  const getRoleStats = () => {
    switch(user?.role) {
      case 'receptionist':
        return [
          { label: 'Registered Today', value: '12', icon: 'add-circle', color: COLORS.primary },
          { label: 'Pending Reception', value: '5', icon: 'time', color: COLORS.warning },
          { label: 'STAT Cases', value: '2', icon: 'alert-circle', color: COLORS.danger },
          { label: 'This Week', value: '87', icon: 'calendar', color: COLORS.success },
        ];
      case 'pathologist':
        return [
          { label: 'Awaiting Report', value: '8', icon: 'document-text', color: COLORS.primary },
          { label: 'STAT Priority', value: '3', icon: 'alert-circle', color: COLORS.danger },
          { label: 'Completed Today', value: '5', icon: 'checkmark-circle', color: COLORS.success },
          { label: 'This Week', value: '42', icon: 'calendar', color: COLORS.info },
        ];
      case 'lab_technician':
      case 'lab_scientist':
        return [
          { label: 'In Processing', value: '15', icon: 'flask', color: COLORS.primary },
          { label: 'Awaiting Staining', value: '7', icon: 'color-palette', color: COLORS.warning },
          { label: 'Ready for Slides', value: '4', icon: 'apps', color: COLORS.info },
          { label: 'Completed', value: '23', icon: 'checkmark-circle', color: COLORS.success },
        ];
      default:
        return [
          { label: 'Total Today', value: '12', icon: 'stats-chart', color: COLORS.primary },
          { label: 'Pending', value: '5', icon: 'time', color: COLORS.warning },
          { label: 'In Progress', value: '4', icon: 'sync', color: COLORS.info },
          { label: 'Completed', value: '3', icon: 'checkmark-circle', color: COLORS.success },
        ];
    }
  };

  // Role-based quick actions
  const getRoleActions = () => {
    switch(user?.role) {
      case 'receptionist':
        return [
          { title: 'Register Specimen', icon: 'add-circle', color: COLORS.primary, screen: 'SpecimenRegistration' },
          { title: 'Scan QR Code', icon: 'qr-code', color: COLORS.success, screen: 'Scanner' },
          { title: 'View Queue', icon: 'list', color: COLORS.info, screen: 'SpecimenList' },
          { title: 'Print Labels', icon: 'print', color: COLORS.warning, screen: 'Dashboard' },
        ];
      case 'pathologist':
        return [
          { title: 'Pending Reports', icon: 'document-text', color: COLORS.primary, screen: 'SpecimenList' },
          { title: 'View Slides', icon: 'eye', color: COLORS.success, screen: 'SpecimenList' },
          { title: 'STAT Cases', icon: 'alert-circle', color: COLORS.danger, screen: 'SpecimenList' },
          { title: 'Analytics', icon: 'bar-chart', color: COLORS.info, screen: 'Dashboard' },
        ];
      case 'lab_technician':
      case 'lab_scientist':
        return [
          { title: 'Process Specimens', icon: 'flask', color: COLORS.primary, screen: 'SpecimenList' },
          { title: 'Scan QR', icon: 'qr-code', color: COLORS.success, screen: 'Scanner' },
          { title: 'Update Stage', icon: 'arrow-up-circle', color: COLORS.info, screen: 'SpecimenList' },
          { title: 'View Queue', icon: 'list', color: COLORS.warning, screen: 'SpecimenList' },
        ];
      default:
        return [
          { title: 'Register Specimen', icon: 'add-circle', color: COLORS.primary, screen: 'SpecimenRegistration' },
          { title: 'Scan QR Code', icon: 'qr-code', color: COLORS.success, screen: 'Scanner' },
          { title: 'View All', icon: 'list', color: COLORS.info, screen: 'SpecimenList' },
          { title: 'Analytics', icon: 'bar-chart', color: COLORS.warning, screen: 'Dashboard' },
        ];
    }
  };

  const stats = getRoleStats();
  const quickActions = getRoleActions();

  // Simple chart data (mock)
  const chartData = [
    { day: 'Mon', value: 12 },
    { day: 'Tue', value: 19 },
    { day: 'Wed', value: 15 },
    { day: 'Thu', value: 22 },
    { day: 'Fri', value: 18 },
    { day: 'Sat', value: 8 },
    { day: 'Sun', value: 6 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day,</Text>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          <Text style={styles.userRole}>
            {user?.role?.replace('_', ' ').toUpperCase() || 'USER'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color={COLORS.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Ionicons name={stat.icon} size={32} color={stat.color} />
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
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={32} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Chart */}
        <Text style={styles.sectionTitle}>This Week's Activity</Text>
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: item.day === 'Thu' ? COLORS.primary : COLORS.gray300
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barValue}>{item.value}</Text>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={[styles.activityIconContainer, { backgroundColor: COLORS.info + '15' }]}>
            <Ionicons name="arrow-forward-circle" size={20} color={COLORS.info} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Specimen #S26-00123 moved to Grossing</Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityCard}>
          <View style={[styles.activityIconContainer, { backgroundColor: COLORS.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Specimen #S26-00122 completed</Text>
            <Text style={styles.activityTime}>15 minutes ago</Text>
          </View>
        </View>
        <View style={styles.activityCard}>
          <View style={[styles.activityIconContainer, { backgroundColor: COLORS.danger + '15' }]}>
            <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>URGENT: Specimen #S26-00121 registered</Text>
            <Text style={styles.activityTime}>1 hour ago</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
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
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
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
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
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
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.lg,
    ...SHADOWS.small,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 8,
  },
  barValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});