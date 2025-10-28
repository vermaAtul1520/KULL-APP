import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';
import { getAuthHeaders, getCommunityId } from '@app/constants/apiUtils';

// Types
export interface ConfigurationAPIResponse {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    community: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    smaajKeTaaj: Array<{
      id: number;
      name: string;
      role?: string;
      designation?: string;
      age: number;
      fatherName?: string;
      avatar: string;
      contact?: string;
      email?: string;
      interests?: string[];
      hobbies?: string[];
      organization?: string;
      keyAchievements?: string;
      communityContribution?: string;
      awards?: string;
      location?: string;
      website?: string;
      socialLink?: string;
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    }>;
    banner: string[];
    addPopup: string;
  };
}

export interface TokenErrorResponse {
  success: false;
  message: string;
  error: string;
}

export interface ConfigurationApiError extends Error {
  status?: number;
  isTokenExpired?: boolean;
  shouldLogout?: boolean;
}

// API Service Class
export class ConfigurationApiService {
  
  /**
   * Check if response indicates token expiration
   */
  static isTokenExpired(responseData: any): boolean {
    return (
      responseData.success === false &&
      (responseData.error === 'jwt expired' ||
        responseData.message === 'Invalid or expired token' ||
        responseData.error === 'Token expired' ||
        responseData.message?.toLowerCase().includes('token') &&
        responseData.message?.toLowerCase().includes('expired'))
    );
  }

  /**
   * Handle token expiration by clearing stored tokens
   */
  static async handleTokenExpiration(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      console.log('Token cleared due to expiration');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Fetch community configuration from API
   */
  static async fetchCommunityConfiguration(): Promise<ConfigurationAPIResponse> {
    try {
      const COMMUNITY_ID = await getCommunityId();
      
      if (!COMMUNITY_ID) {
        throw new Error('Community ID not found');
      }

      console.log('Fetching community configuration for:', COMMUNITY_ID);

      const headers = await getAuthHeaders();
      
      if (!headers.Authorization) {
        const error = new Error('Authentication token not found') as ConfigurationApiError;
        error.status = 401;
        error.shouldLogout = true;
        throw error;
      }

      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`, {
        method: 'GET',
        headers,
      });

      console.log('Configuration API response status:', response.status);

      // Handle different HTTP status codes
      if (!response.ok) {
        if (response.status === 401) {
          const errorText = await response.text();
          let errorData;
          
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { success: false, message: 'Unauthorized' };
          }

          if (this.isTokenExpired(errorData)) {
            await this.handleTokenExpiration();
            const error = new Error('Token expired') as ConfigurationApiError;
            error.status = 401;
            error.isTokenExpired = true;
            error.shouldLogout = true;
            throw error;
          }
        }

        if (response.status === 404) {
          const error = new Error('Configuration not found') as ConfigurationApiError;
          error.status = 404;
          throw error;
        }

        if (response.status === 403) {
          const error = new Error('Access forbidden') as ConfigurationApiError;
          error.status = 403;
          throw error;
        }

        if (response.status >= 500) {
          const error = new Error('Server error') as ConfigurationApiError;
          error.status = response.status;
          throw error;
        }

        const error = new Error(`HTTP error! status: ${response.status}`) as ConfigurationApiError;
        error.status = response.status;
        throw error;
      }

      // Parse response
      const responseText = await response.text();
      console.log('Raw configuration response length:', responseText.length);

      let data: ConfigurationAPIResponse | TokenErrorResponse;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      // Check if parsed response indicates token expiration
      if (this.isTokenExpired(data)) {
        await this.handleTokenExpiration();
        const error = new Error('Token expired in response') as ConfigurationApiError;
        error.isTokenExpired = true;
        error.shouldLogout = true;
        throw error;
      }

      // Validate response structure
      if (!data.success) {
        throw new Error(data?.message || 'API request failed');
      }

      if (!('data' in data) || !data.data) {
        throw new Error('Invalid response structure');
      }

      console.log('Configuration fetched successfully:', {
        profilesCount: data.data.smaajKeTaaj?.length || 0,
        bannersCount: data.data.banner?.length || 0,
        hasAdPopup: !!data.data.addPopup
      });

      return data as ConfigurationAPIResponse;

    } catch (error: any) {
      console.error('ConfigurationApiService.fetchCommunityConfiguration error:', error);
      
      // Re-throw with additional context
      if (error instanceof Error && 'status' in error) {
        throw error; // Already a ConfigurationApiError
      }
      
      // Network or other errors
      const apiError = new Error(error?.message || 'Failed to fetch configuration') as ConfigurationApiError;
      if (error?.name === 'TypeError' && error?.message.includes('Network request failed')) {
        apiError.message = 'Network error - please check your connection';
      }
      throw apiError;
    }
  }

  /**
   * Test API connectivity and authentication
   */
  static async testConnection(): Promise<boolean> {
    try {
      await this.fetchCommunityConfiguration();
      return true;
    } catch (error: any) {
      console.log('API connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Retry API call with exponential backoff
   */
  static async fetchWithRetry(maxRetries = 3): Promise<ConfigurationAPIResponse> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchCommunityConfiguration();
      } catch (error: any) {
        lastError = error as Error;
        
        // Don't retry on authentication errors
        if (error.status === 401 || error.isTokenExpired || error.shouldLogout) {
          throw error;
        }
        
        // Don't retry on client errors (4xx)
        if (error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        if (attempt === maxRetries) {
          break; // Last attempt, throw the error
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Retrying configuration fetch in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

// Convenience function for direct use
export const fetchCommunityConfiguration = () => ConfigurationApiService.fetchCommunityConfiguration();

// Export default for easier importing
export default ConfigurationApiService;