import React, {useState, useEffect} from 'react';
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
  Linking,
  RefreshControl,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@app/constants/constant';
import {useAuth} from '@app/navigators';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {useDrawerAwareNavigation} from '@app/hooks/useDrawerAwareNavigation';

const {width} = Dimensions.get('window');

// Custom SVG Icons
const SearchIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={color}
    />
  </Svg>
);

const BackIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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

const SchoolIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"
      fill={color}
    />
  </Svg>
);

const BookIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
      fill={color}
    />
  </Svg>
);

const LinkIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.29 7 2.2 9.09 2.2 11.7s2.09 4.7 4.7 4.7H11v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9.1-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1H13v1.9h4.1c2.61 0 4.7-2.09 4.7-4.7S19.71 7 17.1 7z"
      fill={color}
    />
  </Svg>
);

const VideoIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"
      fill={color}
    />
  </Svg>
);

const DocumentIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
      fill={color}
    />
  </Svg>
);

const ExternalIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-7h-2v7Z"
      fill={color}
    />
  </Svg>
);

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
interface EducationResource {
  _id: string;
  title: string;
  description: string;
  type: 'class_link' | 'course_material' | 'guidance';
  category: string;
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EducationResponse {
  success: boolean;
  data: EducationResource[];
  count: number;
}

const EducationScreen = () => {
  const {user, token} = useAuth();
  const {goBackToDrawer} = useDrawerAwareNavigation();

  // State management
  const [resources, setResources] = useState<EducationResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<
    EducationResource[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');

  // Modal states
  const [selectedResource, setSelectedResource] =
    useState<EducationResource | null>(null);
  const [resourceModalVisible, setResourceModalVisible] = useState(false);

  const tabs = [
    {key: 'all', label: 'All', icon: SchoolIcon},
    {key: 'class_link', label: 'Classes', icon: VideoIcon},
    {key: 'course_material', label: 'Materials', icon: BookIcon},
    {key: 'guidance', label: 'Guidance', icon: DocumentIcon},
  ];

  const fetchEducationResources = async () => {
    try {
      setLoading(true);
      const communityId = await getCommunityId();

      const headers = await getAuthHeaders();
      const response = await fetch(
        `${BASE_URL}/api/educationResources?filter=${encodeURIComponent(
          JSON.stringify({community: communityId}),
        )}`,
        {
          method: 'GET',
          headers,
        },
      );

      console.log(
        `${BASE_URL}/api/educationResources?filter=${encodeURIComponent(
          JSON.stringify({community: communityId}),
        )}`,
        headers,
      );

      console.log('Education API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EducationResponse = await response.json();
      console.log('Loaded education resources count:', data.data?.length || 0);

      if (data.success && data.data && Array.isArray(data.data)) {
        setResources(data.data);
        setFilteredResources(data.data);
      } else {
        console.log('No education resources available');
        setResources([]);
        setFilteredResources([]);
      }
    } catch (error) {
      console.error('Error fetching education resources:', error);
      Alert.alert(
        'Error',
        'Failed to load education resources. Please try again.',
      );
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEducationResources();
  }, []);

  // Search and filter logic
  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedTab, resources]);

  const filterResources = () => {
    let filtered = resources;

    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedTab);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource => {
        const query = searchQuery.toLowerCase();
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.category.toLowerCase().includes(query) ||
          resource.instructor.toLowerCase().includes(query)
        );
      });
    }

    setFilteredResources(filtered);
  };

  // Handlers
  const onRefresh = () => {
    setRefreshing(true);
    fetchEducationResources();
  };

  const handleResourcePress = (resource: EducationResource) => {
    setSelectedResource(resource);
    setResourceModalVisible(true);
  };

  const closeResourceModal = () => {
    setResourceModalVisible(false);
    setSelectedResource(null);
  };

  const handleResourceAccess = (resource: EducationResource) => {
    const url = resource.url || resource.fileUrl;
    if (!url) {
      Alert.alert('No Link', 'No access link available for this resource');
      return;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open the link');
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'class_link':
        return VideoIcon;
      case 'course_material':
        return BookIcon;
      case 'guidance':
        return DocumentIcon;
      default:
        return SchoolIcon;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return AppColors.green;
      case 'Intermediate':
        return AppColors.orange;
      case 'Advanced':
        return AppColors.red;
      default:
        return AppColors.gray;
    }
  };

  const renderResourceCard = ({item}: {item: EducationResource}) => {
    const ResourceIcon = getResourceIcon(item.type);
    console.log('resource item: ', item);
    return (
      <TouchableOpacity
        style={styles.resourceCard}
        onPress={() => handleResourcePress(item)}>
        {item?.thumbnailUrl && (
          <Image
            source={{uri: item.thumbnailUrl}}
            style={styles.resourceImage}
            resizeMode="contain"
          />
        )}
        <View style={styles.resourceCardHeader}>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceInstructor}>by {item.instructor}</Text>
            <Text style={styles.resourceCategory}>{item.category}</Text>
          </View>
          <View style={styles.resourceMeta}>
            <View
              style={[
                styles.levelBadge,
                {backgroundColor: getLevelColor(item.level)},
              ]}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.resourceDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.resourceFooter}>
          <Text style={styles.durationText}>{item.duration}</Text>
          <TouchableOpacity
            style={styles.accessButton}
            onPress={() => handleResourceAccess(item)}>
            <Text style={styles.accessButtonText}>Access</Text>
            <ExternalIcon size={16} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderResourceDetailsModal = () => {
    if (!selectedResource) return null;

    const ResourceIcon = getResourceIcon(selectedResource.type);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={resourceModalVisible}
        onRequestClose={closeResourceModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.resourceModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resource Details</Text>
              <TouchableOpacity onPress={closeResourceModal}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resourceDetailsScrollView}>
              {/* Resource Header */}
              <View style={styles.resourceDetailsHeader}>
                {selectedResource?.thumbnailUrl && (
                  <Image
                    source={{uri: selectedResource.thumbnailUrl}}
                    style={styles.resourceImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.resourceDetailsTitle}>
                  {selectedResource.title}
                </Text>
                <Text style={styles.resourceDetailsInstructor}>
                  by {selectedResource.instructor}
                </Text>
                <Text style={styles.resourceDetailsCategory}>
                  {selectedResource.category}
                </Text>
              </View>

              {/* Resource Info */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Information</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>
                    {selectedResource.type
                      .replace('_', ' ')
                      .replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Level:</Text>
                  <View
                    style={[
                      styles.levelBadge,
                      {backgroundColor: getLevelColor(selectedResource.level)},
                    ]}>
                    <Text style={styles.levelText}>
                      {selectedResource.level}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>
                    {selectedResource.duration}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {selectedResource.description}
                </Text>
              </View>

              {/* Access Button */}
              <View style={styles.detailsSection}>
                <TouchableOpacity
                  style={styles.fullAccessButton}
                  onPress={() => {
                    handleResourceAccess(selectedResource);
                    closeResourceModal();
                  }}>
                  <Text style={styles.fullAccessButtonText}>
                    {selectedResource.type === 'class_link'
                      ? 'Join Class'
                      : selectedResource.type === 'course_material'
                      ? 'Download Material'
                      : 'View Guidance'}
                  </Text>
                  <ExternalIcon size={20} color={AppColors.white} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading education resources...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToDrawer} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Education</Text>
        <Text style={styles.headerSubtitle}>
          {filteredResources.length} resources available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources, instructors, categories..."
          placeholderTextColor={AppColors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchIcon}>
            <CloseIcon size={20} color={AppColors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedTab === tab.key && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(tab.key)}>
                <TabIcon
                  size={20}
                  color={
                    selectedTab === tab.key ? AppColors.white : AppColors.gray
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.key && styles.tabTextActive,
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Resource List */}
      <FlatList
        data={filteredResources}
        renderItem={renderResourceCard}
        keyExtractor={item => item._id}
        style={styles.resourceList}
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
            <SchoolIcon size={64} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedTab !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No education resources available at the moment'}
            </Text>
          </View>
        }
      />

      {/* Modal */}
      {renderResourceDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.dark,
    marginLeft: 8,
    paddingVertical: 4,
  },
  clearSearchIcon: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: AppColors.lightGray,
  },
  tabActive: {
    backgroundColor: AppColors.primary,
  },
  tabText: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  tabTextActive: {
    color: AppColors.white,
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
  resourceList: {
    flex: 1,
    padding: 16,
  },
  resourceCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resourceCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 4,
  },
  resourceInstructor: {
    fontSize: 12,
    color: AppColors.primary,
    marginBottom: 2,
  },
  resourceCategory: {
    fontSize: 12,
    color: AppColors.gray,
  },
  resourceMeta: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: AppColors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  resourceDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.lightGray,
  },
  durationText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  accessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  accessButtonText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
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
  resourceModalContent: {
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
  resourceDetailsScrollView: {
    maxHeight: '85%',
  },
  resourceDetailsHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  resourceDetailsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resourceDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  resourceDetailsInstructor: {
    fontSize: 14,
    color: AppColors.primary,
    marginBottom: 4,
  },
  resourceDetailsCategory: {
    fontSize: 12,
    color: AppColors.gray,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: AppColors.gray,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: AppColors.white,
    flex: 1,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.white,
    lineHeight: 22,
  },
  fullAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  fullAccessButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourceImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 400,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
});

export default EducationScreen;
