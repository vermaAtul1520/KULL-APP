import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from '@app/constants/scaleUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@app/navigators';
import { useLanguage } from '@app/hooks/LanguageContext'; // Add this import
import { BASE_URL } from '@app/constants/constant';
import BannerComponent from '@app/navigators/BannerComponent';
import { getAuthHeaders } from '@app/constants/apiUtils';

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

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewsResponse {
  success: boolean;
  data: NewsItem[];
}

// SVG Icon Components
const SearchIcon = ({ size = 20, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 20, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
  </Svg>
);

const NewsScreen = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage(); // Add this line
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search functionality
  useEffect(() => {
    filterNews();
  }, [searchQuery, newsData]);

  const filterNews = () => {
    if (searchQuery.trim() === '') {
      setFilteredNews(newsData);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = newsData.filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.content.toLowerCase().includes(query) ||
        news.category.toLowerCase().includes(query) ||
        `${news.author.firstName} ${news.author.lastName}`.toLowerCase().includes(query) ||
        news.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredNews(filtered);
    }
  };

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const headers = await getAuthHeaders();

      const response = await fetch(`${BASE_URL}/api/news/`, {
        method: 'GET',
        headers,
      });
      const result: NewsResponse = await response.json();

      console.log('result', result);
      
      if (result.success) {
        setNewsData(result.data);
        setFilteredNews(result.data);
      } else {
        Alert.alert(t('Error') || 'Error', t('Failed to fetch news') || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert(t('Error') || 'Error', t('Network error. Please try again.') || 'Network error. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    fetchNews(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return t('Just now') || 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}${t('h ago') || 'h ago'}`;
    } else if (diffInDays < 7) {
      return `${diffInDays}${t('d ago') || 'd ago'}`;
    } else {
      return formatDate(dateString);
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.7}>
      {/* News Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: item.imageUrl || 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg'
          }}
          style={styles.newsImage}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      {/* News Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.newsContent} numberOfLines={3}>
          {item.content}
        </Text>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 3} {t('more') || 'more'}</Text>
            )}
          </View>
        )}

        {/* Author and Date */}
        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarText}>
                {`${item.author.firstName.charAt(0)}${item.author.lastName.charAt(0)}`}
              </Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {`${item.author.firstName} ${item.author.lastName}`}
              </Text>
              <Text style={styles.publishDate}>{getTimeAgo(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery.trim() !== '' ? (t('No news matches your search') || 'No news matches your search') : (t('No news available') || 'No news available')}
      </Text>
      <Text style={styles.emptySubText}>
        {searchQuery.trim() !== '' ? (t('Try different keywords') || 'Try different keywords') : (t('Pull down to refresh') || 'Pull down to refresh')}
      </Text>
      {searchQuery.trim() !== '' && (
        <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
          <Text style={styles.clearSearchText}>{t('Clear Search') || 'Clear Search'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{t('Community News') || 'Community News'}</Text>
      <Text style={styles.headerSubtitle}>{t('Stay updated with latest happenings') || 'Stay updated with latest happenings'}</Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('Search news by title, content, author, category...') || 'Search news by title, content, author, category...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={AppColors.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <CloseIcon size={20} color={AppColors.gray} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Results Count */}
      {searchQuery.trim() !== '' && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredNews.length} {filteredNews.length !== 1 ? (t('articles') || 'articles') : (t('article') || 'article')} {t('found') || 'found'}
            {filteredNews.length !== newsData.length && ` (${t('filtered from') || 'filtered from'} ${newsData.length})`}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.teal} />
          <Text style={styles.loadingText}>{t('Loading news...') || 'Loading news...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.teal]}
            tintColor={AppColors.teal}
          />
        }
        ListHeaderComponent={() => (
          <>
            <BannerComponent />
            {renderHeader()}
            {renderSearchBar()}
          </>
        )}
        ListEmptyComponent={renderEmptyComponent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  headerContainer: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(15),
    backgroundColor: AppColors.white,
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: AppColors.black,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: AppColors.gray,
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
  
  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(3),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: AppColors.black,
    marginLeft: moderateScale(10),
    paddingVertical: 0,
  },
  clearButton: {
    padding: moderateScale(4),
  },
  resultsContainer: {
    paddingHorizontal: moderateScale(5),
    paddingTop: moderateScale(8),
  },
  resultsText: {
    fontSize: moderateScale(12),
    color: AppColors.gray,
    fontWeight: '500',
  },
  clearSearchButton: {
    backgroundColor: AppColors.teal,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(20),
    marginTop: moderateScale(15),
  },
  clearSearchText: {
    color: AppColors.white,
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  
  listContainer: {
    paddingHorizontal: moderateScale(15),
    paddingBottom: moderateScale(20),
  },
  newsCard: {
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(15),
    marginVertical: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.84),
    elevation: moderateScale(5),
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: moderateScale(200),
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
    backgroundColor: AppColors.teal,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(15),
  },
  categoryText: {
    color: AppColors.white,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  contentContainer: {
    padding: moderateScale(15),
  },
  newsTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: moderateScale(8),
    lineHeight: moderateScale(24),
  },
  newsContent: {
    fontSize: moderateScale(14),
    color: AppColors.gray,
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(12),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: moderateScale(15),
    alignItems: 'center',
  },
  tag: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(6),
    marginBottom: moderateScale(4),
  },
  tagText: {
    fontSize: moderateScale(11),
    color: AppColors.teal,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: moderateScale(11),
    color: AppColors.gray,
    fontStyle: 'italic',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: AppColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
  },
  avatarText: {
    color: AppColors.white,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: AppColors.black,
  },
  publishDate: {
    fontSize: moderateScale(12),
    color: AppColors.gray,
    marginTop: moderateScale(2),
  },
  separator: {
    height: moderateScale(1),
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: moderateScale(10),
    fontSize: moderateScale(16),
    color: AppColors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(50),
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
});

export default NewsScreen;