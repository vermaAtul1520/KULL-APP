import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from 'react-native';
import Svg, {Path, Circle, Rect, G} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@app/constants/constant';
import {useAuth} from '@app/navigators';
import {useNavigation} from '@react-navigation/native';
import BannerComponent from '@app/navigators/BannerComponent';
import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {AppColors} from './NewsScreen';
import {moderateScale} from '@app/constants/scaleUtils';
import {useLanguage} from '@app/hooks/LanguageContext';

const {width, height} = Dimensions.get('window');

// API Interfaces
interface Creator {
  _id: string;
}

interface Donation {
  _id: string;
  title: string;
  organization: string;
  accountNumber: string;
  description: string;
  date: string;
  category: string;
  urgency: string;
  qrCode: string;
  beneficiaries: string;
  location: string;
  organizationType: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  images: string[];
  createdBy?: Creator;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DonationsAPIResponse {
  success: boolean;
  data: Donation[];
}

interface FilterState {
  category: string;
  urgency: string;
  organizationType: string;
}

const DonationScreen = () => {
  const {user, token} = useAuth();
  const {t} = useLanguage();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: '',
    urgency: '',
    organizationType: '',
  });
  const [tempFilters, setTempFilters] = useState<FilterState>({
    category: '',
    urgency: '',
    organizationType: '',
  });

  // Refs
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Filter options
  const categories = [
    'All',
    'Health',
    'Education',
    'Food',
    'Environment',
    'Other',
  ];
  const urgencyLevels = ['All', 'High', 'Medium', 'Low'];
  const organizationTypes = [
    'All',
    'NGO',
    'Trust',
    'Foundation',
    'Government',
    'Private',
  ];

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();
      const response = await fetch(
        `${BASE_URL}/api/donations/community/${communityId}`,
        {
          method: 'GET',
          headers,
        },
      );

      console.log('response', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw donations response:', responseText);

      let data: DonationsAPIResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid response format');
      }

      if (data.success && data.data) {
        setDonations(data.data);
        // Don't set filteredDonations here - let useEffect handle filtering
        console.log('Fetched donations:', data.data.length);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      Alert.alert(
        'Error',
        'Failed to load donations. Please check your internet connection and try again.',
        [
          {text: 'Retry', onPress: fetchDonations},
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Debounce search query
  useEffect(() => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Search and Filter Logic
  useEffect(() => {
    applyFiltersAndSearch();
  }, [debouncedSearchQuery, activeFilters, donations]);

  const applyFiltersAndSearch = () => {
    let filtered = [...donations];

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        donation =>
          donation.title.toLowerCase().includes(query) ||
          donation.organization.toLowerCase().includes(query) ||
          donation.category.toLowerCase().includes(query) ||
          donation.urgency.toLowerCase().includes(query) ||
          donation.description.toLowerCase().includes(query) ||
          donation.location.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (activeFilters.category && activeFilters.category !== 'All') {
      filtered = filtered.filter(
        donation =>
          donation.category?.toLowerCase().trim() ===
          activeFilters.category.toLowerCase().trim(),
      );
    }

    // Apply urgency filter
    if (activeFilters.urgency && activeFilters.urgency !== 'All') {
      filtered = filtered.filter(
        donation =>
          donation.urgency?.toLowerCase().trim() ===
          activeFilters.urgency.toLowerCase().trim(),
      );
    }

    // Apply organization type filter
    if (
      activeFilters.organizationType &&
      activeFilters.organizationType !== 'All'
    ) {
      filtered = filtered.filter(
        donation =>
          donation.organizationType?.toLowerCase().trim() ===
          activeFilters.organizationType.toLowerCase().trim(),
      );
    }

    setFilteredDonations(filtered);
  };

  // Search handlers
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      category: '',
      urgency: '',
      organizationType: '',
    });
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      searchQuery.trim() !== '' ||
      (activeFilters.category && activeFilters.category !== 'All') ||
      (activeFilters.urgency && activeFilters.urgency !== 'All') ||
      (activeFilters.organizationType &&
        activeFilters.organizationType !== 'All')
    );
  }, [searchQuery, activeFilters]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDonations();
  };

  // Helper Functions
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD93D';
      case 'low':
        return '#6BCF7F';
      default:
        return '#999';
    }
  };

  // SVG Icon Components
  const MedicalIcon = ({size = 20, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 7h8v-2H4v2zm0 4h8v-2H4v2zM10 4H8v2H6V4H4v2h2v2h2V6h2V4z"
        fill={color}
      />
    </Svg>
  );

  const EducationIcon = ({size = 20, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
        fill={color}
      />
    </Svg>
  );

  const FoodIcon = ({size = 20, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"
        fill={color}
      />
    </Svg>
  );

  const EnvironmentIcon = ({size = 20, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.82C6.16 17.77 9 14.5 12 14.5s5.84 3.27 7.12 7.66l1.06-.82C18.1 16.17 16 10 17 8zM16.5 3c0 1.11-.89 2-2 2L9 5c-1.11 0-2-.89-2-2s.89-2 2-2 2 .89 2 2 2 .89 2 2-.89 2-2 2z"
        fill={color}
      />
    </Svg>
  );

  const HeartIcon = ({size = 20, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );

  const ArrowLeftIcon = ({size = 24, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        fill={color}
      />
    </Svg>
  );

  const FilterIcon = ({size = 24, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill={color} />
    </Svg>
  );

  const SearchIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill={color}
      />
    </Svg>
  );

  const LocationIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={color}
      />
    </Svg>
  );

  const CalendarIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
        fill={color}
      />
    </Svg>
  );

  const GroupIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm5 7c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4.85 2.15L12 15l-1.85-1.85C9.7 13.7 9 14.83 9 16v3h6v-3c0-1.17-.7-2.3-1.15-2.85zm7.5 0L19.5 15l-1.85-1.85c-.45.55-1.15 1.68-1.15 2.85v3h6v-3c0-1.17-.7-2.3-1.15-2.85zm-15 0L4.5 15l-1.85-1.85C2.2 13.7 1.5 14.83 1.5 16v3h6v-3c0-1.17-.7-2.3-1.15-2.85z"
        fill={color}
      />
    </Svg>
  );

  const CertificateIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h8l-1 1v2h1.5l.5-.5.5.5H15v-2l-1-1h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4zm8 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 8.43c0-.81-.48-1.53-1.22-1.85C13.93 15.21 13 14.24 13 13c0-.8.8-2 2-2s2 1.2 2 2c0 1.24-.93 2.21-1.78 2.58-.74.32-1.22 1.04-1.22 1.85z"
        fill={color}
      />
    </Svg>
  );

  const EmailIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        fill={color}
      />
    </Svg>
  );

  const PhoneIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        fill={color}
      />
    </Svg>
  );

  const DocumentIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
        fill={color}
      />
    </Svg>
  );

  const BankIcon = ({size = 16, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.5 1L2 6v2h20V6m-5 4v7h3v-7m-9 7h3v-7h-3m4 0v7h3v-7M2 20h20v2H2z"
        fill={color}
      />
    </Svg>
  );

  const CloseIcon = ({size = 24, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill={color}
      />
    </Svg>
  );

  const getCategoryIcon = (category: string) => {
    const categoryLower = category?.toLowerCase();
    switch (categoryLower) {
      case 'health':
      case 'healthcare':
      case 'medical':
        return MedicalIcon;
      case 'education':
        return EducationIcon;
      case 'food':
      case 'food security':
        return FoodIcon;
      case 'environment':
        return EnvironmentIcon;
      default:
        return HeartIcon;
    }
  };

  const openDonationModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setModalVisible(true);
  };

  const closeDonationModal = () => {
    setModalVisible(false);
    setSelectedDonation(null);
  };

  const openFilterModal = useCallback(() => {
    setTempFilters(activeFilters);
    setFilterModalVisible(true);
  }, [activeFilters]);

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    closeFilterModal();
  };

  const renderFilterOption = (
    title: string,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void,
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterOptionsScroll}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              (currentValue === option ||
                (option === 'All' && !currentValue)) &&
                styles.filterOptionActive,
            ]}
            onPress={() => onSelect(option === 'All' ? '' : option)}>
            <Text
              style={[
                styles.filterOptionText,
                (currentValue === option ||
                  (option === 'All' && !currentValue)) &&
                  styles.filterOptionTextActive,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilterModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Donations</Text>
              <TouchableOpacity
                onPress={closeFilterModal}
                style={styles.closeButton}>
                <CloseIcon size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterModalBody}>
              {renderFilterOption(
                'Category',
                categories,
                tempFilters.category,
                value => setTempFilters(prev => ({...prev, category: value})),
              )}

              {renderFilterOption(
                'Urgency',
                urgencyLevels,
                tempFilters.urgency,
                value => setTempFilters(prev => ({...prev, urgency: value})),
              )}

              {renderFilterOption(
                'Organization Type',
                organizationTypes,
                tempFilters.organizationType,
                value =>
                  setTempFilters(prev => ({...prev, organizationType: value})),
              )}
            </ScrollView>

            <View style={styles.filterModalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setTempFilters({
                    category: '',
                    urgency: '',
                    organizationType: '',
                  });
                  clearFilters();
                  closeFilterModal();
                }}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => applyFilters(tempFilters)}>
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderDonationCard = ({item}: {item: Donation}) => {
    const CategoryIconComponent = getCategoryIcon(item.category);
    return (
      <TouchableOpacity
        style={styles.donationCard}
        onPress={() => openDonationModal(item)}
        activeOpacity={0.8}>
        {item.images.length > 0 && (
          <Image
            source={{uri: item.images[0]}}
            style={styles.donationImage}
            resizeMode="contain"
          />
        )}

        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <CategoryIconComponent size={20} color="#2a2a2a" />
            <Text style={styles.donationTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          <View
            style={[
              styles.urgencyBadge,
              {backgroundColor: getUrgencyColor(item.urgency)},
            ]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>

        <Text style={styles.organizationName}>{item.organization}</Text>
        <Text style={styles.accountNumber}>Ac No: {item.accountNumber}</Text>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.beneficiariesContainer}>
            <GroupIcon size={14} color="#666" />
            <Text style={styles.beneficiariesText}>{item.beneficiaries}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDonationModal = () => {
    if (!selectedDonation) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDonationModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donation Details</Text>
              <TouchableOpacity
                onPress={closeDonationModal}
                style={styles.closeButton}>
                <CloseIcon size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* QR Code Section */}
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>Scan to Donate</Text>
                  <View style={styles.qrContainer}>
                    <Image
                      source={{uri: selectedDonation.qrCode}}
                      style={styles.qrImage}
                      resizeMode="contain"
                      onError={() => {
                        console.log(
                          'QR Code failed to load:',
                          selectedDonation.qrCode,
                        );
                      }}
                    />
                  </View>
                  <Text style={styles.qrSubtext}>
                    Scan this QR code with any UPI app to donate
                  </Text>
                </View>

                {/* Donation Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.modalDonationTitle}>
                    {selectedDonation.title}
                  </Text>
                  <Text style={styles.modalOrganization}>
                    {selectedDonation.organization}
                  </Text>

                  <View style={styles.accountInfo}>
                    <BankIcon size={16} color="#666" />
                    <Text style={styles.accountText}>
                      Account: {selectedDonation.accountNumber}
                    </Text>
                  </View>

                  <Text style={styles.modalDescription}>
                    {selectedDonation.description}
                  </Text>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <LocationIcon size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {selectedDonation.location}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CalendarIcon size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {formatDate(selectedDonation.date)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <GroupIcon size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {selectedDonation.beneficiaries}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CertificateIcon size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {selectedDonation.organizationType}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Contact Information</Text>
                    <View style={styles.contactItem}>
                      <EmailIcon size={16} color="#666" />
                      <Text style={styles.contactText}>
                        {selectedDonation.contactEmail}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <PhoneIcon size={16} color="#666" />
                      <Text style={styles.contactText}>
                        {selectedDonation.contactPhone}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <DocumentIcon size={16} color="#666" />
                      <Text style={styles.contactText}>
                        Reg: {selectedDonation.registrationNumber}
                      </Text>
                    </View>
                  </View>

                  {/* Images Section */}
                  {selectedDonation.images &&
                    selectedDonation.images.length > 0 && (
                      <View style={styles.imagesSection}>
                        <Text style={styles.imagesTitle}>Gallery</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}>
                          {selectedDonation.images.map((imageUrl, index) => (
                            <Image
                              key={index}
                              source={{uri: imageUrl}}
                              style={styles.galleryImage}
                              onError={() => {
                                console.log('Image failed to load:', imageUrl);
                              }}
                            />
                          ))}
                        </ScrollView>
                      </View>
                    )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  const renderHeader = useCallback(() => (
    <View style={styles.headerStyle}>
      <Text style={styles.headerTitle}>Donations</Text>
      <Text style={styles.headerSubtitle}>
        {filteredDonations.length} of {donations.length} donations
      </Text>
    </View>
  ), [filteredDonations.length, donations.length]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a2a2a" />
        <Text style={styles.loadingText}>Loading donations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BannerComponent />

      {/* Active Filters Display */}
      

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.teal]}
            tintColor={AppColors.teal}
          />
        }>
      {renderHeader()}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search by title, organization, category..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor="#999"
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="off"
            underlineColorAndroid="transparent"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearSearchButton}>
             <CloseIcon size={20} color={AppColors.gray} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}>
          <FilterIcon size={24} color="#2a2a2a" />
          {hasActiveFilters() && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      </View>
        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HeartIcon size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {hasActiveFilters()
                ? 'No donations match your search criteria'
                : 'No donations available'}
            </Text>
            {hasActiveFilters() ? (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={clearFilters}>
                <Text style={styles.retryText}>Clear Filters</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchDonations}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredDonations.map((item, index) => (
            <View key={item._id}>
              {renderDonationCard({item})}
              {index < filteredDonations.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))
        )}
      </ScrollView>
      {/* <BannerComponent /> */}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDonations.length} donation
          {filteredDonations.length !== 1 ? 's' : ''} found
          {hasActiveFilters() && ` (filtered from ${donations.length})`}
        </Text>
      </View>

      {renderDonationModal()}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5dc',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerStyle: {
    flexDirection: 'column',
    padding: 15,
    backgroundColor: AppColors.dark,
    marginHorizontal: moderateScale(10),
  },
  listContainer: {
    // paddingHorizontal: moderateScale(15),
    paddingBottom: moderateScale(20),
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.primary,
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: AppColors.gray,
    marginBottom: moderateScale(5),
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: moderateScale(14),
    color: AppColors.gray,
    textAlign: 'center',
  },
  clearSearchButton: {
    // backgroundColor: AppColors.teal,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    // borderRadius: moderateScale(20),
    // marginTop: moderateScale(15),
  },
  clearSearchText: {
    color: AppColors.white,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  separator: {
    height: moderateScale(1),
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 4,
  },
  filterButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    // backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2a2a2a',
    marginLeft: 8,
    paddingVertical: 4,
  },
  // clearSearchButton: {
  //   padding: 4,
  // },

  // Active Filters Styles
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5dc',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#1976d2',
    marginRight: 4,
  },
  clearAllFiltersChip: {
    backgroundColor: '#ffebee',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  clearAllFiltersText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '600',
  },

  // Results Count Styles
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5dc',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Filter Modal Styles
  filterModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
  },
  filterModalBody: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  filterOptionsScroll: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#2a2a2a',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  filterModalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  // listContainer: {
  //   padding: 16,
  // },
  donationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: moderateScale(15),
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a2a2a',
    marginLeft: 8,
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  organizationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beneficiariesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beneficiariesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  // emptyText: {
  //   fontSize: 16,
  //   color: '#666',
  //   marginTop: 16,
  //   marginBottom: 24,
  //   textAlign: 'center',
  // },
  retryButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 16,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    flex: 1,
  },
  modalDonationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2a2a2a',
    marginBottom: 8,
  },
  modalOrganization: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsGrid: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  contactSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  imagesSection: {
    marginTop: 4,
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  donationImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 400,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
});

export default DonationScreen;
