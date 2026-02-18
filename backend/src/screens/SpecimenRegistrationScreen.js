// src/screens/SpecimenRegistrationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SPECIMEN_TYPES } from '../constants/theme';
import api from '../services/api';

export default function SpecimenRegistrationScreen({ navigation }) {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [specimenType, setSpecimenType] = useState('');
  const [otherSpecimenType, setOtherSpecimenType] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [referringDoctor, setReferringDoctor] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isStat, setIsStat] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [recentDoctors] = useState([]);
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    if (referringDoctor.length > 0) {
      const filtered = recentDoctors.filter(doctor =>
        doctor.toLowerCase().includes(referringDoctor.toLowerCase())
      );
      setFilteredDoctors(filtered);
      setShowDoctorSuggestions(filtered.length > 0);
    } else {
      setShowDoctorSuggestions(false);
    }
  }, [referringDoctor]);

  const validateForm = () => {
    if (!patientName.trim()) {
      Alert.alert('Patient Name Required', 'Please enter the patient\'s full name');
      return false;
    }
    if (!patientId.trim()) {
      Alert.alert('Patient ID Required', 'Please enter the patient\'s hospital number or ID');
      return false;
    }
    if (!specimenType) {
      Alert.alert('Specimen Type Required', 'Please select the type of specimen');
      return false;
    }
    if (specimenType === 'Other' && !otherSpecimenType.trim()) {
      Alert.alert('Specimen Type Required', 'Please specify the specimen type');
      return false;
    }
    if ((isStat || isUrgent) && !clinicalNotes.trim()) {
      Alert.alert(
        'Clinical Notes Recommended',
        'STAT/Urgent specimens should include clinical notes. Do you want to add notes?',
        [
          { text: 'Add Notes', style: 'cancel' },
          { text: 'Continue Anyway', onPress: () => processRegistration(), style: 'destructive' }
        ]
      );
      return false;
    }
    return true;
  };

  const processRegistration = async () => {
    setIsRegistering(true);
    try {
      const finalSpecimenType = specimenType === 'Other' ? otherSpecimenType : specimenType;

      let priorityValue = 'routine';
      if (isStat) priorityValue = 'stat';
      else if (isUrgent) priorityValue = 'urgent';

      const response = await api.post('/specimens', {
        patientName,
        patientId,
        age: age || null,
        sex: sex || null,
        specimenType: finalSpecimenType,
        clinicalNotes: clinicalNotes || null,
        referringDoctor: referringDoctor || null,
        priority: priorityValue,
      });

      const { accessionNumber } = response.data;

      let priorityLabel = 'Routine';
      let priorityColorValue = COLORS.primary;
      if (isStat) {
        priorityLabel = 'STAT (4hrs)';
        priorityColorValue = COLORS.danger;
      } else if (isUrgent) {
        priorityLabel = 'URGENT (24hrs)';
        priorityColorValue = COLORS.warning;
      }

      setIsRegistering(false);

      navigation.navigate('QRLabelScreen', {
        accessionNumber,
        patientName,
        patientId,
        age: age || 'N/A',
        sex: sex || 'N/A',
        specimenType: finalSpecimenType,
        clinicalNotes: clinicalNotes || 'None provided',
        referringDoctor: referringDoctor || 'Not specified',
        priority: priorityLabel,
        priorityColor: priorityColorValue,
        registeredAt: new Date().toISOString(),
      });

    } catch (error) {
      setIsRegistering(false);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register specimen. Check your connection.');
    }
  };

  const handleRegister = () => {
    if (validateForm()) {
      processRegistration();
    }
  };

  const clearForm = () => {
    setPatientName('');
    setPatientId('');
    setAge('');
    setSex('');
    setSpecimenType('');
    setOtherSpecimenType('');
    setClinicalNotes('');
    setReferringDoctor('');
    setIsUrgent(false);
    setIsStat(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>New Specimen</Text>
          <Text style={styles.headerSubtitle}>Complete all required fields</Text>
        </View>
        <TouchableOpacity onPress={clearForm} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${(patientName && patientId && specimenType ? 100 :
                (patientName && patientId ? 66 :
                (patientName ? 33 : 0)))}%`
            }]} />
          </View>
          <Text style={styles.progressText}>
            {patientName && patientId && specimenType ? 'Ready to register' : 'Fill required fields'}
          </Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Patient Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={COLORS.gray400}
              value={patientName}
              onChangeText={setPatientName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient ID / Hospital Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., LAU123456"
              placeholderTextColor={COLORS.gray400}
              value={patientId}
              onChangeText={setPatientId}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Years"
                placeholderTextColor={COLORS.gray400}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                maxLength={3}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Sex</Text>
              <View style={styles.sexButtons}>
                <TouchableOpacity
                  style={[styles.sexButton, sex === 'M' && styles.sexButtonActive]}
                  onPress={() => setSex('M')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sexButtonText, sex === 'M' && styles.sexButtonTextActive]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sexButton, sex === 'F' && styles.sexButtonActive]}
                  onPress={() => setSex('F')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sexButtonText, sex === 'F' && styles.sexButtonTextActive]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Specimen Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔬 Specimen Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specimen Type *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
              contentContainerStyle={styles.typeScrollContent}
            >
              {SPECIMEN_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, specimenType === type && styles.typeButtonActive]}
                  onPress={() => {
                    setSpecimenType(type);
                    if (type !== 'Other') setOtherSpecimenType('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.typeButtonText, specimenType === type && styles.typeButtonTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {specimenType === 'Other' && (
            <View style={[styles.inputGroup, styles.customTypeContainer]}>
              <Text style={styles.label}>Specify Specimen Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter custom specimen type"
                placeholderTextColor={COLORS.gray400}
                value={otherSpecimenType}
                onChangeText={setOtherSpecimenType}
                autoFocus={true}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clinical Notes</Text>
            <Text style={styles.labelHint}>History, indication, provisional diagnosis</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter clinical notes..."
              placeholderTextColor={COLORS.gray400}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={clinicalNotes}
              onChangeText={setClinicalNotes}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Referring Doctor</Text>
            <TextInput
              style={styles.input}
              placeholder="Doctor's name"
              placeholderTextColor={COLORS.gray400}
              value={referringDoctor}
              onChangeText={setReferringDoctor}
              onFocus={() => setShowDoctorSuggestions(recentDoctors.length > 0)}
            />
            {showDoctorSuggestions && filteredDoctors.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {filteredDoctors.map((doctor, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setReferringDoctor(doctor);
                      setShowDoctorSuggestions(false);
                    }}
                  >
                    <Text style={styles.suggestionText}>{doctor}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Priority Level</Text>
          </View>

          <View style={styles.priorityContainer}>
            {/* Routine */}
            <TouchableOpacity
              style={[styles.priorityCard, !isUrgent && !isStat && styles.priorityCardRoutine]}
              onPress={() => { setIsUrgent(false); setIsStat(false); }}
              activeOpacity={0.7}
            >
              <View style={styles.priorityHeader}>
                <View>
                  <Text style={styles.priorityLabel}>ROUTINE</Text>
                  <Text style={styles.priorityTime}>Standard turnaround (3-5 days)</Text>
                </View>
                {!isUrgent && !isStat && (
                  <View style={[styles.checkbox, styles.checkboxActive]}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.priorityDescription}>Standard processing with normal turnaround time</Text>
            </TouchableOpacity>

            {/* Urgent */}
            <TouchableOpacity
              style={[styles.priorityCard, isUrgent && !isStat && styles.priorityCardActive]}
              onPress={() => { setIsUrgent(!isUrgent); if (!isUrgent) setIsStat(false); }}
              activeOpacity={0.7}
            >
              <View style={styles.priorityHeader}>
                <View>
                  <Text style={[styles.priorityLabel, isUrgent && !isStat && styles.priorityLabelActive]}>URGENT</Text>
                  <Text style={styles.priorityTime}>24-hour turnaround</Text>
                </View>
                <View style={[styles.checkbox, isUrgent && !isStat && styles.checkboxActive]}>
                  {isUrgent && !isStat && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <Text style={styles.priorityDescription}>Requires expedited processing and faster turnaround time</Text>
            </TouchableOpacity>

            {/* STAT */}
            <TouchableOpacity
              style={[styles.priorityCard, isStat && styles.priorityCardStatActive]}
              onPress={() => { setIsStat(!isStat); if (!isStat) setIsUrgent(false); }}
              activeOpacity={0.7}
            >
              <View style={styles.priorityHeader}>
                <View>
                  <Text style={[styles.priorityLabel, isStat && styles.priorityLabelStatActive]}>STAT</Text>
                  <Text style={styles.priorityTime}>4-hour turnaround</Text>
                </View>
                <View style={[styles.checkbox, isStat && styles.checkboxStatActive]}>
                  {isStat && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <Text style={styles.priorityDescription}>Critical specimen requiring immediate processing and reporting</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            (!patientName || !patientId || !specimenType) && styles.registerButtonDisabled
          ]}
          onPress={handleRegister}
          disabled={!patientName || !patientId || !specimenType || isRegistering}
          activeOpacity={0.8}
        >
          {isRegistering ? (
            <View style={styles.registeringContainer}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text style={styles.registerButtonText}>Registering...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.registerButtonText}>Register Specimen</Text>
              <Text style={styles.registerButtonSubtext}>Generate accession number & QR label</Text>
            </>
          )}
        </TouchableOpacity>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    opacity: 0.8,
    marginTop: 2,
  },
  clearButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  clearText: {
    color: COLORS.white,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  labelHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: -4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  sexButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sexButton: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  sexButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sexButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  sexButtonTextActive: {
    color: COLORS.white,
  },
  typeScroll: {
    marginVertical: 8,
  },
  typeScrollContent: {
    paddingRight: 16,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 24,
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  customTypeContainer: {
    backgroundColor: COLORS.primary + '10',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  priorityContainer: {
    gap: 12,
  },
  priorityCard: {
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  priorityCardRoutine: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  priorityCardActive: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warning + '10',
  },
  priorityCardStatActive: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '10',
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  priorityLabelActive: {
    color: COLORS.warning,
  },
  priorityLabelStatActive: {
    color: COLORS.danger,
  },
  priorityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priorityDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.gray400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxStatActive: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.gray400,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButtonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  registeringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});