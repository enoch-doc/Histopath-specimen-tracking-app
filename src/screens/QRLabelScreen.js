// src/screens/QRLabelScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/theme';

export default function QRLabelScreen({ route, navigation }) {
  // Safely extract params with defaults
  const params = route?.params || {};
  const accessionNumber = params.accessionNumber || 'N/A';
  const patientName = params.patientName || 'Unknown';
  const patientId = params.patientId || 'N/A';
  const age = params.age || 'N/A';
  const sex = params.sex || 'N/A';
  const specimenType = params.specimenType || 'Unknown';
  const clinicalNotes = params.clinicalNotes || 'None';
  const referringDoctor = params.referringDoctor || 'Not specified';
  const priority = params.priority || 'Routine';
  const priorityColor = params.priorityColor || COLORS.primary;
  const registeredAt = params.registeredAt || new Date().toISOString();

  const handlePrintLabel = () => {
    Alert.alert('Print Label', 'QR label printing will be implemented with printer integration');
  };

  const handleSaveImage = () => {
    Alert.alert('Save QR Code', 'QR code image download will be implemented next');
  };

  const handleRegisterAnother = () => {
    navigation.navigate('SpecimenRegistration');
  };

  const handleViewDetails = () => {
    Alert.alert('View Specimen', 'Navigate to specimen detail screen (coming next)');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✓ Specimen Registered</Text>
        <Text style={styles.headerSubtitle}>Accession number generated successfully</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* QR Code Display */}
        <View style={styles.qrContainer}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrIcon}>📱</Text>
            <Text style={styles.qrText}>QR Code</Text>
            <Text style={styles.qrSubtext}>Generation coming next</Text>
          </View>
          
          <View style={styles.accessionContainer}>
            <Text style={styles.accessionLabel}>Accession Number</Text>
            <Text style={styles.accessionNumber}>{accessionNumber}</Text>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>{priority}</Text>
          </View>
        </View>

        {/* Specimen Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Specimen Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Patient:</Text>
            <Text style={styles.detailValue}>{patientName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Patient ID:</Text>
            <Text style={styles.detailValue}>{patientId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age/Sex:</Text>
            <Text style={styles.detailValue}>{age} / {sex}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Specimen Type:</Text>
            <Text style={styles.detailValue}>{specimenType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referring Doctor:</Text>
            <Text style={styles.detailValue}>{referringDoctor}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Clinical Notes:</Text>
            <Text style={styles.detailValue}>{clinicalNotes}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Registered:</Text>
            <Text style={styles.detailValue}>
              {new Date(registeredAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePrintLabel}>
            <Text style={styles.buttonIcon}>🖨️</Text>
            <Text style={styles.primaryButtonText}>Print QR Label</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveImage}>
            <Text style={styles.buttonIcon}>💾</Text>
            <Text style={styles.secondaryButtonText}>Save QR Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleRegisterAnother}>
            <Text style={styles.buttonIcon}>➕</Text>
            <Text style={styles.secondaryButtonText}>Register Another</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={handleViewDetails}>
            <Text style={styles.outlineButtonText}>View Specimen Details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('DashboardMain')}
          >
            <Text style={styles.backButtonText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    backgroundColor: COLORS.success,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  qrContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderStyle: 'dashed',
  },
  qrIcon: {
    fontSize: 60,
  },
  qrText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  qrSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  accessionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  accessionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  accessionNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  priorityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});