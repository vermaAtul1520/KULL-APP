// Screen 4: Content Display (API-driven)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Linking,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { AppColors } from './constants';
import { BackIcon, PdfIcon, VideoIcon, ImageIcon } from './components/OccasionIcons';
import { OccasionApiService, Occasion } from '@app/services/occasionApi';
import OccasionContent from '@app/services/occasionApi';

export const ContentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    occasionType,
    categoryId,
    categoryName,
    gotra,
    subGotra,
    gender,
  } = route.params as {
    occasionType: string;
    categoryId: string;
    categoryName: string;
    gotra?: string;
    subGotra?: string;
    gender?: string;
  };

  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<OccasionContent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'pdf' | 'image' | 'video' | null>(null);

  useEffect(() => {
    // Only fetch if filters are provided (user clicked "Apply Filters")
    if (gotra || subGotra || gender) {
      fetchOccasions();
    }
  }, [gotra, subGotra, gender]);

  const fetchOccasions = async () => {
    try {
      setLoading(true);
      const response = await OccasionApiService.fetchOccasions(
        occasionType,
        categoryId,
        gotra,
        subGotra,
        gender
      );
      setOccasions(response.data);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      Alert.alert('Error', error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    // Only allow refresh if filters are applied
    if (gotra || subGotra || gender) {
      setRefreshing(true);
      await fetchOccasions();
      setRefreshing(false);
    }
  };

  const handleOpenContent = (content: OccasionContent) => {
    setSelectedContent(content);

    if (content.type === 'video') {
      // Open video in external browser/YouTube
      Linking.openURL(content.url).catch(err => {
        Alert.alert('Error', 'Unable to open video');
      });
    } else {
      // Open PDF or image in modal
      setModalType(content.type);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
    setSelectedContent(null);
  };

  const renderContentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon size={24} color={AppColors.white} />;
      case 'video':
        return <VideoIcon size={24} color={AppColors.white} />;
      case 'image':
        return <ImageIcon size={24} color={AppColors.white} />;
      default:
        return null;
    }
  };

  const renderContentBadge = (type: string) => {
    const colors = {
      pdf: AppColors.danger,
      video: AppColors.blue,
      image: AppColors.success,
    };
    return (
      <View style={[styles.typeBadge, { backgroundColor: colors[type] || AppColors.gray }]}>
        <Text style={styles.typeBadgeText}>{type.toUpperCase()}</Text>
      </View>
    );
  };

  // Flatten all contents from all occasions
  const allContents = occasions.flatMap(occasion =>
    occasion.contents.map(content => ({
      ...content,
      occasionId: occasion._id,
    }))
  );

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            <Text style={styles.headerSubtitle}>Loading content...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show initial state - no filters applied yet
  if (!gotra && !subGotra && !gender && occasions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            <Text style={styles.headerSubtitle}>{occasionType}</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Please Apply Filters</Text>
          <Text style={styles.emptyText}>
            Go back and select filters (Gotra, Sub-Gotra, or Gender) to view content.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Select Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSubtitle}>{occasionType}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{allContents.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {allContents.filter(c => c.type === 'pdf').length}
          </Text>
          <Text style={styles.statLabel}>PDFs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {allContents.filter(c => c.type === 'video').length}
          </Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {allContents.filter(c => c.type === 'image').length}
          </Text>
          <Text style={styles.statLabel}>Images</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AppColors.primary]} />
        }
      >
        <View style={styles.contentList}>
          {allContents.map((content, index) => (
            <TouchableOpacity
              key={`${content._id}-${index}`}
              style={styles.contentCard}
              onPress={() => handleOpenContent(content)}
              activeOpacity={0.8}
            >
              <View style={styles.contentHeader}>
                <View style={[styles.iconContainer, { backgroundColor: AppColors.primary }]}>
                  {renderContentIcon(content.type)}
                </View>
              </View>

              {content.type === 'image' && content.thumbnailUrl && (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: content.thumbnailUrl }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              <View style={styles.contentInfo}>
                <View style={styles.contentFooter}>
                  <Text style={styles.languageText}>{content.language}</Text>
                  {renderContentBadge(content.type)}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {allContents.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Content Found</Text>
              <Text style={styles.emptyText}>
                No content available for the selected filters. Try adjusting your filters.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.retryButtonText}>Change Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Content Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalType === 'pdf' ? 'Document Viewer' : 'Image Viewer'}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {modalType === 'pdf' && selectedContent && (
            <WebView
              source={{ uri: `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(selectedContent.url)}` }}
              style={styles.webView}
            />
          )}

          {modalType === 'image' && selectedContent && (
            <View style={styles.imageModalContent}>
              <Image
                source={{ uri: selectedContent.url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.gray,
  },
  scrollView: {
    flex: 1,
  },
  contentList: {
    padding: 10,
  },
  contentCard: {
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
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 150,
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
  contentInfo: {
    padding: 12,
    paddingTop: 0,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AppColors.teal,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: AppColors.white,
  },
  webView: {
    flex: 1,
  },
  imageModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.black,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
