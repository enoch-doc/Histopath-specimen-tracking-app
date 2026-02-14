// src/screens/SpecimenDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function SpecimenDetailScreen({ route, navigation }) {
  // Mock specimen data (will come from route params or API later)
  const specimen = {
    accessionNumber: 'S26-00123',
    patientName: 'John Doe',
    patientId: 'LAU123456',
    age: '45',
    sex: 'M',
    specimenType: 'Biopsy',
    clinicalNotes: 'Patient presents with persistent cough and chest pain. Suspected malignancy.',
    referringDoctor: 'Dr. Adebayo Ogunleye',
    priority: 'STAT',
    priorityColor: COLORS.danger,
    registeredAt: '2026-02-14 09:15 AM',
    currentStage: 'Grossing',
    
    // Timeline stages (11 stages)
    timeline: [
      {
        stage: 'Reception/Registration',
        status: 'completed',
        timestamp: '2026-02-14 09:15 AM',
        performedBy: 'Sarah Adeyemi (Receptionist)',
        notes: 'Specimen received in good condition',
        photo: false,
      },
      {
        stage: 'Grossing/Tissue Selection',
        status: 'in_progress',
        timestamp: '2026-02-14 10:30 AM',
        performedBy: 'John Okafor (Lab Tech)',
        notes: 'Tissue measuring 2.5 x 1.5 x 0.8 cm',
        photo: true,
      },
      {
        stage: 'Tissue Processing',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Embedding',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Sectioning/Microtomy',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Staining',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Slide Labeling',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Slide Dispatch to Pathologist',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Reporting',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Typing/Verification',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
      {
        stage: 'Report Dispatch/Collection',
        status: 'pending',
        timestamp: null,
        performedBy: null,
        notes: null,
        photo: false,
      },
    ],
  };

  const getStageIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'in_progress') return '🔄';
    return '⚪';
  };

  const getStageColor = (status) => {
    if (status === 'completed') return COLORS.success;
    if (status === 'in_progress') return COLORS.warning;
    return COLORS.gray400;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{specimen.accessionNumber}</Text>
          <Text style={styles.headerSubtitle}>Specimen Details</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.priorityBadge, { backgroundColor: specimen.priorityColor }]}>
            <Text style={styles.priorityText}>{specimen.priority}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>Patient Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient Name:</Text>
            <Text style={styles.infoValue}>{specimen.patientName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient ID:</Text>
            <Text style={styles.infoValue}>{specimen.patientId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age / Sex:</Text>
            <Text style={styles.infoValue}>
              {specimen.age} years / {specimen.sex === 'M' ? 'Male' : 'Female'}
            </Text>
          </View>
        </View>

        {/* Specimen Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔬</Text>
            <Text style={styles.cardTitle}>Specimen Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Specimen Type:</Text>
            <Text style={styles.infoValue}>{specimen.specimenType}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered:</Text>
            <Text style={styles.infoValue}>{specimen.registeredAt}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Stage:</Text>
            <Text style={[styles.infoValue, { color: specimen.priorityColor, fontWeight: 'bold' }]}>
              {specimen.currentStage}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Referring Doctor:</Text>
            <Text style={styles.infoValue}>{specimen.referringDoctor}</Text>
          </View>
          
          {specimen.clinicalNotes && (
            <View style={styles.notesContainer}>
              <Text style={styles.infoLabel}>Clinical Notes:</Text>
              <Text style={styles.notesValue}>{specimen.clinicalNotes}</Text>
            </View>
          )}
        </View>

        {/* Timeline Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Specimen Timeline</Text>
          </View>
          
          <View style={styles.timeline}>
            {specimen.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* Timeline Line */}
                {index < specimen.timeline.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    { backgroundColor: item.status === 'completed' ? COLORS.success : COLORS.gray300 }
                  ]} />
                )}
                
                {/* Timeline Dot */}
                <View style={[
                  styles.timelineDot,
                  { 
                    backgroundColor: getStageColor(item.status),
                    borderColor: getStageColor(item.status)
                  }
                ]}>
                  <Text style={styles.stageIcon}>{getStageIcon(item.status)}</Text>
                </View>
                
                {/* Timeline Content */}
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.stageName,
                    item.status === 'completed' && styles.stageNameCompleted,
                    item.status === 'in_progress' && styles.stageNameInProgress
                  ]}>
                    {item.stage}
                  </Text>
                  
                  {item.timestamp && (
                    <Text style={styles.stageTimestamp}>{item.timestamp}</Text>
                  )}
                  
                  {item.performedBy && (
                    <Text style={styles.stagePerformer}>👤 {item.performedBy}</Text>
                  )}
                  
                  {item.notes && (
                    <View style={styles.stageNotes}>
                      <Text style={styles.stageNotesText}>{item.notes}</Text>
                    </View>
                  )}
                  
                  {item.photo && (
                    <View style={styles.photoIndicator}>
                      <Text style={styles.photoIcon}>📷</Text>
                      <Text style={styles.photoText}>Photo attached</Text>
                    </View>
                  )}
                  
                  {item.status === 'pending' && (
                    <Text style={styles.pendingText}>Pending</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('StageUpdate', { specimenId: specimen.id })}
          >
            <Text style={styles.primaryButtonText}>Update to Next Stage</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Add Comment', 'Add comment feature coming soon')}
          >
            <Text style={styles.secondaryButtonText}>Add Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => Alert.alert('Print Label', 'Print QR label feature coming soon')}
          >
            <Text style={styles.outlineButtonText}>Print QR Label</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 130,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: 0,
    width: 2,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: COLORS.white,
  },
  stageIcon: {
    fontSize: 16,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  stageName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stageNameCompleted: {
    color: COLORS.textPrimary,
  },
  stageNameInProgress: {
    color: COLORS.warning,
    fontWeight: 'bold',
  },
  stageTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stagePerformer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stageNotes: {
    backgroundColor: COLORS.gray100,
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  stageNotesText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  photoIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  photoText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 12,
    color: COLORS.gray400,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});