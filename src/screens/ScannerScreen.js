// src/screens/ScannerScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function ScannerScreen({ navigation }) {
  const [manualInput, setManualInput] = useState('');

  const handleSearch = () => {
    if (!manualInput.trim()) {
      Alert.alert('Enter Accession Number', 'Please enter a specimen accession number');
      return;
    }

    Alert.alert(
      'Specimen Found',
      `Accession Number: ${manualInput}\n\nWhat would you like to do?`,
      [
        {
          text: 'View Details',
          onPress: () => {
            Alert.alert('Specimen Details', `Loading details for ${manualInput}...\n\n(Detail screen coming next)`);
            setManualInput('');
          }
        },
        {
          text: 'Update Stage',
          onPress: () => {
            Alert.alert('Update Stage', `Update stage for ${manualInput}...\n\n(Stage update coming next)`);
            setManualInput('');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Search</Text>
        <Text style={styles.headerSubtitle}>Enter accession number manually</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Scanner Placeholder */}
        <View style={styles.scannerPlaceholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderTitle}>QR Scanner</Text>
          <Text style={styles.placeholderText}>
            Camera scanner will be enabled when connected to internet
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>
        </View>

        {/* Manual Entry */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          <Text style={styles.sectionSubtitle}>
            Enter specimen accession number
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔍</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., S26-00123"
              placeholderTextColor={COLORS.gray400}
              value={manualInput}
              onChangeText={setManualInput}
              autoCapitalize="characters"
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search Specimen</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Quick Tip</Text>
            <Text style={styles.infoText}>
              You can also view all specimens from the "Specimens" tab
            </Text>
          </View>
        </View>
      </View>
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
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scannerPlaceholder: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  manualSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.info,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});