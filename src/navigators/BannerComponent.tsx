import {useEffect, useRef} from 'react';
import {useAuth} from '.';
import {Dimensions, FlatList, ImageBackground, Text, View} from 'react-native';
import {StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const BannerComponent = () => {
  const {bannerData, bannerLoading} = useAuth();
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll banner effect
  useEffect(() => {
    if (bannerData.length === 0 || bannerLoading) return;

    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = Math.floor(Date.now() / 3000) % bannerData.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length, bannerLoading]);

  const renderBanner = ({
    item,
  }: {
    item: {id: number; image: string; textColor: string};
  }) => (
    <View style={[bannerStyles.bannerSlide, {width}]}>
      <ImageBackground
        source={{uri: item.image}}
        style={bannerStyles.bannerImage}
        resizeMode="cover"></ImageBackground>
    </View>
  );

  if (bannerLoading) {
    return (
      <View style={bannerStyles.headerBanner}>
        <View style={[bannerStyles.bannerSlide, {width}]}>
          <View
            style={[bannerStyles.bannerImage, bannerStyles.placeholderBanner]}>
            <Text style={bannerStyles.placeholderText}>Loading banners...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={bannerStyles.headerBanner}>
      <FlatList
        ref={flatListRef}
        data={bannerData}
        renderItem={renderBanner}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />
    </View>
  );
};

export default BannerComponent;

// 5. Banner component styles
const bannerStyles = StyleSheet.create({
  headerBanner: {
    backgroundColor: '#f5f5dc',
    // paddingBottom: 10,
  },
  bannerSlide: {
    height: 'auto',
    width: width,
    padding: 8,
    borderRadius: 20,
  },
  bannerImage: {
    height: 'auto',
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderBanner: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});
