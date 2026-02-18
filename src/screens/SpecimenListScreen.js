// src/screens/SpecimenListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import api from '../services/api';

export default function SpecimenListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [specimens, setSpecimens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Reception', value: 'reception' },
    { label: 'Grossing', value: 'grossing' },
    { label: 'Processing', value: 'processing' },
    { label: 'Reporting', value: 'reporting' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorityFilters = [
    { label: 'All', value: 'all' },
    { label: 'STAT', value: 'stat' },
    { label: 'Urgent', value: 'urgent' },
    { label: 'Routine', value: 'routine' },
  ];

  const fetchSpecimens = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/specimens');
      setSpecimens(response.data.specimens);
    } catch (error) {
      Alert.alert('Error', 'Failed to load specimens. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecimens();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSpecimens();
    }, [])
  );

  const getPriorityColor = (priority) => {
    if (priority === 'stat') return COLORS.danger;
    if (priority === 'urgent') return COLORS.warning;
    return COLORS.primary;
  };

  const filteredSpecimens = specimens.filter(specimen => {
    const matchesSearch =
      specimen.accession_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.patient_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' ||
      specimen.current_stage?.toLowerCase() === selectedFilter.toLowerCase();

    const matchesPriority = selectedPriority === 'all' ||
      specimen.priority?.toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesFilter && matchesPriority;
  });

  const renderSpecimenCard = ({ item }) => (
    <TouchableOpacity
      style={styles.specimenCard}
      onPress={() => navigation.navigate('SpecimenDetail', { specimenId: item.id })}
      activeOpacity={0.7}
    >
      {/* Priority Badge */}
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
        <Text style={styles.priorityText}>{item.priority?.toUpperCase()}</Text>
      </View>

      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.accessionNumber}>{item.accession_number}</Text>
          <Text style={styles.patientName}>{item.patient_name}</Text>
        </View>
        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>Current Stage</Text>
          <Text style={[styles.stageValue, { color: getPriorityColor(item.priority) }]}>
            {item.current_stage?.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Patient ID:</Text>
          <Text style={styles.detailValue}>{item.patient_id}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{item.specimen_type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Registered:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.registered_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.actionButtonText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Specimens</Text>
        <Text style={styles.headerSubtitle}>
          {filteredSpecimens.length} specimen{filteredSpecimens.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={COLORS.gray400} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by accession, patient, or ID..."
            placeholderTextColor={COLORS.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Stage:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.value && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.value && styles.filterChipTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Priority:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {priorityFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.priorityChip,
                  selectedPriority === filter.value && styles.priorityChipActive
                ]}
                onPress={() => setSelectedPriority(filter.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.priorityChipText,
                  selectedPriority === filter.value && styles.priorityChipTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading specimens...</Text>
        </View>
      ) : filteredSpecimens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={80} color={COLORS.gray300} />
          <Text style={styles.emptyTitle}>No Specimens Found</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No specimens registered yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpecimens}
          renderItem={renderSpecimenCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchSpecimens}
          refreshing={isLoading}
        />
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filtersSection: {
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: 12,
    width: 70,
  },
  filterScroll: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    minWidth: 80,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    minWidth: 70,
    alignItems: 'center',
  },
  priorityChipActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  priorityChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  priorityChipTextActive: {
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
  },
  specimenCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 12,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  accessionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  stageContainer: {
    alignItems: 'flex-end',
  },
  stageLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  stageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardDetails: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});