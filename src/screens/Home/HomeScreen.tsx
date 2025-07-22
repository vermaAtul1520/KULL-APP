import React, {useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Dimensions} from 'react-native';
import {Colors, Text, View, Image, Card} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Animated} from 'react-native';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const flatListRef = useRef(null);

  const scrollX = useRef(new Animated.Value(0)).current;
  const mainFlatListRef = useRef(null);

  const newsHeadlines = [
    {id: 1, text: 'Breaking: New policy announced for social welfare', category: 'Politics'},
    {id: 2, text: 'Community event this weekend - register now!', category: 'Events'},
    {id: 3, text: 'Education reforms to be implemented next month', category: 'Education'},
    {id: 4, text: 'Local business owner wins national award', category: 'Business'},
    {id: 5, text: 'Health department issues new guidelines', category: 'Health'},
  ];
  
  const bannerData = [
    {
      id: 1,
      title: 'India dekh raha hai',
      liveText: 'LIVE',
      backgroundColor: '#FFD700',
      textColor: '#000',
      image: 'https://via.placeholder.com/400x120/FFD700/000000?text=Idea+4G',
    },
    {
      id: 2,
      title: 'Election Updates',
      liveText: 'LIVE',
      backgroundColor: '#FF6B6B',
      textColor: '#FFF',
      image: 'https://via.placeholder.com/400x120/FF6B6B/FFFFFF?text=Election+2024',
    },
    {
      id: 3,
      title: 'Samaj Seva',
      liveText: 'NEW',
      backgroundColor: '#4ECDC4',
      textColor: '#000',
      image: 'https://via.placeholder.com/400x120/4ECDC4/000000?text=Samaj+Seva',
    },
    {
      id: 4,
      title: 'Breaking News',
      liveText: 'LIVE',
      backgroundColor: '#45B7D1',
      textColor: '#FFF',
      image: 'https://via.placeholder.com/400x120/45B7D1/FFFFFF?text=Breaking+News',
    },
    {
      id: 5,
      title: 'Community Events',
      liveText: 'ACTIVE',
      backgroundColor: '#96CEB4',
      textColor: '#000',
      image: 'https://via.placeholder.com/400x120/96CEB4/000000?text=Community+Events',
    },
    {
      id: 6,
      title: 'Daily Updates',
      liveText: 'LIVE',
      backgroundColor: '#FFEAA7',
      textColor: '#000',
      image: 'https://via.placeholder.com/400x120/FFEAA7/000000?text=Daily+Updates',
    },
  ];

  // const renderNewsHeadline = ({item, index}) => {
  //   const inputRange = [
  //     (index - 1) * width,
  //     index * width,
  //     (index + 1) * width,
  //   ];
    
  //   const translateX = scrollX.interpolate({
  //     inputRange,
  //     outputRange: [width * 0.5, 0, -width * 0.5],
  //   });

  //   const opacity = scrollX.interpolate({
  //     inputRange,
  //     outputRange: [0.5, 1, 0.5],
  //   });

  //   return (
  //     <TouchableOpacity 
  //       activeOpacity={0.8}
  //       onPress={() => console.log('News tapped:', item.id)}
  //       style={styles.newsItem}
  //     >
  //       <Animated.View style={[
  //         styles.newsContent,
  //         {transform: [{translateX}], opacity}
  //       ]}>
  //         <Text style={styles.newsCategory}>{item.category}</Text>
  //         <Text style={styles.newsText}>{item.text}</Text>
  //       </Animated.View>
  //     </TouchableOpacity>
  //   );
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: (Math.floor(Date.now() / 3000) % bannerData.length),
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // const renderBanner = ({item}) => (
  //   <View style={[styles.bannerSlide, {width}]}>
  //     <ImageBackground
  //       source={{uri: item.image}}
  //       style={styles.bannerImage}
  //       resizeMode="cover">
  //       <View style={styles.bannerContent}>
  //         <Text style={[styles.bannerTitle, {color: item.textColor}]}>{item.title}</Text>
  //         <Text style={styles.liveText}>{item.liveText}</Text>
  //       </View>
  //     </ImageBackground>
  //   </View>
  // );
  const profileData = [
    {
      id: 11,
      name: 'Rajat Verma',
      role: 'Financial Analyst',
      age: 45,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/3498db/ffffff?text=RV',
    },
    {
      id: 14,
      name: 'Nandita Rao',
      role: 'Administrative',
      age: 49,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/e74c3c/ffffff?text=NR',
    },
    {
      id: 15,
      name: 'Priya Sharma',
      role: 'Teacher',
      age: 32,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/2ecc71/ffffff?text=PS',
    },
    {
      id: 16,
      name: 'Amit Singh',
      role: 'Engineer',
      age: 28,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/f39c12/ffffff?text=AS',
    },
    {
      id: 17,
      name: 'Amit Singh',
      role: 'Engineer',
      age: 28,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/f39c12/ffffff?text=AS',
    },
    {
      id: 18,
      name: 'Amit Singh',
      role: 'Engineer',
      age: 28,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/f39c12/ffffff?text=AS',
    },
    {
      id: 19,
      name: 'Amit Singh',
      role: 'Engineer',
      age: 28,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/f39c12/ffffff?text=AS',
    },
    {
      id: 20,
      name: 'Amit Singh',
      role: 'Engineer',
      age: 28,
      fatherName: '',
      avatar: 'https://via.placeholder.com/60x60/f39c12/ffffff?text=AS',
    },
  ];

  const menuItems = [
    {name: 'Occasions', icon: 'calendar-multiple', color: '#4CAF50'},
    {name: 'Kartavya', icon: 'briefcase', color: '#2196F3'},
    {name: 'Bhajan', icon: 'music', color: '#FF9800'},
    {name: 'Laws and Decisions', icon: 'gavel', color: '#9C27B0'},
    {name: 'City Search', icon: 'city', color: '#795548'},
    {name: 'Organization Officer', icon: 'account-tie', color: '#607D8B'},
    {name: 'Education', icon: 'school', color: '#3F51B5'},
    {name: 'Employment', icon: 'briefcase-account', color: '#009688'},
    {name: 'Social Upliftment', icon: 'human-handsup', color: '#FF5722'},
    {name: 'Dukan', icon: 'store', color: '#E91E63'},
  ];

  const sections = [
    {
      id: 'banner',
      renderItem: () => (
        <View style={styles.headerBanner}>
          <FlatList
            ref={flatListRef}
            data={bannerData}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
          <View style={styles.turnoutInfo}>
            <Text style={styles.turnoutText}>turnout recorded at 39.13% till 1 pm</Text>
          </View>
        </View>
      )
    },
    {
      id: 'news',
      renderItem: () => (
        <View style={styles.newsSliderContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="newspaper" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>News Headlines</Text>
          </View>
          <Animated.FlatList
            data={newsHeadlines}
            renderItem={renderNewsHeadline}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true}
            )}
            scrollEventThrottle={16}
          />
          <View style={styles.newsPagination}>
            {newsHeadlines.map((_, i) => {
              const opacity = scrollX.interpolate({
                inputRange: [
                  (i - 1) * width,
                  i * width,
                  (i + 1) * width,
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              
              return (
                <Animated.View
                  key={i}
                  style={[styles.newsDot, {opacity}]}
                />
              );
            })}
          </View>
        </View>
      )
    },
    {
      id: 'profiles',
      renderItem: () => (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="crown" size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>Samaj Ke Taj</Text>
          </View>
          <View style={styles.profileGrid}>
            {profileData.map((profile) => (
              <TouchableOpacity key={profile.id} style={styles.profileCard}>
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
                <Text style={styles.profileDetails}>Father Name:</Text>
                <Text style={styles.profileAge}>Age: {profile.age}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )
    },
    // Add more sections here if needed
  ];

  // Render functions remain the same
  const renderBanner = ({item}) => (
    <View style={[styles.bannerSlide, {width}]}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.bannerImage}
        resizeMode="cover">
        <View style={styles.bannerContent}>
          <Text style={[styles.bannerTitle, {color: item.textColor}]}>{item.title}</Text>
          <Text style={styles.liveText}>{item.liveText}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const renderNewsHeadline = ({item, index}) => {
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
        onPress={() => console.log('News tapped:', item.id)}
        style={styles.newsItem}
      >
        <Animated.View style={[
          styles.newsContent,
          {transform: [{translateX}], opacity}
        ]}>
          <Text style={styles.newsCategory}>{item.category}</Text>
          <Text style={styles.newsText}>{item.text}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Auto-scroll banner effect remains the same
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: (Math.floor(Date.now() / 3000) % bannerData.length),
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainFlatListRef}
        data={sections}
        renderItem={({item}) => item.renderItem()}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 20}} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7dd3c0',
  },
  headerBanner: {
    backgroundColor: '#7dd3c0',
  },
  bannerSlide: {
    height: 180,
    padding: 8
  },
  bannerImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#ffc0cb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // alignSelf: 'center'
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
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
});

export default HomeScreen;