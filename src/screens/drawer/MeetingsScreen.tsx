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

const MeetingIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V19H13V21H19V9H21ZM13 3.5L18.5 9H13V3.5Z" fill={color}/>
  </Svg>
);

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClockIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UsersIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  sport: '#e74c3c',
};

// Meeting Document Interface
interface MeetingDocument {
  _id: string;
  title: string;
  description: string;
  organizer: string;
  type: 'pdf' | 'image';
  url: string;
  thumbnailUrl?: string;
  meetingDate: string;
  meetingTime: string;
  attendees: string;
  documentType: 'agenda' | 'minutes' | 'invite';
  fileSize: number;
  isActive: boolean;
  community: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const getDocumentTypeColor = (docType: string) => {
  switch(docType) {
    case 'agenda': return AppColors.blue;
    case 'minutes': return AppColors.green;
    case 'invite': return AppColors.purple;
    default: return AppColors.gray;
  }
};

// Format date for display
const formatMeetingDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

// Format time for display
const formatMeetingTime = (timeString: string) => {
  try {
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } catch {
    return timeString;
  }
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MeetingScreen = () => {
  const navigation = useNavigation();
  const [meetingDocuments, setMeetingDocuments] = useState<MeetingDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<MeetingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<MeetingDocument | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // Fetch meeting documents from API
  const fetchMeetingDocuments = async () => {
    try {
      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();
      
      // Build query with community filter
      const filter = JSON.stringify({ community: communityId });
      const url = `${BASE_URL}/api/meetings?filter=${encodeURIComponent(filter)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setMeetingDocuments(result.data);
        setFilteredDocuments(result.data);
      } else {
        console.error('API returned unsuccessful response:', result);
        setMeetingDocuments([]);
        setFilteredDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching meeting documents:', error);
      Alert.alert('Error', 'Failed to load meeting documents. Please try again.');
      setMeetingDocuments([]);
      setFilteredDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMeetingDocuments();
  }, []);

  // Filter documents based on search
  useEffect(() => {
    filterDocuments();
  }, [searchQuery, meetingDocuments]);

  const filterDocuments = () => {
    let filtered = meetingDocuments;

    if (searchQuery.trim()) {
      filtered = filtered.filter(doc => {
        const query = searchQuery.toLowerCase();
        return (
          doc.title?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.organizer?.toLowerCase().includes(query) ||
          doc.documentType?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredDocuments(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeetingDocuments();
    setRefreshing(false);
  };

  const openDocument = (document: MeetingDocument) => {
    setSelectedDocument(document);
    if (document.type === 'image') {
      setImageModalVisible(true);
    } else if (document.type === 'pdf') {
      setPdfModalVisible(true);
    } else {
      Alert.alert('Meeting Details', `${document.title}\n\n${document.description}\n\nDate: ${formatMeetingDate(document.meetingDate)}\nTime: ${formatMeetingTime(document.meetingTime)}\nAttendees: ${document.attendees}`, [
        { text: 'Close', style: 'cancel' }
      ]);
    }
  };

  const closeModals = () => {
    setImageModalVisible(false);
    setPdfModalVisible(false);
    setSelectedDocument(null);
  };

  // Get full image URL with fallback
  const getFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      // Fallback dummy meeting image
      return 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png';
    }
    // Use the full URL directly from API
    return imageUrl;
  };

  // PDF Modal Component
  const PdfModal = () => {
    const getPdfViewerUrl = (pdfUrl: string) => {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
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
                  {selectedDocument?.title}
                </Text>
                <Text style={styles.viewerLabel}>Meeting Document</Text>
              </View>
              <TouchableOpacity onPress={closeModals} style={styles.pdfCloseButton}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.pdfContent}>
            {selectedDocument?.url && (
              <WebView
                source={{ uri: getPdfViewerUrl(selectedDocument.url) }}
                style={styles.webView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner}>
                      <Text style={styles.loadingEmoji}>📋</Text>
                    </View>
                    <Text style={styles.loadingText}>Loading Meeting Document...</Text>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Unable to load meeting document');
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
              {selectedDocument?.title}
            </Text>
            <TouchableOpacity onPress={closeModals} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.imageModalContent}>
          <Image
            source={{ uri: getFullImageUrl(selectedDocument?.url) }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>
            {selectedDocument?.organizer} • {selectedDocument && formatMeetingDate(selectedDocument.meetingDate)}
          </Text>
        </View>
      </View>
    </Modal>
  );

  // Document Card Component
  const DocumentCard = ({ item }: { item: MeetingDocument }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => openDocument(item)}
      activeOpacity={0.8}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.typeIndicator, { backgroundColor: getDocumentTypeColor(item.documentType) }]}>
          {item.type === 'pdf' && <PdfIcon size={24} color={AppColors.white} />}
          {item.type === 'image' && <ImageIcon size={24} color={AppColors.white} />}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: AppColors.success }]}>
          <Text style={styles.statusText}>ACTIVE</Text>
        </View>
      </View>

      {(item.type === 'image' || item.thumbnailUrl) && (
        <View style={styles.imagePreview}>
          <Image 
            source={{ uri: getFullImageUrl(item.thumbnailUrl || item.url) }} 
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.organizerName}>{item.organizer}</Text>
        <Text style={styles.documentDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.meetingDetails}>
          <View style={styles.detailRow}>
            <CalendarIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>{formatMeetingDate(item.meetingDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <ClockIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>{formatMeetingTime(item.meetingTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <UsersIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>{item.attendees}</Text>
          </View>
        </View>
        
        <View style={styles.documentFooter}>
          <View style={[styles.docTypeBadge, { backgroundColor: getDocumentTypeColor(item.documentType) }]}>
            <Text style={styles.docTypeBadgeText}>
              {item.documentType.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.formatBadge, { backgroundColor: AppColors.primary }]}>
            <Text style={styles.formatBadgeText}>{item.type.toUpperCase()}</Text>
          </View>
          {item.fileSize && (
            <View style={[styles.sizeBadge, { backgroundColor: AppColors.gray }]}>
              <Text style={styles.sizeBadgeText}>{formatFileSize(item.fileSize)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading meeting documents...</Text>
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
          <Text style={styles.headerTitle}>Meeting</Text>
          <Text style={styles.headerSubtitle}>{filteredDocuments.length} documents available</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{meetingDocuments.length}</Text>
          <Text style={styles.statLabel}>Total Docs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{meetingDocuments.filter(d => d.documentType === 'agenda').length}</Text>
          <Text style={styles.statLabel}>Agendas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{meetingDocuments.filter(d => d.documentType === 'minutes').length}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{meetingDocuments.filter(d => d.isActive).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meeting documents, agendas, minutes..."
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

      {/* Document List */}
      <FlatList
        data={filteredDocuments}
        renderItem={({ item }) => <DocumentCard item={item} />}
        keyExtractor={(item) => item._id}
        style={styles.documentList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Documents Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No meeting documents available'}
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
  
  // Document List styles
  documentList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  documentCard: {
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
  documentHeader: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: 'bold',
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
  documentInfo: {
    padding: 12,
    paddingTop: 0,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  organizerName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  documentDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 10,
  },
  meetingDetails: {
    marginBottom: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: AppColors.gray,
  },
  documentFooter: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  docTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  docTypeBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },
  sizeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sizeBadgeText: {
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

export default MeetingScreen;