// src/screens/ScannerScreen.js
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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import api from '../services/api';

export default function ScannerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleScan = () => {
    Alert.alert(
      'QR Scanner',
      'Camera scanning will be implemented in full deployment. For now, use manual search below.',
      [{ text: 'OK' }]
    );
  };

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Enter Accession Number', 'Please enter a specimen accession number');
      return;
    }

    setIsSearching(true);
    try {
      // Search for specimen by accession number
      const response = await api.get(`/specimens/search/${searchQuery.trim()}`);
      
      if (response.data.specimens.length === 0) {
        Alert.alert('Not Found', `No specimen found with accession number: ${searchQuery}`);
        setIsSearching(false);
        return;
      }

      const specimen = response.data.specimens[0];
      setIsSearching(false);
      setSearchQuery('');
      
      // Navigate to specimen detail
      navigation.navigate('SpecimenList', {
        screen: 'SpecimenDetail',
        params: { specimenId: specimen.id }
      });

    } catch (error) {
      setIsSearching(false);
      Alert.alert('Error', 'Failed to search for specimen. Check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Scanner</Text>
        <Text style={styles.headerSubtitle}>Scan specimen QR code</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scanner Placeholder */}
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <View style={[styles.scannerCorner, styles.cornerTopLeft]} />
            <View style={[styles.scannerCorner, styles.cornerTopRight]} />
            <View style={[styles.scannerCorner, styles.cornerBottomLeft]} />
            <View style={[styles.scannerCorner, styles.cornerBottomRight]} />
            
            <Ionicons name="qr-code-outline" size={120} color={COLORS.primary} />
          </View>

          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
            <Ionicons name="scan" size={28} color={COLORS.white} />
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>

          <Text style={styles.scannerHint}>
            Position QR code within the frame
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Search */}
        <View style={styles.manualSearchContainer}>
          <Text style={styles.manualSearchTitle}>Manual Search</Text>
          <Text style={styles.manualSearchHint}>
            Enter specimen accession number
          </Text>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="e.g., S26-00123"
              placeholderTextColor={COLORS.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="characters"
              onSubmitEditing={handleManualSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.searchButton,
              (!searchQuery.trim() || isSearching) && styles.searchButtonDisabled
            ]}
            onPress={handleManualSearch}
            disabled={!searchQuery.trim() || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={COLORS.white} />
                <Text style={styles.searchButtonText}>Search Specimen</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Dashboard', {
              screen: 'SpecimenRegistration'
            })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="add-circle" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Register New Specimen</Text>
              <Text style={styles.quickActionSubtitle}>Create new specimen entry</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('SpecimenList')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.info + '15' }]}>
              <Ionicons name="list" size={28} color={COLORS.info} />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>View All Specimens</Text>
              <Text style={styles.quickActionSubtitle}>Browse specimen list</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
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
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
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
  scannerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.medium,
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray300,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
    fontWeight: '600',
  },
  manualSearchContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  manualSearchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  manualSearchHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});