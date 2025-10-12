// utils/apiUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';

export const getCommunityId = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    
    return  JSON.parse(userData)?.community?._id 
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