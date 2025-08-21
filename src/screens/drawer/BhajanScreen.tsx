import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

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
};

interface BhajanVideo {
  id: string;
  title: string;
  artist: string;
  duration: string;
  views: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  category: string;
}

const bhajanVideos: BhajanVideo[] = [
  {
    id: '1',
    title: 'Shri Ram Janki',
    artist: 'Hariharan',
    duration: '4:32',
    views: '2.5M',
    youtubeUrl: 'https://www.youtube.com/watch?v=qZ30j6Tsxcs',
    thumbnailUrl: 'https://img.youtube.com/vi/qZ30j6Tsxcs/mqdefault.jpg',
    description: 'Beautiful devotional song dedicated to Lord Rama and Sita',
    category: 'Ram Bhajan'
  },
  {
    id: '2',
    title: 'Hanuman Chalisa',
    artist: 'MS Subbulakshmi',
    duration: '8:15',
    views: '5.2M',
    youtubeUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
    thumbnailUrl: 'https://img.youtube.com/vi/YQHsXMglC9A/mqdefault.jpg',
    description: 'Classical rendition of the sacred Hanuman Chalisa',
    category: 'Hanuman Bhajan'
  },
  {
    id: '3',
    title: 'Krishna Govind Hare Murari',
    artist: 'Anup Jalota',
    duration: '6:45',
    views: '3.8M',
    youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U',
    thumbnailUrl: 'https://img.youtube.com/vi/kTJczUoc26U/mqdefault.jpg',
    description: 'Soulful Krishna bhajan by the renowned Anup Jalota',
    category: 'Krishna Bhajan'
  },
  {
    id: '4',
    title: 'Om Jai Jagdish Hare',
    artist: 'Lata Mangeshkar',
    duration: '5:20',
    views: '4.1M',
    youtubeUrl: 'https://www.youtube.com/watch?v=F57P9C4SAW4',
    thumbnailUrl: 'https://img.youtube.com/vi/F57P9C4SAW4/mqdefault.jpg',
    description: 'Traditional aarti sung by the legendary Lata Mangeshkar',
    category: 'Aarti'
  },
  {
    id: '5',
    title: 'Shiva Shambho',
    artist: 'Sounds of Isha',
    duration: '7:30',
    views: '1.9M',
    youtubeUrl: 'https://www.youtube.com/watch?v=YQQ2StSwg5s',
    thumbnailUrl: 'https://img.youtube.com/vi/YQQ2StSwg5s/mqdefault.jpg',
    description: 'Powerful Shiva chant from Sounds of Isha',
    category: 'Shiva Bhajan'
  },
  {
    id: '6',
    title: 'Gayatri Mantra',
    artist: 'Deva Premal',
    duration: '9:12',
    views: '6.7M',
    youtubeUrl: 'https://www.youtube.com/watch?v=RUES6L-zk8s',
    thumbnailUrl: 'https://img.youtube.com/vi/RUES6L-zk8s/mqdefault.jpg',
    description: 'Sacred Gayatri Mantra chanted 108 times',
    category: 'Mantra'
  },
  {
    id: '7',
    title: 'Mere Banke Bihari',
    artist: 'Jagjit Singh',
    duration: '5:45',
    views: '2.3M',
    youtubeUrl: 'https://www.youtube.com/watch?v=1vDxlnJVvW8',
    thumbnailUrl: 'https://img.youtube.com/vi/1vDxlnJVvW8/mqdefault.jpg',
    description: 'Melodious Krishna bhajan by Jagjit Singh',
    category: 'Krishna Bhajan'
  },
  {
    id: '8',
    title: 'Vaishnav Jan To',
    artist: 'MS Subbulakshmi',
    duration: '4:18',
    views: '3.2M',
    youtubeUrl: 'https://www.youtube.com/watch?v=p0RQJ2nfpWg',
    thumbnailUrl: 'https://img.youtube.com/vi/p0RQJ2nfpWg/mqdefault.jpg',
    description: 'Mahatma Gandhi\'s favorite bhajan sung beautifully',
    category: 'Devotional'
  }
];

const categories = ['All', 'Ram Bhajan', 'Krishna Bhajan', 'Hanuman Bhajan', 'Shiva Bhajan', 'Aarti', 'Mantra', 'Devotional'];

export default function BhajanScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredVideos = selectedCategory === 'All' 
    ? bhajanVideos 
    : bhajanVideos.filter(video => video.category === selectedCategory);

  const extractVideoId = (url: string): string => {
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

  const openYouTubeVideo = async (url: string, title: string) => {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      Alert.alert('Error', 'Invalid YouTube URL');
      return;
    }

    const urls = [
      `youtube://watch?v=${videoId}`, // YouTube app
      `https://www.youtube.com/watch?v=${videoId}`, // Desktop YouTube
      `https://m.youtube.com/watch?v=${videoId}`, // Mobile YouTube
    ];

    // Try each URL until one works
    for (let i = 0; i < urls.length; i++) {
      try {
        await Linking.openURL(urls[i]);
        return; // Success! Exit the function
      } catch (error) {
        console.log(`Failed to open URL ${i + 1}:`, urls[i]);
        // Continue to next URL
      }
    }

    // If all URLs fail, show manual copy option
    const fallbackUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Alert.alert(
      'Cannot Auto-Open Video',
      `Unable to automatically open "${title}".\n\nVideo ID: ${videoId}\n\nPlease search for this video manually in YouTube app.`,
      [
        { text: 'OK' },
        {
          text: 'Open Browser',
          onPress: () => {
            // Force open in default browser
            if (Platform.OS === 'android') {
              Linking.openURL(`intent://www.youtube.com/watch?v=${videoId}#Intent;scheme=https;package=com.android.browser;end`);
            } else {
              Linking.openURL(fallbackUrl);
            }
          }
        }
      ]
    );
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const formatViews = (views: string) => {
    return `${views} views`;
  };

  const BhajanCard = ({ video }: { video: BhajanVideo }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => openYouTubeVideo(video.youtubeUrl, video.title)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: video.thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
          onError={() => console.log('Thumbnail failed to load for:', video.title)}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        <View style={styles.playButton}>
          <Icon name="play" size={20} color={AppColors.white} />
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <TouchableOpacity 
            onPress={() => toggleFavorite(video.id)}
            style={styles.favoriteButton}
          >
            <Icon 
              name={favorites.includes(video.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={favorites.includes(video.id) ? AppColors.danger : AppColors.gray} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.artistName}>{video.artist}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {video.description}
        </Text>
        
        <View style={styles.videoMeta}>
          <Text style={styles.viewsText}>{formatViews(video.views)}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{video.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.categoryButtonTextActive
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bhajan Collection</Text>
        <Text style={styles.headerSubtitle}>Divine music for the soul</Text>
      </View>

      <CategoryFilter />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="music-note" size={20} color={AppColors.primary} />
            <Text style={styles.statText}>{filteredVideos.length} Bhajans</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="heart" size={20} color={AppColors.danger} />
            <Text style={styles.statText}>{favorites.length} Favorites</Text>
          </View>
        </View>

        {filteredVideos.map((video) => (
          <BhajanCard key={video.id} video={video} />
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🙏 Listen with devotion and share the divine experience
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },
  categoryContainer: {
    backgroundColor: AppColors.lightGray,
    paddingVertical: 10,
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: AppColors.teal,
    borderColor: AppColors.teal,
  },
  categoryButtonText: {
    fontSize: 13,
    color: AppColors.dark,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: AppColors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: AppColors.cream,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: AppColors.dark,
    fontWeight: '500',
  },
  videoCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: AppColors.lightGray,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -18,
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.dark,
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 4,
  },
  artistName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: AppColors.gray,
    lineHeight: 16,
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 12,
    color: AppColors.gray,
  },
  categoryBadge: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: AppColors.teal,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});