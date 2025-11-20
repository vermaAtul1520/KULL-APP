// utils/apiUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@app/constants/constant';

export const getCommunityId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 GET COMMUNITY ID - Raw userData from storage:', userData);

    if (!userData) {
      console.log('❌ GET COMMUNITY ID - No userData found in storage');
      return null;
    }

    const parsedUserData = JSON.parse(userData);
    console.log('🔍 GET COMMUNITY ID - Parsed userData:', parsedUserData);
    console.log('🔍 GET COMMUNITY ID - Community field:', parsedUserData?.community);
    console.log('🔍 GET COMMUNITY ID - Community type:', typeof parsedUserData?.community);

    // Handle both string and object formats for community
    let communityId = null;

    if (parsedUserData?.community) {
      if (typeof parsedUserData.community === 'string') {
        // Community is stored as string ID
        communityId = parsedUserData.community;
        console.log('✅ GET COMMUNITY ID - Found as STRING:', communityId);
      } else if (typeof parsedUserData.community === 'object' && parsedUserData.community._id) {
        // Community is stored as object with _id
        communityId = parsedUserData.community._id;
        console.log('✅ GET COMMUNITY ID - Found as OBJECT._id:', communityId);
      } else {
        console.log('❌ GET COMMUNITY ID - Community format not recognized:', parsedUserData.community);
      }
    } else {
      console.log('❌ GET COMMUNITY ID - No community field in userData');
    }

    console.log('🎯 GET COMMUNITY ID - FINAL RESULT:', communityId);
    return communityId;
  } catch (error) {
    console.error('❌ GET COMMUNITY ID - Error:', error);
    return null;
  }
};

export const getAuthHeaders = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`,
  };
};
