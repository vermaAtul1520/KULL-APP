// utils/apiUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@app/constants/constant';

export const getCommunityId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    console.log('🔍 COMMUNITY DEBUG - Raw userData from storage:', userData);

    if (!userData) {
      console.log('🔍 COMMUNITY DEBUG - No userData found in storage');
      return null;
    }

    const parsedUserData = JSON.parse(userData);
    console.log('🔍 COMMUNITY DEBUG - Parsed userData:', parsedUserData);
    console.log(
      '🔍 COMMUNITY DEBUG - Community field:',
      parsedUserData?.community,
    );
    console.log(
      '🔍 COMMUNITY DEBUG - Community ID:',
      parsedUserData?.community?._id,
    );

    return parsedUserData?.community?._id;
  } catch (error) {
    console.error('Error getting community ID:', error);
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
