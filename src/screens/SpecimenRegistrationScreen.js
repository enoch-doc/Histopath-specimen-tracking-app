// src/screens/SpecimenRegistrationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { COLORS, SIZES, SPECIMEN_TYPES, PRIORITY } from '../constants/theme';

export default function SpecimenRegistrationScreen({ navigation }) {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [specimenType, setSpecimenType] = useState('');
  const [otherSpecimenType, setOtherSpecimenType] = useState(''); // For custom type
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [referringDoctor, setReferringDoctor] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isStat, setIsStat] = useState(false);

  const handleRegister = () => {
    // Get final specimen type (use custom if "Other" selected)
    const finalSpecimenType = specimenType === 'Other' ? otherSpecimenType : specimenType;

    // Validation
    if (!patientName || !patientId || !specimenType) {
      Alert.alert('Required Fields', 'Please fill in Patient Name, ID, and Specimen Type');
      return;
    }

    // If "Other" is selected but no custom type entered
    if (specimenType === 'Other' && !otherSpecimenType.trim()) {
      Alert.alert('Specimen Type Required', 'Please specify the specimen type');
      return;
    }

    // Generate accession number (mock for now)
    const accessionNumber = `S26-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    Alert.alert(
      'Specimen Registered!',
      `Accession Number: ${accessionNumber}\n\nPatient: ${patientName}\nType: ${finalSpecimenType}`,
      [
        {
          text: 'Generate QR Label',
          onPress: () => {
            // Will implement QR generation later
            Alert.alert('QR Label', 'QR code generation coming next!');
          }
        },
        {
          text: 'Register Another',
          onPress: () => {
            // Clear form
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
          }
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Specimen</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Information */}
        <Text style={styles.sectionTitle}>Patient Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Patient Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={patientName}
            onChangeText={setPatientName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Patient ID / Hospital Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., LAU123456"
            value={patientId}
            onChangeText={setPatientId}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Years"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.sexButtons}>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'M' && styles.sexButtonActive]}
                onPress={() => setSex('M')}
              >
                <Text style={[styles.sexButtonText, sex === 'M' && styles.sexButtonTextActive]}>M</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sexButton, sex === 'F' && styles.sexButtonActive]}
                onPress={() => setSex('F')}
              >
                <Text style={[styles.sexButtonText, sex === 'F' && styles.sexButtonTextActive]}>F</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Specimen Information */}
        <Text style={styles.sectionTitle}>Specimen Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Specimen Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {SPECIMEN_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, specimenType === type && styles.typeButtonActive]}
                onPress={() => {
                  setSpecimenType(type);
                  if (type !== 'Other') {
                    setOtherSpecimenType(''); // Clear custom type if not "Other"
                  }
                }}
              >
                <Text style={[styles.typeButtonText, specimenType === type && styles.typeButtonTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Show input field if "Other" is selected */}
        {specimenType === 'Other' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specify Specimen Type *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter specimen type"
              value={otherSpecimenType}
              onChangeText={setOtherSpecimenType}
              autoFocus={true}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Clinical Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Clinical history, indication for procedure..."
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
            value={referringDoctor}
            onChangeText={setReferringDoctor}
          />
        </View>

        {/* Priority */}
        <Text style={styles.sectionTitle}>Priority</Text>

        <View style={styles.priorityContainer}>
          <View style={styles.priorityRow}>
            <View>
              <Text style={styles.priorityLabel}>URGENT (24 hours)</Text>
              <Text style={styles.prioritySubtext}>Requires expedited processing</Text>
            </View>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{ false: COLORS.gray300, true: COLORS.warning }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.priorityRow}>
            <View>
              <Text style={styles.priorityLabel}>STAT (4 hours)</Text>
              <Text style={styles.prioritySubtext}>Critical - immediate processing</Text>
            </View>
            <Switch
              value={isStat}
              onValueChange={(value) => {
                setIsStat(value);
                if (value) setIsUrgent(false); // STAT overrides Urgent
              }}
              trackColor={{ false: COLORS.gray300, true: COLORS.danger }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register Specimen</Text>
        </TouchableOpacity>
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
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: COLORS.white,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 12,
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
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
    borderWidth: 1,
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
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  priorityContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  prioritySubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  registerButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});