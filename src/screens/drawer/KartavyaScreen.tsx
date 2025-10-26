/**
 * Unified KartavyaScreen Component - Handles both main category selection and detail views
 *
 * Required Dependencies:
 * npm install react-native-svg react-native-webview
 */

import {useNavigation} from '@react-navigation/native';
import {useDrawerAwareNavigation} from '@app/hooks/useDrawerAwareNavigation';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import Svg, {Path, Circle, Rect} from 'react-native-svg';
import {WebView} from 'react-native-webview';
import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {BASE_URL} from '@app/constants/constant';

const {width, height} = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f8f9fa',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
  cardBg: '#1a1a1a',
};

// SVG Icons
const VoteIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect
      x="12"
      y="20"
      width="40"
      height="32"
      rx="4"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M32 12L36 20H28L32 12Z" fill={AppColors.danger} />
    <Rect
      x="16"
      y="30"
      width="32"
      height="4"
      rx="2"
      fill={AppColors.dark}
      opacity="0.3"
    />
    <Rect
      x="16"
      y="38"
      width="24"
      height="3"
      rx="1.5"
      fill={AppColors.dark}
      opacity="0.3"
    />
  </Svg>
);

const OfficersIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect
      x="8"
      y="20"
      width="48"
      height="32"
      rx="4"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="20" cy="32" r="6" fill={AppColors.blue} />
    <Path d="M14 44C14 40 16 38 20 38S26 40 26 44" fill={AppColors.blue} />
    <Rect
      x="30"
      y="28"
      width="20"
      height="3"
      rx="1.5"
      fill={AppColors.dark}
      opacity="0.4"
    />
    <Rect
      x="30"
      y="34"
      width="16"
      height="3"
      rx="1.5"
      fill={AppColors.dark}
      opacity="0.4"
    />
    <Circle cx="12" cy="16" r="2" fill={AppColors.warning} />
  </Svg>
);

const MeetingIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect
      x="10"
      y="20"
      width="44"
      height="28"
      rx="4"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="32" cy="32" r="6" fill={AppColors.orange} />
    <Path d="M26 42C26 38 28 36 32 36S38 38 38 42" fill={AppColors.orange} />
    <Rect
      x="16"
      y="16"
      width="32"
      height="6"
      rx="3"
      fill={AppColors.orange}
      opacity="0.7"
    />
  </Svg>
);

const ProgressIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Rect
      x="12"
      y="24"
      width="40"
      height="24"
      rx="4"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M22 16L26 20H18L22 16Z" fill={AppColors.dark} />
    <Path d="M42 16L46 20H38L42 16Z" fill={AppColors.dark} />
    <Rect
      x="16"
      y="32"
      width="32"
      height="3"
      rx="1.5"
      fill={AppColors.warning}
    />
    <Rect
      x="16"
      y="38"
      width="24"
      height="3"
      rx="1.5"
      fill={AppColors.warning}
      opacity="0.7"
    />
  </Svg>
);

const CommunityIcon = ({size = 40, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="24" fill="none" stroke={color} strokeWidth="3" />
    <Circle cx="32" cy="24" r="4" fill={AppColors.blue} />
    <Circle cx="44" cy="30" r="3" fill={AppColors.purple} />
    <Circle cx="20" cy="30" r="3" fill={AppColors.success} />
    <Circle cx="38" cy="42" r="3" fill={AppColors.orange} />
    <Circle cx="26" cy="42" r="3" fill={AppColors.danger} />
    <Path
      d="M32 28L44 30M32 28L20 30M32 28L38 42M32 28L26 42"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.6"
    />
  </Svg>
);

const PdfIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
      fill={color}
    />
  </Svg>
);

const ImageIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
      fill={color}
    />
  </Svg>
);

const HeartIcon = ({size = 20, color = AppColors.gray, filled = false}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={
        filled
          ? 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'
          : 'M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z'
      }
      fill={color}
    />
  </Svg>
);

const BackIcon = ({size = 24, color = AppColors.white}) => (
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

const CloseIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      fill={color}
    />
  </Svg>
);

const BookIcon = ({size = 20, color = AppColors.primary}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5.05 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.68 6.5,20.68C8.45,20.68 10.55,21.1 12,22C13.35,21.15 15.8,20.68 17.5,20.68C19.15,20.68 20.85,20.9 22.25,21.56C22.35,21.61 22.4,21.66 22.5,21.66C22.75,21.66 23,21.41 23,21.16V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.97 12,19.82C10.65,18.97 8.2,18.5 6.5,18.5C5.3,18.5 4.1,18.65 3,19V13L3,7.5C4.1,6.65 5.3,5.95 6.5,5Z"
      fill={color}
    />
  </Svg>
);

const GridIcon = ({size = 16, color = AppColors.gray}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14Z"
      fill={color}
    />
  </Svg>
);

const SearchIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={color}
    />
  </Svg>
);

// Data structures
interface KartavyaCategory {
  id: string;
  title: string;
  titleEn: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  itemCount: number;
}

interface KartyaItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  author?: string;
  filetype: 'pdf' | 'image';
  attachment: string;
  thumbnailUrl?: string;
  language: string;
  community: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface KartavyaApiResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  count: number;
  data: KartyaItem[];
}

const kartavyaCategories: KartavyaCategory[] = [
  {
    id: 'chunav',
    title: 'Chunav ke',
    titleEn: 'Elections',
    icon: VoteIcon,
    description: 'Election related documents and information',
    color: AppColors.orange,
    itemCount: 12,
  },
  {
    id: 'adhikari',
    title: 'Adhikari ke',
    titleEn: 'Officers',
    icon: OfficersIcon,
    description: 'Officer information and documents',
    color: AppColors.blue,
    itemCount: 8,
  },
  {
    id: 'baithak',
    title: 'Baithak ke',
    titleEn: 'Meetings',
    icon: MeetingIcon,
    description: 'Meeting records and documentation',
    color: AppColors.purple,
    itemCount: 15,
  },
  {
    id: 'karya-pragati',
    title: 'Karya pragati ke',
    titleEn: 'Work Progress',
    icon: ProgressIcon,
    description: 'Work progress reports and updates',
    color: AppColors.warning,
    itemCount: 23,
  },
  {
    id: 'samaj',
    title: 'Samaj ke kartavya',
    titleEn: 'Community Duties',
    icon: CommunityIcon,
    description: 'Community responsibilities and social documents',
    color: AppColors.success,
    itemCount: 18,
  },
];

const typeFilters = ['All', 'PDF', 'Image'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Elections':
      return AppColors.orange;
    case 'Officers':
      return AppColors.blue;
    case 'Meetings':
      return AppColors.purple;
    case 'Work Progress':
      return AppColors.warning;
    case 'Community Duties':
      return AppColors.success;
    default:
      return AppColors.gray;
  }
};

const getCategoryFromId = (categoryId: string) => {
  switch (categoryId) {
    case 'chunav':
      return 'Elections';
    case 'adhikari':
      return 'Officers';
    case 'baithak':
      return 'Meetings';
    case 'karya-pragati':
      return 'Work Progress';
    case 'samaj':
      return 'Community Duties';
    default:
      return 'All';
  }
};

export default function KartavyaScreen() {
  const {goBackToDrawer} = useDrawerAwareNavigation();
  const [currentView, setCurrentView] = useState<'main' | 'details'>('main');
  const [selectedCategory, setSelectedCategory] =
    useState<KartavyaCategory | null>(null);
  const [selectedType, setSelectedType] = useState('All');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KartyaItem | null>(null);

  // API related state
  const [kartyaItems, setKartyaItems] = useState<KartyaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KartyaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();

  // Fetch kartavya data from API
  const fetchKartavyaData = async () => {
    try {
      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();
      console.log('Fetching kartavya data...', communityId);

      // Build query with community filter
      const filter = JSON.stringify({community: communityId});
      const url = `${BASE_URL}/api/kartavya?filter=${encodeURIComponent(
        filter,
      )}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('Kartavya Response:', url, headers, response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: KartavyaApiResponse = await response.json();
      console.log('Fetched kartavya data:', result);
      if (result.success && result.data) {
        setKartyaItems(result.data);
        setFilteredItems(result.data);
      } else {
        console.error('API returned unsuccessful response:', result);
        setKartyaItems([]);
        setFilteredItems([]);
      }
    } catch (error) {
      console.error('Error fetching kartavya data:', error);
      Alert.alert('Error', 'Failed to load kartavya data. Please try again.');
      setKartyaItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchKartavyaData();
    console.log('hello');
  }, []);

  // Filter items based on search, category and type
  useEffect(() => {
    filterItems();
    console.log('hello');
  }, [searchQuery, selectedCategory, selectedType, kartyaItems]);

  const filterItems = () => {
    let filtered = kartyaItems;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory.id);
    }

    // Apply type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(
        item =>
          (selectedType === 'PDF' && item.filetype === 'pdf') ||
          (selectedType === 'Image' && item.filetype === 'image'),
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.language?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchKartavyaData();
  };

  const handleCategorySelect = (category: KartavyaCategory) => {
    setSelectedCategory(category);
    setCurrentView('details');
    setSelectedType('All'); // Reset type filter when switching categories
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedCategory(null);
    setSelectedType('All');
    setSearchQuery('');
  };

  const openKartyaItem = (item: KartyaItem) => {
    setSelectedItem(item);
    if (item.filetype === 'image') {
      setImageModalVisible(true);
    } else {
      setPdfModalVisible(true);
    }
  };

  const closeModals = () => {
    setImageModalVisible(false);
    setPdfModalVisible(false);
    setSelectedItem(null);
  };

  // PDF Modal Component
  const PdfModal = () => {
    const getPdfViewerUrl = (pdfUrl: string) => {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
        pdfUrl,
      )}`;
    };

    return (
      <Modal
        visible={pdfModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeModals}>
        <View style={styles.pdfModalContainer}>
          <StatusBar
            backgroundColor={AppColors.teal}
            barStyle="light-content"
          />
          <View style={styles.pdfModalHeader}>
            <View style={styles.pdfHeaderContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.pdfModalTitle} numberOfLines={1}>
                  {selectedItem?.title}
                </Text>
                <Text style={styles.viewerLabel}>
                  📖 View-only • No downloads
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeModals}
                style={styles.pdfCloseButton}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pdfContent}>
            {selectedItem && (
              <WebView
                source={{uri: getPdfViewerUrl(selectedItem.attachment)}}
                style={styles.webView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={`
                  function hideUIElements() {
                    const elementsToHide = [
                      '#toolbarContainer',
                      '#sidebarContainer', 
                      '#secondaryToolbar',
                      '.toolbar',
                      '.findbar',
                      '#errorWrapper',
                      '#overlayContainer',
                      '.doorHanger',
                      '.dropdownToolbarButton',
                      '#pageNumberLabel',
                      '#scaleSelectContainer',
                      '#loadingBar'
                    ];
                    
                    const style = document.createElement('style');
                    style.innerHTML = elementsToHide.join(', ') + \` { 
                      display: none !important; 
                      visibility: hidden !important;
                      opacity: 0 !important;
                    }\` + \`
                    #viewerContainer { 
                      top: 0 !important; 
                      bottom: 0 !important; 
                      left: 0 !important; 
                      right: 0 !important;
                      overflow-y: auto !important;
                      background: #f0f0f0 !important;
                    }
                    #viewer {
                      padding: 10px !important;
                      background: #f0f0f0 !important;
                    }
                    .page {
                      margin: 10px auto !important;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                      border-radius: 8px !important;
                    }
                    html, body { 
                      margin: 0 !important; 
                      padding: 0 !important; 
                      background: #f0f0f0 !important;
                      overflow: hidden !important;
                    }
                    \`;
                    document.head.appendChild(style);
                    
                    elementsToHide.forEach(selector => {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        if (el) {
                          el.style.display = 'none';
                          el.remove();
                        }
                      });
                    });
                    
                    document.addEventListener('contextmenu', function(e) {
                      e.preventDefault();
                      return false;
                    }, true);
                  }
                  
                  hideUIElements();
                  setTimeout(hideUIElements, 500);
                  setTimeout(hideUIElements, 1000);
                  setTimeout(hideUIElements, 2000);
                  
                  document.addEventListener('DOMContentLoaded', hideUIElements);
                  window.addEventListener('load', hideUIElements);
                  
                  true;
                `}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner}>
                      <Text style={styles.loadingEmoji}>📖</Text>
                    </View>
                    <Text style={styles.loadingText}>Loading Document...</Text>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Unable to load document');
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
      onRequestClose={closeModals}>
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedItem?.title}
            </Text>
            <TouchableOpacity onPress={closeModals} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageModalContent}>
          {selectedItem && (
            <Image
              source={{uri: selectedItem.attachment}}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>{selectedItem?.author}</Text>
        </View>
      </View>
    </Modal>
  );

  // Main Category Selection View
  const MainView = () => {
    const CategoryCard = ({category}: {category: KartavyaCategory}) => {
      const IconComponent = category.icon;

      return (
        <TouchableOpacity
          style={[styles.categoryCard, {borderLeftColor: category.color}]}
          onPress={() => handleCategorySelect(category)}
          activeOpacity={0.8}>
          <View
            style={[styles.iconContainer, {backgroundColor: category.color}]}>
            <IconComponent size={40} color={AppColors.white} />
          </View>

          <View style={styles.categoryContent}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryTitleEn}>{category.titleEn}</Text>
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {category.description}
            </Text>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>
                {
                  kartyaItems.filter(item => item.category === category.id)
                    .length
                }{' '}
                items available
              </Text>
            </View>
          </View>

          <View style={styles.chevronContainer}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke={AppColors.gray}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackToDrawer} style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Kartavya</Text>
            <Text style={styles.headerSubtitle}>
              Choose a category to explore
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{kartavyaCategories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{kartyaItems.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredItems.filter(i => i.filetype === 'pdf').length}
            </Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          style={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}>
          {kartavyaCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Select a category above to view related documents and information
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Detail View Component
  const DetailView = () => {
    const KartyaCard = ({item}: {item: KartyaItem}) => (
      <TouchableOpacity
        style={styles.kartyaCard}
        onPress={() => openKartyaItem(item)}
        activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.typeIndicator,
              {
                backgroundColor:
                  item.filetype === 'pdf'
                    ? getCategoryColor(item.category)
                    : AppColors.blue,
              },
            ]}>
            {item.filetype === 'pdf' ? (
              <PdfIcon size={24} color={AppColors.white} />
            ) : (
              <ImageIcon size={24} color={AppColors.white} />
            )}
          </View>
        </View>

        {item.filetype === 'image' && item.thumbnailUrl && (
          <View style={styles.imagePreview}>
            <Image
              source={{uri: item.thumbnailUrl}}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.kartyaInfo}>
          <Text style={styles.kartyaTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.kartyaDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.kartyaFooter}>
            <Text style={styles.languageText}>{item.language}</Text>
            <View
              style={[
                styles.categoryBadge,
                {backgroundColor: getCategoryColor(item.category)},
              ]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    const TypeFilter = () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeFilterContainer}
        contentContainerStyle={styles.filterContent}>
        {typeFilters.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonActive,
            ]}
            onPress={() => setSelectedType(type)}>
            <View style={styles.typeIcon}>
              {type === 'PDF' && (
                <PdfIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
              {type === 'Image' && (
                <ImageIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
              {type === 'All' && (
                <GridIcon
                  size={16}
                  color={
                    selectedType === type ? AppColors.white : AppColors.gray
                  }
                />
              )}
            </View>
            <Text
              style={[
                styles.typeButtonText,
                selectedType === type && styles.typeButtonTextActive,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={handleBackToMain}
            style={styles.detailBackButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.detailHeaderContent}>
            <Text style={styles.detailHeaderTitle}>
              {selectedCategory?.titleEn}
            </Text>
            <Text style={styles.detailHeaderSubtitle}>
              {selectedCategory?.title}
            </Text>
          </View>
        </View>

        {/* Stats Header */}
        <View style={styles.detailStatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredItems.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredItems.filter(i => i.filetype === 'pdf').length}
            </Text>
            <Text style={styles.statLabel}>PDFs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredItems.filter(i => i.filetype === 'image').length}
            </Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{kartyaItems.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={AppColors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search kartavya documents..."
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

        <TypeFilter />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[AppColors.primary]}
            />
          }>
          <View style={styles.kartyaGrid}>
            {filteredItems.map(item => (
              <KartyaCard key={item._id} item={item} />
            ))}
          </View>

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <BookIcon size={60} color={AppColors.gray} />
              <Text style={styles.emptyTitle}>No Items Found</Text>
              <Text style={styles.emptyText}>
                No documents or images available for this category and filter
                combination.
              </Text>
            </View>
          )}

          <View style={styles.detailFooter}>
            <Text style={styles.footerText}>
              Documents and information related to {selectedCategory?.titleEn}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackToDrawer} style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Kartavya</Text>
            <Text style={styles.headerSubtitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <Text style={styles.loadingEmoji}>📋</Text>
          </View>
          <Text style={styles.loadingText}>Loading kartavya data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render the appropriate view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      {currentView === 'main' ? <MainView /> : <DetailView />}
      <ImageModal />
      <PdfModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },

  // Main View Styles
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statItem: {
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
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 2,
  },
  categoryTitleEn: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 8,
  },
  itemCountContainer: {
    backgroundColor: AppColors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  itemCountText: {
    fontSize: 11,
    color: AppColors.primary,
    fontWeight: '600',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },

  // Detail View Styles
  detailHeader: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBackButton: {
    marginRight: 15,
    padding: 5,
  },
  detailHeaderContent: {
    flex: 1,
  },
  detailHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 2,
  },
  detailHeaderSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },
  detailStatsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
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
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  typeFilterContainer: {
    backgroundColor: AppColors.cream,
    paddingVertical: 8,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  typeButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
  },
  typeButtonActive: {
    backgroundColor: AppColors.dark,
    borderColor: AppColors.dark,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeButtonText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: AppColors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  kartyaGrid: {
    paddingHorizontal: 10,
  },
  kartyaCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 5,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
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
  favoriteButton: {
    padding: 4,
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
  kartyaInfo: {
    padding: 12,
    paddingTop: 0,
  },
  kartyaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  authorName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  kartyaDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 12,
  },
  kartyaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: AppColors.white,
    fontWeight: '500',
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  detailFooter: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.dark,
    marginTop: 10,
    fontWeight: '600',
  },
});
