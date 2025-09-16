import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';
import { useAuth } from '@app/navigators';
import { getAuthHeaders, getCommunityId } from '@app/constants/apiUtils';
import Svg, { Path } from 'react-native-svg';
import BannerComponent from '@app/navigators/BannerComponent';

const { width } = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  blue: '#4169e1',
  lightGray: '#f0f0f0',
  orange: '#ff8c00',
  red: '#dc143c',
  green: '#228b22',
};

// API Types
interface CommunityUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: boolean;
  communityStatus: string;
  roleInCommunity: string;
  gender: string;
  occupation: string;
  religion: string;
  motherTongue: string;
  interests: string[];
  cast: string;
  cGotNo: string;
  fatherName: string;
  address: string;
  pinCode: string;
  alternativePhone: string;
  estimatedMembers: number;
  thoughtOfMaking: string;
  maritalStatus: string;
  gotra: string;
  code: string;
  createdAt: string;
  __v: number;
}

interface UsersAPIResponse {
  success: boolean;
  count: number;
  data: CommunityUser[];
}

interface FilterOptions {
  gender: string;
  maritalStatus: string;
  occupation: string;
  communityStatus: string;
  roleInCommunity: string;
  religion: string;
  cast: string;
}

const MyPeopleScreen = () => {
  const { user, token } = useAuth();
  
  // State management
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    gender: '',
    maritalStatus: '',
    occupation: '',
    communityStatus: '',
    roleInCommunity: '',
    religion: '',
    cast: '',
  });
  const [tempFilters, setTempFilters] = useState<FilterOptions>({ ...filters });

  const CloseIcon = ({ size = 24, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
    </Svg>
  );

  const FilterIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill={color}/>
    </Svg>
  );

  const SearchIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
    </Svg>
   );

   const EmailIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
    </Svg>
  );
  
  const MapMarkerIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color}/>
    </Svg>
  );
  
  const AccountGroupIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={color}/>
      <Path d="M20 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 1c-1.33 0-4 .67-4 2v1.5h3V15c0-.17.02-.33.05-.5H20v.5zm-16-1c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 1c-1.33 0-4 .67-4 2v1.5h3V15c0-.17.02-.33.05-.5H4v.5z" fill={color}/>
    </Svg>
  );

  // API Functions
  // const getAuthHeaders = async () => {
  //   const userToken = await AsyncStorage.getItem('userToken');
  //   return {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${userToken || token}`,
  //   };
  // };

  const fetchCommunityUsers = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const COMMUNITY_ID = await getCommunityId();
      console.log('Fetching community users for:', COMMUNITY_ID);
      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/users`, {
        method: 'GET',
        headers,
      });

      console.log('Users API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UsersAPIResponse = await response.json();
      console.log('Loaded users count:', data.count);

      if (data.success && data.data) {
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }

    } catch (error) {
      console.error('Error fetching community users:', error);
      Alert.alert(
        'Error',
        'Failed to load community users. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunityUsers();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered?.filter(user => {
        const fullName = `${user?.firstName} ${user?.lastName}`?.toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
          fullName.includes(query) ||
          user?.email?.toLowerCase().includes(query) ||
          user?.occupation?.toLowerCase().includes(query) ||
          user?.cGotNo?.toLowerCase().includes(query)
        );
      });
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key as keyof FilterOptions];
      if (filterValue) {
        filtered = filtered.filter(user => {
          const userValue = user[key as keyof CommunityUser];
          return String(userValue).toLowerCase() === filterValue.toLowerCase();
        });
      }
    });

    setFilteredUsers(filtered);
  }, [searchQuery, filters, users]);

  // Handlers
  const onRefresh = () => {
    setRefreshing(true);
    fetchCommunityUsers();
  };

  const handleUserPress = (user: CommunityUser) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const closeUserModal = () => {
    setUserModalVisible(false);
    setSelectedUser(null);
  };

  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      gender: '',
      maritalStatus: '',
      occupation: '',
      communityStatus: '',
      roleInCommunity: '',
      religion: '',
      cast: '',
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setFilterModalVisible(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  // Render functions
  const renderUserCard = ({ item }: { item: CommunityUser }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item)}>
      <View style={styles.userCardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.userRole}>{item.occupation}</Text>
          <Text style={styles.userCode}>{item.cGotNo}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.communityStatus === 'pending' ? AppColors.orange : AppColors.green }
          ]}>
            <Text style={styles.statusText}>{item.communityStatus}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
        <EmailIcon size={14} color={AppColors.gray} />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
        <MapMarkerIcon size={14} color={AppColors.gray} />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
        <AccountGroupIcon size={14} color={AppColors.gray} />
          <Text style={styles.detailText}>{item.roleInCommunity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => {
    const filterOptions = {
      gender: ['male', 'female', 'other'],
      maritalStatus: ['single', 'married', 'divorced', 'widowed'],
      gotra: ['malha','biddu']
      // communityStatus: ['pending', 'approved', 'rejected'],
      // roleInCommunity: ['member', 'admin', 'moderator'],
      // religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'],
      // cast: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'],
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Users</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <CloseIcon size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterScrollView}>
              {Object.keys(filterOptions).map((filterKey) => (
                <View key={filterKey} style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>
                    {filterKey.charAt(0).toUpperCase() + filterKey.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                  <View style={styles.filterOptions}>
                    <TouchableOpacity
                      style={[
                        styles.filterOption,
                        tempFilters[filterKey as keyof FilterOptions] === '' && styles.filterOptionSelected
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, [filterKey]: '' })}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        tempFilters[filterKey as keyof FilterOptions] === '' && styles.filterOptionTextSelected
                      ]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    {filterOptions[filterKey as keyof typeof filterOptions].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.filterOption,
                          tempFilters[filterKey as keyof FilterOptions] === option && styles.filterOptionSelected
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, [filterKey]: option })}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          tempFilters[filterKey as keyof FilterOptions] === option && styles.filterOptionTextSelected
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderUserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={closeUserModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.userModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={closeUserModal}>
                <CloseIcon size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.userDetailsScrollView}>
              <View style={styles.userProfileSection}>
                <Text style={styles.userFullName}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Text style={styles.userOccupation}>{selectedUser.occupation}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedUser.communityStatus === 'pending' ? AppColors.orange : AppColors.green }
                ]}>
                  <Text style={styles.statusText}>{selectedUser.communityStatus}</Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Father's Name:</Text>
                  <Text style={styles.detailValue}>{selectedUser.fatherName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gender:</Text>
                  <Text style={styles.detailValue}>{selectedUser.gender}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Marital Status:</Text>
                  <Text style={styles.detailValue}>{selectedUser.maritalStatus}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Religion:</Text>
                  <Text style={styles.detailValue}>{selectedUser.religion}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Cast:</Text>
                  <Text style={styles.detailValue}>{selectedUser.cast}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gotra:</Text>
                  <Text style={styles.detailValue}>{selectedUser.gotra}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Mother Tongue:</Text>
                  <Text style={styles.detailValue}>{selectedUser.motherTongue}</Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{selectedUser.alternativePhone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>{selectedUser.address}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Pin Code:</Text>
                  <Text style={styles.detailValue}>{selectedUser.pinCode}</Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Community Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>CGOT Number:</Text>
                  <Text style={styles.detailValue}>{selectedUser.cGotNo}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Role in Community:</Text>
                  <Text style={styles.detailValue}>{selectedUser.roleInCommunity}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Estimated Members:</Text>
                  <Text style={styles.detailValue}>{selectedUser.estimatedMembers}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Thought of Making:</Text>
                  <Text style={styles.detailValue}>{selectedUser.thoughtOfMaking}</Text>
                </View>
              </View>

              {selectedUser.interests && selectedUser.interests.length > 0 && (
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.interestsContainer}>
                    {selectedUser.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <BannerComponent />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My People</Text>
        <Text style={styles.headerSubtitle}>
          {filteredUsers.length} of {users.length} members
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
        <SearchIcon size={24} color="#2a2a2a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, occupation..."
            placeholderTextColor={AppColors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchIcon}>
              <Icon name="close" size={20} color={AppColors.gray} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
        <FilterIcon size={24} color="#2a2a2a" />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* User List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading community members...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item._id}
          style={styles.userList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[AppColors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="account-group-outline" size={64} color={AppColors.gray} />
              <Text style={styles.emptyTitle}>No members found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || getActiveFilterCount() > 0
                  ? 'Try adjusting your search or filters'
                  : 'No community members available'}
              </Text>
            </View>
          }
        />
      )}

      {/* Modals */}
      {renderFilterModal()}
      {renderUserDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  header: {
    padding: 20,
    backgroundColor: AppColors.dark,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.primary,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: AppColors.dark,
  },
  clearSearchIcon: {
    padding: 4,
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
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: AppColors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.gray,
  },
  userList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: AppColors.primary,
    marginBottom: 2,
  },
  userCode: {
    fontSize: 12,
    color: AppColors.gray,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: AppColors.lightGray,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContent: {
    backgroundColor: AppColors.dark,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  userModalContent: {
    backgroundColor: AppColors.dark,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  filterScrollView: {
    maxHeight: '70%',
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#3a3a3a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  filterOptionSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterOptionText: {
    color: AppColors.white,
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: AppColors.dark,
    fontWeight: 'bold',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: AppColors.dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetailsScrollView: {
    maxHeight: '85%',
  },
  userProfileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  userFullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 8,
  },
  userOccupation: {
    fontSize: 16,
    color: AppColors.primary,
    marginBottom: 12,
  },
  detailsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: AppColors.gray,
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: AppColors.white,
    flex: 1,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  interestText: {
    color: AppColors.white,
    fontSize: 12,
  },
});

export default MyPeopleScreen;