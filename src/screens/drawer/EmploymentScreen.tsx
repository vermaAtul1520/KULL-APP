import { getAuthHeaders, getCommunityId } from '@app/constants/apiUtils';
import { BASE_URL } from '@app/constants/constant';
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
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const SearchIcon = ({ size = 24, color = "#2a2a2a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
  </Svg>
);

const PdfIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
  </Svg>
);

const ImageIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" fill={color}/>
  </Svg>
);

const BriefcaseIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16m8 0H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" fill={color}/>
  </Svg>
);

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  purple: '#8b5cf6',
};

// Job Post Interface - Updated to match API response
interface JobPost {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  fileType: 'pdf' | 'image';
  thumbnailUrl?: string;
  salary: string;
  experience: string;
  language: string;
  community: string;
  createdAt: string;
  updatedAt: string;
}

const EmploymentScreen = () => {
  const navigation = useNavigation();
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // Fetch job posts from API
  const fetchJobPosts = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/api/jobPosts/`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setJobPosts(result.data);
        setFilteredJobs(result.data);
      } else {
        console.error('API returned unsuccessful response:', result);
        setJobPosts([]);
        setFilteredJobs([]);
      }
    } catch (error) {
      console.error('Error fetching job posts:', error);
      Alert.alert('Error', 'Failed to load job posts. Please try again.');
      setJobPosts([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobPosts();
  }, []);

  // Filter jobs based on search
  useEffect(() => {
    filterJobs();
  }, [searchQuery, jobPosts]);

  const filterJobs = () => {
    let filtered = jobPosts;

    if (searchQuery.trim()) {
      filtered = filtered.filter(job => {
        const query = searchQuery.toLowerCase();
        return (
          job.title?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query) ||
          job.category?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredJobs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobPosts();
    setRefreshing(false);
  };

  const openJob = (job: JobPost) => {
    setSelectedJob(job);
    if (job.fileType === 'image') {
      setImageModalVisible(true);
    } else if (job.fileType === 'pdf') {
      setPdfModalVisible(true);
    } else {
      Alert.alert('Job Details', `${job.title}\n\n${job.description}\n\nSalary: ${job.salary || 'Not specified'}\nExperience: ${job.experience || 'Not specified'}\nCompany: ${job.company}`, [
        { text: 'Close', style: 'cancel' }
      ]);
    }
  };

  const closeModals = () => {
    setImageModalVisible(false);
    setPdfModalVisible(false);
    setSelectedJob(null);
  };

  // Get full image URL with fallback
  const getFullImageUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl) {
      // Fallback dummy image
      return 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png';
    }
    return `${BASE_URL}/${thumbnailUrl}`;
  };

  // PDF Modal Component
  const PdfModal = () => {
    const getPdfViewerUrl = (thumbnailUrl?: string) => {
      if (!thumbnailUrl) return '';
      const fullUrl = getFullImageUrl(thumbnailUrl);
      return fullUrl ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fullUrl)}` : '';
    };

    return (
      <Modal
        visible={pdfModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeModals}
      >
        <View style={styles.pdfModalContainer}>
          <StatusBar backgroundColor={AppColors.teal} barStyle="light-content" />
          <View style={styles.pdfModalHeader}>
            <View style={styles.pdfHeaderContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.pdfModalTitle} numberOfLines={1}>
                  {selectedJob?.title}
                </Text>
                <Text style={styles.viewerLabel}>Job Posting</Text>
              </View>
              <TouchableOpacity onPress={closeModals} style={styles.pdfCloseButton}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.pdfContent}>
            {selectedJob && selectedJob.thumbnailUrl && (
              <WebView
                source={{ uri: getPdfViewerUrl(selectedJob.thumbnailUrl) }}
                style={styles.webView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner}>
                      <Text style={styles.loadingEmoji}>📄</Text>
                    </View>
                    <Text style={styles.loadingText}>Loading Job Details...</Text>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Unable to load job details');
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Image Modal Component
  const ImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModals}
    >
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedJob?.title}
            </Text>
            <TouchableOpacity onPress={closeModals} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.imageModalContent}>
          <Image
            source={{ uri: getFullImageUrl(selectedJob?.thumbnailUrl) }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>
            {selectedJob?.company} • {selectedJob?.location}
          </Text>
        </View>
      </View>
    </Modal>
  );

  // Job Card Component
  const JobCard = ({ item }: { item: JobPost }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => openJob(item)}
      activeOpacity={0.8}
    >
      <View style={styles.jobHeader}>
        <View style={[styles.typeIndicator, { backgroundColor: AppColors.primary }]}>
          {item.fileType === 'pdf' && <PdfIcon size={24} color={AppColors.white} />}
          {item.fileType === 'image' && <ImageIcon size={24} color={AppColors.white} />}
        </View>
      </View>

      {(item.fileType === 'image' || !item.thumbnailUrl) && (
        <View style={styles.imagePreview}>
          <Image 
            source={{ uri: getFullImageUrl(item.thumbnailUrl) }} 
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.companyName}>{item.company}</Text>
        <Text style={styles.jobDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.jobFooter}>
          <View style={styles.jobMeta}>
            <Text style={styles.locationText}>{item.location}</Text>
            {item.salary && <Text style={styles.salaryText}>{item.salary}</Text>}
            {item.experience && <Text style={styles.experienceText}>{item.experience}</Text>}
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: AppColors.primary }]}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
            {item.language && (
              <View style={[styles.languageBadge, { backgroundColor: AppColors.blue }]}>
                <Text style={styles.languageBadgeText}>{item.language}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading job opportunities...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Employment</Text>
          <Text style={styles.headerSubtitle}>{filteredJobs.length} opportunities available</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobPosts.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.fileType === 'image').length}</Text>
          <Text style={styles.statLabel}>Images</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.fileType === 'pdf').length}</Text>
          <Text style={styles.statLabel}>PDFs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.language === 'English').length}</Text>
          <Text style={styles.statLabel}>English</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies, locations..."
          placeholderTextColor={AppColors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchIcon}>
            <CloseIcon size={20} color={AppColors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={({ item }) => <JobCard item={item} />}
        keyExtractor={(item) => item._id}
        style={styles.jobList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Jobs Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No job opportunities available'}
            </Text>
          </View>
        }
      />

      <ImageModal />
      <PdfModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },
  
  // Header styles
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },
  
  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'center',
  },
  
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
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
  
  // Job List styles
  jobList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  jobCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 5,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 120,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: AppColors.lightGray,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  jobInfo: {
    padding: 12,
    paddingTop: 0,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  companyName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  jobDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  jobMeta: {
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
    marginBottom: 2,
  },
  salaryText: {
    fontSize: 11,
    color: AppColors.teal,
    fontWeight: '600',
    marginBottom: 1,
  },
  experienceText: {
    fontSize: 11,
    color: AppColors.orange,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },
  languageBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  languageBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },
  
  // Loading & Empty states
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    marginRight: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  imageModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
    borderRadius: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalFooterText: {
    color: AppColors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  
  // PDF Modal Styles
  pdfModalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  pdfModalHeader: {
    backgroundColor: AppColors.teal,
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  pdfHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  pdfModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  viewerLabel: {
    fontSize: 12,
    color: AppColors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  pdfCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pdfContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingSpinner: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
});

export default EmploymentScreen;