// src/screens/SpecimenListScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function SpecimenListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Mock specimen data (will come from backend later)
  const mockSpecimens = [
    {
      id: 1,
      accessionNumber: 'S26-00123',
      patientName: 'John Doe',
      patientId: 'LAU123456',
      specimenType: 'Biopsy',
      currentStage: 'Grossing',
      priority: 'STAT',
      registeredAt: '2026-02-14 09:15',
      urgencyColor: COLORS.danger,
    },
    {
      id: 2,
      accessionNumber: 'S26-00122',
      patientName: 'Jane Smith',
      patientId: 'LAU123455',
      specimenType: 'Cytology',
      currentStage: 'Processing',
      priority: 'Urgent',
      registeredAt: '2026-02-14 08:30',
      urgencyColor: COLORS.warning,
    },
    {
      id: 3,
      accessionNumber: 'S26-00121',
      patientName: 'Ahmed Ibrahim',
      patientId: 'LAU123454',
      specimenType: 'Excision',
      currentStage: 'Staining',
      priority: 'Routine',
      registeredAt: '2026-02-14 07:45',
      urgencyColor: COLORS.primary,
    },
    {
      id: 4,
      accessionNumber: 'S26-00120',
      patientName: 'Mary Johnson',
      patientId: 'LAU123453',
      specimenType: 'Biopsy',
      currentStage: 'Reception',
      priority: 'Routine',
      registeredAt: '2026-02-13 16:20',
      urgencyColor: COLORS.primary,
    },
    {
      id: 5,
      accessionNumber: 'S26-00119',
      patientName: 'David Wilson',
      patientId: 'LAU123452',
      specimenType: 'Fine Needle Aspiration',
      currentStage: 'Reporting',
      priority: 'Urgent',
      registeredAt: '2026-02-13 14:10',
      urgencyColor: COLORS.warning,
    },
  ];

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Reception', value: 'reception' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorityFilters = [
    { label: 'All', value: 'all' },
    { label: 'STAT', value: 'STAT' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Routine', value: 'Routine' },
  ];

  // Filter specimens based on search and filters
  const filteredSpecimens = mockSpecimens.filter(specimen => {
    const matchesSearch = 
      specimen.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      specimen.currentStage.toLowerCase() === selectedFilter.toLowerCase();
    
    const matchesPriority = selectedPriority === 'all' || 
      specimen.priority === selectedPriority;

    return matchesSearch && matchesFilter && matchesPriority;
  });

  const renderSpecimenCard = ({ item }) => (
    <TouchableOpacity
      style={styles.specimenCard}
      onPress={() => navigation.navigate('SpecimenDetail', { specimenId: item.id })}
      activeOpacity={0.7}
    >
      {/* Priority Badge */}
      <View style={[styles.priorityBadge, { backgroundColor: item.urgencyColor }]}>
        <Text style={styles.priorityText}>{item.priority}</Text>
      </View>

      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.accessionNumber}>{item.accessionNumber}</Text>
          <Text style={styles.patientName}>{item.patientName}</Text>
        </View>
        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>Current Stage</Text>
          <Text style={[styles.stageValue, { color: item.urgencyColor }]}>
            {item.currentStage}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Patient ID:</Text>
          <Text style={styles.detailValue}>{item.patientId}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{item.specimenType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Registered:</Text>
          <Text style={styles.detailValue}>{item.registeredAt}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details →</Text>
        </TouchableOpacity>
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
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by accession, patient, or ID..."
            placeholderTextColor={COLORS.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        {/* Stage Filters */}
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

        {/* Priority Filters */}
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

      {/* Specimen List */}
      {filteredSpecimens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
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
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearIcon: {
    fontSize: 18,
    color: COLORS.gray500,
    padding: 4,
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
  },
  actionButton: {
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
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});