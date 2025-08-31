import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';
import { useAuth } from '@app/navigators';
import Svg, { Path } from 'react-native-svg';
import { getCommunityId } from '@app/constants/apiUtils';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const PlayIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 5v14l11-7z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
  </Svg>
);

const ExternalIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill={color}/>
  </Svg>
);

const MusicIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V5H12V3Z" fill={color}/>
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
interface Community {
  _id: string;
  name: string;
  code: string;
}

interface BhajanVideo {
  _id: string;
  community: Community;
  title: string;
  artist: string;
  duration: string;
  views: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BhajanAPIResponse {
  success: boolean;
  data: BhajanVideo[];
}

const BhajanScreen = () => {
  const { user, token } = useAuth();
  
  const [videos, setVideos] = useState<BhajanVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<BhajanVideo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);

  // API Functions
  const getAuthHeaders = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken || token}`,
    };
  };

  const extractYouTubeId = (url: string): string => {
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    // Handle youtube.com format
    if (url.includes('watch?v=')) {
      return url.split('watch?v=')[1].split('&')[0];
    }
    return '';
  };

  const fetchBhajanVideos = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const COMMUNITY_ID = await getCommunityId();
      console.log('Fetching bhajan videos for community:', COMMUNITY_ID);
      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/bhajans`, {
        method: 'GET',
        headers,
      });

      console.log('Bhajan API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BhajanAPIResponse = await response.json();
      console.log('Loaded bhajan videos count:', data.data?.length || 0);

      if (data.success && data.data && Array.isArray(data.data)) {
        setVideos(data.data);
      } else {
        console.log('No bhajan data available');
        setVideos([]);
      }

    } catch (error) {
      console.error('Error fetching bhajan videos:', error);
      Alert.alert(
        'Error',
        'Failed to load bhajan videos. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBhajanVideos();
  }, []);

  const onRefresh = () => {
    fetchBhajanVideos();
  };

  const openVideoInYouTube = async (youtubeUrl: string) => {
    const youtubeId = extractYouTubeId(youtubeUrl);
    const youtubeAppUrl = `vnd.youtube://watch?v=${youtubeId}`;

    try {
      // Try to open in YouTube app first
      const canOpenApp = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpenApp) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // Fallback to browser
        await Linking.openURL(youtubeUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open YouTube video');
    }
  };

  const openVideoInModal = (video: BhajanVideo) => {
    setSelectedVideo(video);
    setModalVisible(true);
    setWebViewLoading(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
    setWebViewLoading(true);
  };

  const handleVideoPress = (video: BhajanVideo) => {
    Alert.alert(
      'Play Video',
      'How would you like to watch this bhajan?',
      [
        {
          text: 'In App',
          onPress: () => openVideoInModal(video),
          style: 'default',
        },
        {
          text: 'YouTube App',
          onPress: () => openVideoInYouTube(video.youtubeUrl),
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const renderVideoCard = ({ item }: { item: BhajanVideo }) => (
    <TouchableOpacity style={styles.videoCard} onPress={() => handleVideoPress(item)}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        <View style={styles.playOverlay}>
          <PlayIcon size={24} color={AppColors.white} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.artistName}>{item.artist}</Text>
        <Text style={styles.videoStats}>{item.views} views</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVideoModal = () => {
    if (!selectedVideo) return null;

    const youtubeId = extractYouTubeId(selectedVideo.youtubeUrl);
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1`;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <StatusBar backgroundColor={AppColors.black} barStyle="light-content" />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openVideoInYouTube(selectedVideo.youtubeUrl)}
              style={styles.externalButton}
            >
              <ExternalIcon size={20} color={AppColors.white} />
              <Text style={styles.externalText}>Open in YouTube</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.videoContainer}>
            {webViewLoading && (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color={AppColors.primary} />
                <Text style={styles.loadingText}>Loading video...</Text>
              </View>
            )}
            <WebView
              source={{ uri: embedUrl }}
              style={styles.webView}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              onLoadStart={() => setWebViewLoading(true)}
              onLoad={() => setWebViewLoading(false)}
              onError={() => {
                setWebViewLoading(false);
                Alert.alert('Error', 'Failed to load video. Please try opening in YouTube app.');
              }}
            />
          </View>

          <View style={styles.modalVideoInfo}>
            <Text style={styles.modalVideoTitle}>{selectedVideo.title}</Text>
            <Text style={styles.modalArtistName}>{selectedVideo.artist}</Text>
            <Text style={styles.modalVideoDescription}>{selectedVideo.description}</Text>
            <View style={styles.modalCategoryContainer}>
              <Text style={styles.modalCategoryText}>Category: {selectedVideo.category}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading bhajans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MusicIcon size={24} color={AppColors.primary} />
        <Text style={styles.headerTitle}>Bhajan Collection</Text>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={onRefresh}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <MusicIcon size={64} color={AppColors.gray} />
              <Text style={styles.emptyTitle}>No bhajans available</Text>
              <Text style={styles.emptySubtitle}>
                Bhajan videos will appear here when available
              </Text>
            </View>
          ) : null
        }
      />

      {renderVideoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: AppColors.dark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.white,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.cream,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.gray,
  },
  listContainer: {
    padding: 16,
  },
  videoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoStats: {
    fontSize: 12,
    color: AppColors.gray,
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
  },
  separator: {
    height: 16,
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
  categoryContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: AppColors.primary,
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.black,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 40,
    backgroundColor: AppColors.dark,
  },
  closeButton: {
    padding: 8,
  },
  externalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  externalText: {
    color: AppColors.white,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoContainer: {
    height: width * 9 / 16, // 16:9 aspect ratio
    backgroundColor: AppColors.black,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.black,
    zIndex: 1,
  },
  modalVideoInfo: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.dark,
  },
  modalVideoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 8,
  },
  modalArtistName: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalVideoDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 22,
  },
  modalCategoryContainer: {
    marginTop: 12,
  },
  modalCategoryText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
});

export default BhajanScreen;