import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Dimensions, View, Text, ActivityIndicator, Alert, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Animated} from 'react-native';
import { Image } from 'react-native';
import KingIcon from '@app/assets/images/king.svg';
import HeadlinesIcon from '@app/assets/images/headlines.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';
import { useAuth } from '@app/navigators';
import Svg, { Path } from 'react-native-svg';
import { getCommunityId } from '@app/constants/apiUtils';
import { useNavigation } from '@react-navigation/native';
import BannerComponent from '@app/navigators/BannerComponent';
import MarqueeView from 'react-native-marquee-view';

const {width} = Dimensions.get('window');

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
interface SmaajKeTaajProfile {
  id: number;
  name: string;
  role: string;
  age: number;
  fatherName: string;
  avatar: string;
  contact?: string;
  email?: string;
  interests?: string[];
  hobbies?: string[];
}

interface CommunityConfiguration {
  _id: string;
  community: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  smaajKeTaaj: SmaajKeTaajProfile[];
  banner: string[];
}

interface ConfigurationAPIResponse {
  success: boolean;
  data: CommunityConfiguration;
}

const HomeScreen = () => {
  const { user, token } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const mainFlatListRef = useRef<FlatList>(null);

  console.log('token',token);
  

  // State for API data
  const [profileData, setProfileData] = useState<SmaajKeTaajProfile[]>([]);
  const [bannerData, setBannerData] = useState<{id: number, image: string, textColor: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal state for profile details
  const [selectedProfile, setSelectedProfile] = useState<SmaajKeTaajProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const CloseIcon = ({ size = 24, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
    </Svg>
  );

  // Fallback data
  const defaultNewsHeadlines = [
    {id: 1, text: 'Breaking: New policy announced for social welfare', category: 'Politics'},
    {id: 2, text: 'Community event this weekend - register now!', category: 'Events'},
    {id: 3, text: 'Education reforms to be implemented next month', category: 'Education'},
    {id: 4, text: 'Local business owner wins national award', category: 'Business'},
    {id: 5, text: 'Health department issues new guidelines', category: 'Health'},
  ];

  const defaultBannerData = [
    {
      id: 1,
      textColor: '#000',
      image: 'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
    },
    {
      id: 2,
      textColor: '#FFF',
      image: 'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
    }
  ];

  const defaultProfileData: SmaajKeTaajProfile[] = [
    {
      id: 11,
      name: 'Rajat Verma',
      role: 'Financial Analyst',
      age: 45,
      fatherName: '',
      avatar: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg',
    },
    {
      id: 14,
      name: 'Nandita Rao',
      role: 'Administrative',
      age: 49,
      fatherName: '',
      avatar: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg',
    }
  ];

  const newsString = defaultNewsHeadlines.map(item => `${item.text}`).join(' • ');

  // API Functions
  const getAuthHeaders = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken || token}`,
    };
  };

  const fetchCommunityConfiguration = async () => {
    try {
      setLoading(true);
      const COMMUNITY_ID = await getCommunityId();
      console.log('Fetching community configuration for:', COMMUNITY_ID);

      const headers = await getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`, {
        method: 'GET',
        headers,
      });

      console.log('Configuration API response status:', response.status, response);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Configuration not found, using default data');
          setProfileData(defaultProfileData);
          setBannerData(defaultBannerData);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw configuration response:', responseText.substring(0, 200) + '...');

      let data: ConfigurationAPIResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setProfileData(defaultProfileData);
        setBannerData(defaultBannerData);
        return;
      }

      if (data.success && data.data) {
        // Set Samaj Ke Taaj profiles
        if (data.data.smaajKeTaaj && Array.isArray(data.data.smaajKeTaaj)) {
          setProfileData(data.data.smaajKeTaaj);
          console.log('Loaded Samaj Ke Taaj profiles:', data.data.smaajKeTaaj.length);
        } else {
          setProfileData(defaultProfileData);
        }

        // Set banner data
        if (data.data.banner && Array.isArray(data.data.banner)) {
          const banners = data.data.banner.map((imageUrl, index) => ({
            id: index + 1,
            image: imageUrl,
            textColor: index % 2 === 0 ? '#000' : '#FFF'
          }));
          setBannerData(banners.length > 0 ? banners : defaultBannerData);
          console.log('Loaded banners:', banners.length);
        } else {
          setBannerData(defaultBannerData);
        }
      } else {
        console.log('Invalid API response, using default data');
        setProfileData(defaultProfileData);
        setBannerData(defaultBannerData);
      }

    } catch (error) {
      console.error('Error fetching community configuration:', error);
      
      // Use fallback data
      setProfileData(defaultProfileData);
      setBannerData(defaultBannerData);

      if (!refreshing) { // Only show alert if not refreshing
        Alert.alert(
          'Unable to Load Data',
          'Using default content. Please check your connection and try refreshing.',
          [{text: 'OK', style: 'default'}]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunityConfiguration();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommunityConfiguration();
  };

  // Handle profile click
  const handleProfileClick = (profile: SmaajKeTaajProfile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };

  // Auto-scroll banner effect
  useEffect(() => {
    if (bannerData.length === 0) return;

    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (Math.floor(Date.now() / 3000) % bannerData.length);
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  const renderBanner = ({item}: {item: {id: number, image: string, textColor: string}}) => (
    <View style={[styles.bannerSlide, {width}]}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.bannerImage}
        resizeMode="cover">
      </ImageBackground>
    </View>
  );

  const renderNewsHeadline = ({item, index}: {item: any, index: number}) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.5, 0, -width * 0.5],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('News')}
        style={styles.newsItem}
      >
        <Animated.View style={[
          styles.newsContent,
          {transform: [{translateX}], opacity}
        ]}>
          {/* <Text style={styles.newsCategory}>{item.category}</Text> */}
          <Text style={styles.newsText}>{item.text}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderProfileCard = (profile: SmaajKeTaajProfile) => (
    <TouchableOpacity 
      key={profile.id} 
      style={styles.profileCard}
      onPress={() => handleProfileClick(profile)}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{uri: profile.avatar}}
          style={styles.profileImage}
        />
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>{profile.id}</Text>
        </View>
      </View>
      <Text style={styles.profileName}>{profile.name}</Text>
      <Text style={styles.profileRole}>{profile.role}</Text>
      <Text style={styles.profileAge}>Age: {profile.age}</Text>
    </TouchableOpacity>
  );

  const renderProfileDetailsModal = () => {
    if (!selectedProfile) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profile Details</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <CloseIcon size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Profile Image and Basic Info */}
              <View style={styles.modalProfileSection}>
                <Image
                  source={{uri: selectedProfile.avatar}}
                  style={styles.modalProfileImage}
                />
                <View style={styles.modalProfileBadge}>
                  <Text style={styles.modalProfileBadgeText}>{selectedProfile.id}</Text>
                </View>
              </View>

              {/* Basic Information */}
              <View style={styles.modalInfoSection}>
                <Text style={styles.modalProfileName}>{selectedProfile.name}</Text>
                <Text style={styles.modalProfileRole}>{selectedProfile.role}</Text>
                <Text style={styles.modalProfileAge}>Age: {selectedProfile.age}</Text>
                
                {selectedProfile.fatherName && (
                  <Text style={styles.modalProfileDetail}>Father: {selectedProfile.fatherName}</Text>
                )}
              </View>

              {/* Contact Information */}
              {(selectedProfile.contact || selectedProfile.email) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Contact Information</Text>
                  {selectedProfile.contact && (
                    <View style={styles.modalDetailRow}>
                      <Icon name="phone" size={16} color="#7dd3c0" />
                      <Text style={styles.modalDetailText}>{selectedProfile.contact}</Text>
                    </View>
                  )}
                  {selectedProfile.email && (
                    <View style={styles.modalDetailRow}>
                      <Icon name="email" size={16} color="#7dd3c0" />
                      <Text style={styles.modalDetailText}>{selectedProfile.email}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Interests */}
              {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Interests</Text>
                  <View style={styles.modalTagsContainer}>
                    {selectedProfile.interests.map((interest, index) => (
                      <View key={index} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Hobbies */}
              {selectedProfile.hobbies && selectedProfile.hobbies.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Hobbies</Text>
                  <View style={styles.modalTagsContainer}>
                    {selectedProfile.hobbies.map((hobby, index) => (
                      <View key={index} style={[styles.modalTag, styles.modalHobbyTag]}>
                        <Text style={styles.modalTagText}>{hobby}</Text>
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

  const sections = [
    {
      id: 'banner',
      renderItem: () => <BannerComponent />
    },
    {
      id: 'news',
      renderItem: () => (
        <View style={styles.newsMarqueeContainer}>
          {/* <View style={styles.newsHeader}>
            <HeadlinesIcon size={20} color="#fff" />
            <Text style={styles.newsHeaderText}>Latest News</Text>
          </View> */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('News')}
            style={styles.marqueeWrapper}
          >
            <MarqueeView
              style={styles.marqueeView}
              speed={0.1}
              delay={1000}
              loop={true}
            >
              <Text style={styles.marqueeText}>{newsString}</Text>
            </MarqueeView>
          </TouchableOpacity>
        </View>
      )
    },
    {
      id: 'profiles',
      renderItem: () => (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <KingIcon size={24} color="black" />
            <Text style={styles.sectionTitle}>Samaj Ke Taj</Text>
            <TouchableOpacity 
              onPress={onRefresh} 
              style={styles.refreshButton}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#2a2a2a" />
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2a2a2a" />
              <Text style={styles.loadingText}>Loading profiles...</Text>
            </View>
          ) : (
            <View style={styles.profileGrid}>
              {profileData.map(renderProfileCard)}
            </View>
          )}
        </View>
      )
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainFlatListRef}
        data={sections}
        renderItem={({item}) => item.renderItem()}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 20}} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      
      {/* Profile Details Modal */}
      {renderProfileDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  headerBanner: {
    backgroundColor: '#f5f5dc',
  },
  bannerSlide: {
    height: 100,
    padding: 8,
    borderRadius: 20
  },
  bannerImage: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBanner: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  liveText: {
    backgroundColor: '#FF0000',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  turnoutInfo: {
    backgroundColor: '#f5f5dc',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  turnoutText: {
    color: '#000',
    fontSize: 14,
    alignSelf: 'center'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2a2a2a',
    fontFamily: 'italic',
    marginLeft: 8,
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileCard: {
    width: '48%',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#7dd3c0',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileRole: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  profileDetails: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  profileAge: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  newsMarqueeContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  marqueeWrapper: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  marqueeView: {
    height: 20,
  },
  marqueeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
  },
  newsSliderContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  newsItem: {
    width: width - 40,
    height: 80,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  newsContent: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    height: '100%',
    justifyContent: 'center',
  },
  newsCategory: {
    color: '#7dd3c0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  newsPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  newsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7dd3c0',
    marginHorizontal: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    padding: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalProfileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalProfileBadge: {
    position: 'absolute',
    bottom: 15,
    right: width * 0.5 - 70,
    backgroundColor: '#7dd3c0',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProfileBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalProfileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileRole: {
    fontSize: 18,
    color: '#7dd3c0',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileAge: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileDetail: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7dd3c0',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalTag: {
    backgroundColor: '#3a3a3a',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: '#7dd3c0',
  },
  modalHobbyTag: {
    borderColor: '#ff8c00',
  },
  modalTagText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HomeScreen;