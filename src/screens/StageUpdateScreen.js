// src/screens/StageUpdateScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const ALL_STAGES = [
  { key: 'reception', label: 'Reception/Registration', requiresPhoto: false },
  { key: 'grossing', label: 'Grossing/Tissue Selection', requiresPhoto: true },
  { key: 'processing', label: 'Tissue Processing', requiresPhoto: false },
  { key: 'embedding', label: 'Embedding', requiresPhoto: false },
  { key: 'sectioning', label: 'Sectioning/Microtomy', requiresPhoto: false },
  { key: 'staining', label: 'Staining', requiresPhoto: false },
  { key: 'slide_labeling', label: 'Slide Labeling', requiresPhoto: true },
  { key: 'slide_dispatch', label: 'Slide Dispatch to Pathologist', requiresPhoto: false },
  { key: 'reporting', label: 'Reporting', requiresPhoto: false },
  { key: 'verification', label: 'Typing/Verification', requiresPhoto: false },
  { key: 'report_dispatch', label: 'Report Dispatch/Collection', requiresPhoto: false },
];

// Role-based stage permissions
const STAGE_PERMISSIONS = {
  reception: ['receptionist', 'admin'],
  grossing: ['lab_technician', 'lab_scientist', 'admin'],
  processing: ['lab_technician', 'lab_scientist', 'admin'],
  embedding: ['lab_technician', 'lab_scientist', 'admin'],
  sectioning: ['lab_technician', 'lab_scientist', 'admin'],
  staining: ['lab_technician', 'lab_scientist', 'admin'],
  slide_labeling: ['lab_technician', 'lab_scientist', 'admin'],
  slide_dispatch: ['lab_technician', 'lab_scientist', 'secretary', 'admin'],
  reporting: ['pathologist', 'admin'],
  verification: ['secretary', 'pathologist', 'admin'],
  report_dispatch: ['secretary', 'receptionist', 'admin'],
};

export default function StageUpdateScreen({ route, navigation }) {
  const { specimenId } = route.params || {};
  const { user } = useAuthStore();
  const [specimen, setSpecimen] = useState(null);
  const [notes, setNotes] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpecimen();
  }, [specimenId]);

  const fetchSpecimen = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/specimens/${specimenId}`);
      setSpecimen(response.data.specimen);
    } catch (error) {
      Alert.alert('Error', 'Failed to load specimen');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStageIndex = () => {
    if (!specimen) return 0;
    return ALL_STAGES.findIndex(s => s.key === specimen.current_stage);
  };

  const currentStageIndex = getCurrentStageIndex();
  const currentStageData = ALL_STAGES[currentStageIndex];
  const nextStageData = ALL_STAGES[currentStageIndex + 1];

  const getPriorityColor = (priority) => {
    if (priority === 'stat') return COLORS.danger;
    if (priority === 'urgent') return COLORS.warning;
    return COLORS.primary;
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Photo Capture',
      'Camera feature will be implemented with full deployment',
      [
        {
          text: 'Simulate Photo Taken',
          onPress: () => {
            setPhotoTaken(true);
            Alert.alert('Success', 'Photo captured successfully!');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleUpdateStage = async () => {
    // Check if specimen is already complete
    if (!nextStageData) {
      Alert.alert('Complete', 'This specimen has completed all stages!');
      return;
    }

    // Check role permissions
    const userRole = user?.role;
    const allowedRoles = STAGE_PERMISSIONS[nextStageData.key] || [];
    const hasPermission = allowedRoles.includes(userRole);

    if (!hasPermission) {
      Alert.alert(
        '🚫 Access Denied',
        `You don't have permission to perform the ${nextStageData.label} stage.\n\n` +
        `Your Role: ${userRole?.toUpperCase().replace('_', ' ')}\n` +
        `Required: ${allowedRoles.map(r => r.toUpperCase().replace('_', ' ')).join(', ')}\n\n` +
        `Please ask the appropriate staff member to complete this stage.`,
        [
          { text: 'Go Back', onPress: () => navigation.goBack() }
        ]
      );
      return;
    }

    // Check photo requirement
    if (nextStageData.requiresPhoto && !photoTaken) {
      Alert.alert(
        'Photo Required',
        `A photo is COMPULSORY for the ${nextStageData.label} stage. Please take a photo before proceeding.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Notes COMPULSORY for reporting
    if (!notes.trim() && nextStageData.key === 'reporting') {
      Alert.alert(
        'Notes Required',
        'Clinical notes are COMPULSORY for the Reporting stage. Please document your findings before proceeding.',
        [{ text: 'Add Notes', style: 'cancel' }]
      );
      return;
    }

    // Notes RECOMMENDED for grossing
    if (!notes.trim() && nextStageData.key === 'grossing') {
      Alert.alert(
        'Notes Recommended',
        'Notes are recommended for Grossing stage. Continue anyway?',
        [
          { text: 'Add Notes', style: 'cancel' },
          { text: 'Continue', onPress: () => processUpdate() }
        ]
      );
      return;
    }

    processUpdate();
  };

  const processUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/specimens/${specimenId}/stage`, {
        newStage: nextStageData.key,
        notes: notes || null,
      });

      setIsUpdating(false);

      Alert.alert(
        '✅ Stage Updated!',
        `Specimen moved to ${nextStageData.label}`,
        [
          {
            text: 'View Details',
            onPress: () => {
              navigation.goBack();
            },
          },
          {
            text: 'Update Another',
            onPress: () => {
              setNotes('');
              setPhotoTaken(false);
              fetchSpecimen();
            }
          }
        ]
      );

    } catch (error) {
      setIsUpdating(false);
      
      // Handle role permission error
      if (error.response?.status === 403) {
        const { message, requiredRoles, yourRole } = error.response.data;
        Alert.alert(
          '🚫 Access Denied',
          `You don't have permission to perform this stage.\n\n` +
          `Your Role: ${yourRole?.toUpperCase().replace('_', ' ')}\n` +
          `Required: ${requiredRoles?.map(r => r.toUpperCase().replace('_', ' ')).join(', ')}\n\n` +
          `Please ask the appropriate staff member to complete this stage.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update stage');
      }
    }
  };

  const handleMarkComplete = async () => {
    Alert.alert(
      'Mark as Complete',
      `Mark specimen ${specimen?.accession_number} as fully completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Complete',
          onPress: async () => {
            try {
              await api.put(`/specimens/${specimenId}/stage`, {
                newStage: 'report_dispatch',
                notes: 'Specimen completed',
              });
              Alert.alert('Success', 'Specimen marked as complete!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to mark complete');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading specimen...</Text>
      </View>
    );
  }

  if (!specimen) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle" size={60} color={COLORS.danger} />
        <Text style={styles.loadingText}>Specimen not found</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check if user has permission for next stage
  const userRole = user?.role;
  const allowedRoles = nextStageData ? STAGE_PERMISSIONS[nextStageData.key] || [] : [];
  const hasPermission = nextStageData ? allowedRoles.includes(userRole) : false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Update Stage</Text>
          <Text style={styles.headerSubtitle}>{specimen.accession_number}</Text>
        </View>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(specimen.priority) }
        ]}>
          <Text style={styles.priorityText}>{specimen.priority?.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="navigate" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Current Progress</Text>
          </View>

          <View style={styles.stageProgress}>
            <View style={styles.stageItem}>
              <View style={[styles.stageDot, { backgroundColor: COLORS.success }]}>
                <Ionicons name="checkmark" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.stageItemLabel}>Current Stage</Text>
              <Text style={styles.stageItemName}>{currentStageData?.label}</Text>
            </View>

            <View style={styles.progressArrow}>
              <Ionicons name="arrow-forward" size={32} color={COLORS.primary} />
            </View>

            <View style={styles.stageItem}>
              <View style={[styles.stageDot, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="flag" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.stageItemLabel}>Next Stage</Text>
              <Text style={[styles.stageItemName, { color: COLORS.primary }]}>
                {nextStageData ? nextStageData.label : 'Final Stage ✅'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View style={[
                styles.progressBarFill,
                { width: `${((currentStageIndex + 1) / ALL_STAGES.length) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>
              Stage {currentStageIndex + 1} of {ALL_STAGES.length}
            </Text>
          </View>
        </View>

        {/* Permission Warning */}
        {nextStageData && !hasPermission && (
          <View style={[styles.card, styles.permissionCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="lock-closed" size={24} color={COLORS.danger} />
              <Text style={[styles.cardTitle, { color: COLORS.danger }]}>Access Restricted</Text>
            </View>
            <Text style={styles.permissionText}>
              You don't have permission to perform the {nextStageData.label} stage.
            </Text>
            <Text style={styles.permissionRole}>
              Your Role: <Text style={styles.bold}>{userRole?.toUpperCase().replace('_', ' ')}</Text>
            </Text>
            <Text style={styles.permissionRole}>
              Required: <Text style={styles.bold}>{allowedRoles.map(r => r.toUpperCase().replace('_', ' ')).join(', ')}</Text>
            </Text>
          </View>
        )}

        {/* Photo Requirement */}
        {nextStageData?.requiresPhoto && hasPermission && (
          <View style={[styles.card, styles.photoCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="camera" size={24} color={COLORS.warning} />
              <Text style={styles.cardTitle}>Photo Required</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>COMPULSORY</Text>
              </View>
            </View>

            <Text style={styles.photoDescription}>
              A photo is required for the {nextStageData.label} stage.
            </Text>

            {!photoTaken ? (
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={24} color={COLORS.white} />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoTakenContainer}>
                <Ionicons name="checkmark-circle" size={40} color={COLORS.success} />
                <View style={styles.photoTakenInfo}>
                  <Text style={styles.photoTakenText}>Photo Captured</Text>
                  <Text style={styles.photoTakenSubtext}>Ready to proceed</Text>
                </View>
                <TouchableOpacity onPress={handleTakePhoto}>
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Notes */}
        {hasPermission && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="create" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Observations & Notes</Text>
              {nextStageData?.key === 'reporting' && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredText}>REQUIRED</Text>
                </View>
              )}
            </View>

            <Text style={styles.notesHint}>
              {nextStageData?.key === 'reporting' 
                ? 'Clinical notes are COMPULSORY for reporting stage' 
                : 'Document any important observations or findings'}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder={nextStageData?.key === 'reporting' ? 'Enter clinical findings (required)...' : 'Enter notes (optional for most stages)...'}
              placeholderTextColor={COLORS.gray400}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />

            <Text style={styles.notesCounter}>{notes.length} characters</Text>
          </View>
        )}

        {/* Quick Templates */}
        {hasPermission && (
          <View style={styles.card}>
            <Text style={styles.quickNotesTitle}>Quick Templates:</Text>
            <View style={styles.templatesContainer}>
              <TouchableOpacity
                style={styles.templateChip}
                onPress={() => setNotes('Specimen in good condition. No abnormalities noted.')}
              >
                <Text style={styles.templateText}>✓ Good Condition</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templateChip}
                onPress={() => setNotes('Tissue measuring approximately ')}
              >
                <Text style={styles.templateText}>📏 Add Measurement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templateChip}
                onPress={() => setNotes('Processed without complications. Ready for next stage.')}
              >
                <Text style={styles.templateText}>✅ Processed OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {nextStageData && hasPermission ? (
            <TouchableOpacity
              style={[
                styles.updateButton,
                isUpdating && styles.updateButtonDisabled
              ]}
              onPress={handleUpdateStage}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="arrow-up-circle" size={24} color={COLORS.white} />
                  <View>
                    <Text style={styles.updateButtonText}>
                      Move to {nextStageData.label}
                    </Text>
                    {nextStageData.requiresPhoto && !photoTaken && (
                      <Text style={styles.updateButtonSubtext}>
                        ⚠️ Photo required before updating
                      </Text>
                    )}
                  </View>
                </>
              )}
            </TouchableOpacity>
          ) : nextStageData && !hasPermission ? (
            <TouchableOpacity
              style={styles.disabledButton}
              disabled={true}
            >
              <Ionicons name="lock-closed" size={24} color={COLORS.white} />
              <Text style={styles.disabledButtonText}>No Permission for This Stage</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleMarkComplete}
            >
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 11,
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
    ...SHADOWS.small,
  },
  photoCard: {
    borderWidth: 2,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warning + '05',
  },
  permissionCard: {
    borderWidth: 2,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '05',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requiredText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
  },
  permissionRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  stageProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stageItem: {
    flex: 1,
    alignItems: 'center',
  },
  stageDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageItemLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stageItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  progressArrow: {
    paddingHorizontal: 8,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  photoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  photoButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoTakenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    gap: 12,
  },
  photoTakenInfo: {
    flex: 1,
  },
  photoTakenText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  photoTakenSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  retakeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  notesHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    minHeight: 120,
    backgroundColor: COLORS.white,
  },
  notesCounter: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  quickNotesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  templatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateChip: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  templateText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  updateButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButtonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  disabledButton: {
    backgroundColor: COLORS.gray400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  disabledButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.gray400,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});