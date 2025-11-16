import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {Linking} from 'react-native';
import {
  OccasionApiService,
  Occasion,
  OccasionCategory,
  OccasionContent,
} from '@app/services/occasionApi';

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
  pink: '#ec4899',
};

// Occasion Types
const OCCASION_TYPES = [
  'Family Deities',
  'Birth Details / Naming',
  'Boys Marriage',
  'Girls Marriage',
  'Death Details',
];

const OccasionsScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<string>('Boys Marriage');
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [categories, setCategories] = useState<OccasionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState<OccasionContent | null>(null);
  const [modalType, setModalType] = useState<'pdf' | 'image' | 'video'>('pdf');

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories first
      const categoriesResponse = await OccasionApiService.fetchCategories();
      setCategories(categoriesResponse.data);
      console.log('categoriesResponse', categoriesResponse);
      // Filter categories for the selected occasion type
      const relevantCategories = categoriesResponse.data.filter(
        (cat: OccasionCategory) => cat.occasionType === selectedType,
      );
      console.log('relevantCategories', relevantCategories);
      // Fetch occasions for each relevant category
      const allOccasions: Occasion[] = [];
      for (const category of relevantCategories) {
        try {
          const occasionsResponse = await OccasionApiService.fetchOccasions(
            selectedType,
            category._id,
          );
          allOccasions.push(...occasionsResponse.data);
          console.log('occasionsResponse', occasionsResponse);
        } catch (error) {
          // Continue with other categories if one fails
        }
      }
      console.log('allOccasions', allOccasions);
      
      setOccasions(allOccasions);
    } catch (error) {
      Alert.alert('Error', 'Failed to load occasions data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
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

  const renderOccasionType = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        selectedType === item && styles.typeButtonSelected,
      ]}
      onPress={() => setSelectedType(item)}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.typeButtonText,
          selectedType === item && styles.typeButtonTextSelected,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Flatten all contents from all occasions
  const allContents = occasions.flatMap(occasion =>
    occasion.contents.map(content => ({
      ...content,
      occasionId: occasion._id,
    })),
  );

  const renderContent = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.contentCard}
      onPress={() => handleOpenContent(item)}
      activeOpacity={0.8}>
      <View style={styles.contentHeader}>
        <View style={styles.contentInfo}>
          <Text style={styles.contentType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.contentLanguage}>{item.language}</Text>
        </View>
      </View>
      
      {item.type === 'image' && item.thumbnailUrl && (
        <Image
          source={{uri: item.thumbnailUrl}}
          style={styles.contentImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.contentFooter}>
        <Text style={styles.contentDescription}>
          {item.type === 'pdf' ? 'PDF Document' : 
           item.type === 'video' ? 'Video Content' : 'Image Content'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Occasions</Text>
      </View>

      <View style={styles.content}>
        {/* Occasion Types */}
        <FlatList
          data={OCCASION_TYPES}
          renderItem={renderOccasionType}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typesList}
          contentContainerStyle={styles.typesListContent}
        />

        {/* Content List */}
        <FlatList
          data={allContents}
          renderItem={renderContent}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
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
              <Text style={styles.emptyTitle}>No Content Found</Text>
              <Text style={styles.emptyText}>
                No content available for {selectedType}
              </Text>
            </View>
          }
        />
      </View>

      {/* Content Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {modalType.toUpperCase()} Content
            </Text>
          </View>
          
          {selectedContent && (
            <View style={styles.modalContent}>
              {modalType === 'pdf' ? (
                <WebView
                  source={{uri: selectedContent.url}}
                  style={styles.webView}
                />
              ) : modalType === 'image' ? (
                <Image
                  source={{uri: selectedContent.url}}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : null}
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
    backgroundColor: AppColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    color: AppColors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: AppColors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typesList: {
    marginBottom: 16,
  },
  typesListContent: {
    paddingRight: 16,
  },
  typeButton: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  typeButtonSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  typeButtonText: {
    color: AppColors.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: AppColors.white,
  },
  row: {
    justifyContent: 'space-between',
  },
  contentCard: {
    flex: 0.48,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  contentHeader: {
    padding: 12,
  },
  contentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  contentLanguage: {
    fontSize: 12,
    color: AppColors.gray,
  },
  contentImage: {
    width: '100%',
    height: 120,
  },
  contentFooter: {
    padding: 12,
  },
  contentDescription: {
    fontSize: 14,
    color: AppColors.dark,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    marginRight: 16,
    padding: 8,
  },
  closeButtonText: {
    color: AppColors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  modalImage: {
    flex: 1,
    width: '100%',
  },
});

export default OccasionsScreen;
