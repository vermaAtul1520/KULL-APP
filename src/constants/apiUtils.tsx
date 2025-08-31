// utils/apiUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';

export const getCommunityId = async () => {
  try {
    const communityId = await AsyncStorage.getItem('communityId');
    return communityId || "687fcd98b40bf8cdac06ff97"; // fallback
  } catch (error) {
    console.error('Error getting community ID:', error);
  }
};

export const getAuthHeaders = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  };
};