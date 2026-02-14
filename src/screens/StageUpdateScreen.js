// src/screens/StageUpdateScreen.js
import React, { useState } from 'react';
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
import { COLORS, SIZES } from '../constants/theme';

export default function StageUpdateScreen({ route, navigation }) {
  const { specimenId } = route.params || {};

  // Mock current specimen data
  const specimen = {
    accessionNumber: 'S26-00123',
    patientName: 'John Doe',
    currentStage: 'Grossing',
    currentStageIndex: 1, // 0-based index
    priority: 'STAT',
    priorityColor: COLORS.danger,
  };

  // All 11 stages
  const allStages = [
    { name: 'Reception/Registration', requiresPhoto: false, index: 0 },
    { name: 'Grossing/Tissue Selection', requiresPhoto: true, index: 1 },
    { name: 'Tissue Processing', requiresPhoto: false, index: 2 },
    { name: 'Embedding', requiresPhoto: false, index: 3 },
    { name: 'Sectioning/Microtomy', requiresPhoto: false, index: 4 },
    { name: 'Staining', requiresPhoto: false, index: 5 },
    { name: 'Slide Labeling', requiresPhoto: true, index: 6 },
    { name: 'Slide Dispatch to Pathologist', requiresPhoto: false, index: 7 },
    { name: 'Reporting', requiresPhoto: false, index: 8 },
    { name: 'Typing/Verification', requiresPhoto: false, index: 9 },
    { name: 'Report Dispatch/Collection', requiresPhoto: false, index: 10 },
  ];

  const currentStageData = allStages[specimen.currentStageIndex];
  const nextStageData = allStages[specimen.currentStageIndex + 1];

  const [notes, setNotes] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTakePhoto = () => {
    // Simulate photo capture (will implement real camera later)
    Alert.alert('Photo Capture', 'Camera feature will be implemented next', [
      {
        text: 'Simulate Photo Taken',
        onPress: () => {
          setPhotoTaken(true);
          Alert.alert('Success', 'Photo captured successfully!');
        }
      },
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ]);
  };

  const handleUpdateStage = async () => {
    // Validate photo requirement
    if (nextStageData && nextStageData.requiresPhoto && !photoTaken) {
      Alert.alert(
        'Photo Required',
        `A photo is compulsory for the ${nextStageData.name} stage. Please take a photo before proceeding.`
      );
      return;
    }

    // Validate notes for certain stages
    if (!notes.trim() && nextStageData && (nextStageData.index === 1 || nextStageData.index === 8)) {
      Alert.alert(
        'Notes Recommended',
        `It's recommended to add notes for ${nextStageData.name}. Continue anyway?`,
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsUpdating(false);

    Alert.alert(
      'Stage Updated!',
      `Specimen ${specimen.accessionNumber} has been moved to ${nextStageData.name}`,
      [
        {
          text: 'View Details',
          onPress: () => {
            navigation.goBack();
            navigation.goBack(); // Go back to detail screen
          }
        },
        {
          text: 'Update Another',
          onPress: () => {
            setNotes('');
            setPhotoTaken(false);
          }
        }
      ]
    );
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      `Mark ${specimen.accessionNumber} as fully completed and ready for dispatch?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Mark Complete',
          onPress: () => {
            Alert.alert('Success', 'Specimen marked as complete!');
            navigation.goBack();
          }
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Update Stage</Text>
          <Text style={styles.headerSubtitle}>{specimen.accessionNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.priorityBadge, { backgroundColor: specimen.priorityColor }]}>
            <Text style={styles.priorityText}>{specimen.priority}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Stage Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}></Text>
            <Text style={styles.cardTitle}>Current Progress</Text>
          </View>

          <View style={styles.stageProgress}>
            <View style={styles.stageItem}>
              <View style={[styles.stageDot, { backgroundColor: COLORS.success }]}>
                <Text style={styles.stageDotText}>✓</Text>
              </View>
              <Text style={styles.stageLabel}>Current Stage:</Text>
              <Text style={styles.stageName}>{currentStageData.name}</Text>
            </View>

            <View style={styles.progressArrow}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>

            <View style={styles.stageItem}>
              <View style={[styles.stageDot, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.stageDotText}>•</Text>
              </View>
              <Text style={styles.stageLabel}>Next Stage:</Text>
              <Text style={[styles.stageName, styles.nextStageName]}>
                {nextStageData ? nextStageData.name : 'Final Stage'}
              </Text>
            </View>
          </View>
        </View>

        {/* Photo Requirement */}
        {nextStageData && nextStageData.requiresPhoto && (
          <View style={[styles.card, styles.photoCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📷</Text>
              <Text style={styles.cardTitle}>Photo Required</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>COMPULSORY</Text>
              </View>
            </View>

            <Text style={styles.photoDescription}>
              A photo is required for the {nextStageData.name} stage to document the specimen condition.
            </Text>

            {!photoTaken ? (
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <Text style={styles.photoButtonIcon}>📸</Text>
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoTakenContainer}>
                <View style={styles.photoTakenIcon}>
                  <Text style={styles.photoTakenEmoji}>✅</Text>
                </View>
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

        {/* Notes Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardTitle}>Observations & Notes</Text>
          </View>

          <Text style={styles.notesHint}>
            Document any important observations, measurements, or findings
          </Text>

          <TextInput
            style={styles.notesInput}
            placeholder="Enter notes (optional for most stages)..."
            placeholderTextColor={COLORS.gray400}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />

          <Text style={styles.notesCounter}>
            {notes.length} characters
          </Text>
        </View>

        {/* Quick Notes Templates */}
        <View style={styles.card}>
          <Text style={styles.quickNotesTitle}>Quick Notes Templates:</Text>
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

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {nextStageData ? (
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUpdateStage}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.updateButtonText}>
                    Move to {nextStageData.name}
                  </Text>
                  <Text style={styles.updateButtonSubtext}>
                    {nextStageData.requiresPhoto && !photoTaken 
                      ? '⚠️ Photo required before updating' 
                      : 'Ready to proceed'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleMarkComplete}
            >
              <Text style={styles.completeButtonText}>✓ Mark as Complete</Text>
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
  photoCard: {
    borderWidth: 2,
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warning + '05',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
  stageProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageItem: {
    flex: 1,
    alignItems: 'center',
  },
  stageDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageDotText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  stageLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stageName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  nextStageName: {
    color: COLORS.primary,
  },
  progressArrow: {
    paddingHorizontal: 12,
  },
  arrowIcon: {
    fontSize: 32,
    color: COLORS.primary,
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
  },
  photoButtonIcon: {
    fontSize: 24,
    marginRight: 8,
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
  },
  photoTakenIcon: {
    marginRight: 12,
  },
  photoTakenEmoji: {
    fontSize: 32,
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
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButtonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  completeButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
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