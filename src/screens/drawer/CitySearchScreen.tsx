import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLanguage } from '@app/hooks/LanguageContext';
import { getAuthHeaders } from '@app/constants/apiUtils';
import { BASE_URL } from '@app/constants/constant';

// Color scheme
const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  lightGray: '#f5f5f5',
  border: '#e5e7eb',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  danger: '#ef4444',
};

// SVG Icon Components
const MagnifyIcon = ({ size = 24, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseCircleIcon = ({ size = 20, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path
      d="M15 9L9 15M9 9L15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const GenderMaleIcon = ({ size = 16, color = '#3b82f6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="14" r="6" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M15 9L20 4M20 4H16M20 4V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GenderFemaleIcon = ({ size = 16, color = '#ec4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="6" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M12 15V22M9 19H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BriefcaseIcon = ({ size = 14, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M5 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9C3 7.89543 3.89543 7 5 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MapMarkerIcon = ({ size = 14, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill={color}
    />
  </Svg>
);

const MapMarkerRadiusIcon = ({ size = 14, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" fill={color} />
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" fill="none" strokeDasharray="2 2" />
  </Svg>
);

const AlertCircleIcon = ({ size = 64, color = AppColors.danger }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1" fill={color} />
  </Svg>
);

const MapSearchIcon = ({ size = 64, color = AppColors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 3L21 6V16L15 13M15 3L9 6M15 3V13M9 6L3 3V13L9 16M9 6V16M9 16L15 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="17" cy="18" r="3" stroke={color} strokeWidth="2" />
    <Path d="M19.5 20.5L22 23" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const AccountSearchIcon = ({ size = 64, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path
      d="M2 20C2 16.6863 4.68629 14 8 14C9.38169 14 10.6633 14.4689 11.6841 15.2571"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="17.5" cy="17.5" r="3" stroke={color} strokeWidth="2" />
    <Path d="M19.5 19.5L22 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pinCode: string;
  code: string;
  gender: string;
  occupation: string;
  profileImage?: string;
  roleInCommunity: string;
  gotra?: string;
  subGotra?: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  count: number;
  users: User[];
}

export default function CitySearchScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle search with debouncing
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setError(null);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If query is empty, clear results
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // If query is too short, don't search
    if (query.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      performSearch(query.trim());
    }, 500); // 500ms debounce delay

    setDebounceTimer(timer);
  };

  // Perform the actual search
  const performSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const headers = await getAuthHeaders();
      const encodedQuery = encodeURIComponent(query);

      const response = await fetch(
        `${BASE_URL}/api/users/city-search?query=${encodedQuery}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data: SearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search users');
      }

      if (data.success) {
        setSearchResults(data.users || []);
        setHasSearched(true);
      } else {
        setError(data.message || 'Search failed');
        setSearchResults([]);
        setHasSearched(true);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  // Get user initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Render user card
  const renderUserCard = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      activeOpacity={0.7}
      onPress={() => {
        // You can add navigation to user profile here if needed
        Alert.alert(
          `${item.firstName} ${item.lastName}`,
          `Email: ${item.email}\nPhone: ${item.phone}\nOccupation: ${item.occupation || 'N/A'}`,
          [{ text: 'OK' }]
        );
      }}
    >
      <View style={styles.cardContent}>
        {/* Profile Image or Initials */}
        <View style={styles.avatarContainer}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {getInitials(item.firstName, item.lastName)}
              </Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {item.firstName} {item.lastName}
            </Text>
            {item.gender && (
              <View style={styles.genderIcon}>
                {item.gender === 'male' ? (
                  <GenderMaleIcon size={16} color="#3b82f6" />
                ) : (
                  <GenderFemaleIcon size={16} color="#ec4899" />
                )}
              </View>
            )}
          </View>

          <Text style={styles.userCode}>ID: {item.code}</Text>

          {item.occupation && (
            <View style={styles.infoRow}>
              <BriefcaseIcon size={14} color={AppColors.gray} />
              <Text style={styles.infoText}>{item.occupation}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <MapMarkerIcon size={14} color={AppColors.gray} />
            <Text style={styles.infoText} numberOfLines={2}>
              {item.address}
            </Text>
          </View>

          {item.pinCode && (
            <View style={styles.infoRow}>
              <MapMarkerRadiusIcon size={14} color={AppColors.gray} />
              <Text style={styles.infoText}>PIN: {item.pinCode}</Text>
            </View>
          )}

          {(item.gotra || item.subGotra) && (
            <View style={styles.gotraContainer}>
              {item.gotra && (
                <View style={styles.gotraChip}>
                  <Text style={styles.gotraText}>{item.gotra}</Text>
                </View>
              )}
              {item.subGotra && (
                <View style={styles.gotraChip}>
                  <Text style={styles.gotraText}>{item.subGotra}</Text>
                </View>
              )}
            </View>
          )}

          {item.roleInCommunity && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>{item.roleInCommunity}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state component
  const renderEmptyState = () => {
    if (isLoading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <AlertCircleIcon size={64} color={AppColors.danger} />
          <Text style={styles.emptyTitle}>{t('Error') || 'Error'}</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => performSearch(searchQuery)}>
            <Text style={styles.retryButtonText}>{t('Retry') || 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <MapSearchIcon size={64} color={AppColors.primary} />
          <Text style={styles.emptyTitle}>
            {t('Search Members by Location') || 'Search Members by Location'}
          </Text>
          <Text style={styles.emptyText}>
            {t('Enter a city, area, or pincode to find members in your community') ||
              'Enter a city, area, or pincode to find members in your community'}
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>{t('Examples') || 'Examples'}:</Text>
            <Text style={styles.exampleText}>• Delhi</Text>
            <Text style={styles.exampleText}>• 110001</Text>
            <Text style={styles.exampleText}>• Park Avenue</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <AccountSearchIcon size={64} color={AppColors.gray} />
        <Text style={styles.emptyTitle}>
          {t('No Members Found') || 'No Members Found'}
        </Text>
        <Text style={styles.emptyText}>
          {t('No members found in your area. Try searching with broader terms.') ||
            'No members found in your area. Try searching with broader terms.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <View style={styles.searchIcon}>
            <MagnifyIcon size={24} color={AppColors.gray} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Search by city, area, or pincode') || 'Search by city, area, or pincode'}
            placeholderTextColor={AppColors.gray}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              if (searchQuery.trim().length >= 2) {
                performSearch(searchQuery.trim());
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <CloseCircleIcon size={20} color={AppColors.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Info */}
        {hasSearched && !isLoading && (
          <Text style={styles.searchInfo}>
            {searchResults.length === 0
              ? t('No results found') || 'No results found'
              : `${searchResults.length} ${
                  searchResults.length === 1
                    ? t('member found') || 'member found'
                    : t('members found') || 'members found'
                }`}
          </Text>
        )}
      </View>

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderUserCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContainer,
          searchResults.length === 0 && styles.listContainerEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingText}>
              {t('Searching...') || 'Searching...'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.dark,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchInfo: {
    marginTop: 12,
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  userCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.white,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginRight: 8,
  },
  genderIcon: {
    marginLeft: 4,
  },
  userCode: {
    fontSize: 12,
    color: AppColors.gray,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 6,
    flex: 1,
  },
  gotraContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
  },
  gotraChip: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  gotraText: {
    fontSize: 12,
    color: AppColors.dark,
    fontWeight: '500',
  },
  roleContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    color: AppColors.teal,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.dark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  examplesContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    width: '100%',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: AppColors.gray,
    marginBottom: 4,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: AppColors.white,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: '500',
  },
});