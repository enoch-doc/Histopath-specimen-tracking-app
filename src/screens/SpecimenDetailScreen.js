// src/screens/SpecimenDetailScreen.js
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import api from '../services/api';

const ALL_STAGES = [
  'reception',
  'grossing',
  'processing',
  'embedding',
  'sectioning',
  'staining',
  'slide_labeling',
  'slide_dispatch',
  'reporting',
  'verification',
  'report_dispatch',
];

const STAGE_LABELS = {
  reception: 'Reception/Registration',
  grossing: 'Grossing/Tissue Selection',
  processing: 'Tissue Processing',
  embedding: 'Embedding',
  sectioning: 'Sectioning/Microtomy',
  staining: 'Staining',
  slide_labeling: 'Slide Labeling',
  slide_dispatch: 'Slide Dispatch to Pathologist',
  reporting: 'Reporting',
  verification: 'Typing/Verification',
  report_dispatch: 'Report Dispatch/Collection',
};

export default function SpecimenDetailScreen({ route, navigation }) {
  const { specimenId } = route.params || {};
  const [specimen, setSpecimen] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpecimenDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/specimens/${specimenId}`);
      setSpecimen(response.data.specimen);
      setTimeline(response.data.timeline);
    } catch (error) {
      Alert.alert('Error', 'Failed to load specimen details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecimenDetail();
  }, [specimenId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchSpecimenDetail();
    }, [specimenId])
  );

  const getPriorityColor = (priority) => {
    if (priority === 'stat') return COLORS.danger;
    if (priority === 'urgent') return COLORS.warning;
    return COLORS.primary;
  };

  const getStageStatus = (stage) => {
    if (!specimen) return 'pending';
    const currentIndex = ALL_STAGES.indexOf(specimen.current_stage);
    const stageIndex = ALL_STAGES.indexOf(stage);
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'in_progress';
    return 'pending';
  };

  const getStageIcon = (status) => {
    if (status === 'completed') return 'checkmark-circle';
    if (status === 'in_progress') return 'time';
    return 'ellipse-outline';
  };

  const getStageColor = (status) => {
    if (status === 'completed') return COLORS.success;
    if (status === 'in_progress') return COLORS.warning;
    return COLORS.gray300;
  };

  const getStageHistory = (stage) => {
    return timeline.find(t => t.stage === stage);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading specimen details...</Text>
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
          <Text style={styles.headerTitle}>{specimen.accession_number}</Text>
          <Text style={styles.headerSubtitle}>Specimen Details</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(specimen.priority) }]}>
          <Text style={styles.priorityText}>{specimen.priority?.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Patient Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient Name:</Text>
            <Text style={styles.infoValue}>{specimen.patient_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient ID:</Text>
            <Text style={styles.infoValue}>{specimen.patient_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age / Sex:</Text>
            <Text style={styles.infoValue}>
              {specimen.age ? `${specimen.age} years` : 'N/A'} / {specimen.sex || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Specimen Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flask" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Specimen Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Specimen Type:</Text>
            <Text style={styles.infoValue}>{specimen.specimen_type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered:</Text>
            <Text style={styles.infoValue}>
              {new Date(specimen.registered_at).toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Stage:</Text>
            <Text style={[styles.infoValue, {
              color: getPriorityColor(specimen.priority),
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }]}>
              {STAGE_LABELS[specimen.current_stage] || specimen.current_stage}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Referring Doctor:</Text>
            <Text style={styles.infoValue}>{specimen.referring_doctor || 'Not specified'}</Text>
          </View>
          {specimen.clinical_notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.infoLabel}>Clinical Notes:</Text>
              <Text style={styles.notesValue}>{specimen.clinical_notes}</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="git-branch" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Specimen Timeline</Text>
          </View>

          <View style={styles.timeline}>
            {ALL_STAGES.map((stage, index) => {
              const status = getStageStatus(stage);
              const history = getStageHistory(stage);

              return (
                <View key={stage} style={styles.timelineItem}>
                  {/* Line */}
                  {index < ALL_STAGES.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: status === 'completed' ? COLORS.success : COLORS.gray200 }
                    ]} />
                  )}

                  {/* Dot */}
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: getStageColor(status) }
                  ]}>
                    <Ionicons
                      name={getStageIcon(status)}
                      size={20}
                      color={COLORS.white}
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.stageName,
                      status === 'completed' && styles.stageNameCompleted,
                      status === 'in_progress' && styles.stageNameInProgress,
                    ]}>
                      {STAGE_LABELS[stage]}
                    </Text>

                    {history && (
                      <>
                        <Text style={styles.stageTimestamp}>
                          {new Date(history.timestamp).toLocaleString()}
                        </Text>
                        {history.performed_by_name && (
                          <Text style={styles.stagePerformer}>
                            👤 {history.performed_by_name}
                          </Text>
                        )}
                        {history.notes && (
                          <View style={styles.stageNotes}>
                            <Text style={styles.stageNotesText}>{history.notes}</Text>
                          </View>
                        )}
                      </>
                    )}

                    {status === 'pending' && (
                      <Text style={styles.pendingText}>Pending</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('StageUpdate', { specimenId: specimen.id })}
          >
            <Ionicons name="arrow-up-circle" size={20} color={COLORS.white} />
            <Text style={styles.primaryButtonText}>Update to Next Stage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Add Comment', 'Coming soon')}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.textPrimary} />
            <Text style={styles.secondaryButtonText}>Add Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => Alert.alert('Print Label', 'Coming soon')}
          >
            <Ionicons name="print-outline" size={20} color={COLORS.primary} />
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
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
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    gap: 8,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});