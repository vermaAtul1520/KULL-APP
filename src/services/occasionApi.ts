// Occasion API Service
import { BASE_URL } from '@app/constants/constant';
import { getAuthHeaders } from '@app/constants/apiUtils';

/**
 * Response types for Occasion API
 */
export interface OccasionCategory {
  _id: string;
  name: string;
  description: string;
  occasionType: string;
  community: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Content {
  _id: string;
  type: 'pdf' | 'video' | 'image';
  url: string;
  thumbnailUrl: string;
  language: string;
}

export interface Occasion {
  _id: string;
  occasionType: string;
  category: {
    _id: string;
    name: string;
  };
  gender?: string;
  gotra?: string;
  subGotra?: string;
  contents: Content[];
  createdAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  count: number;
  data: OccasionCategory[];
  message?: string;
}

export interface OccasionsResponse {
  success: boolean;
  data: Occasion[];
  total: number;
  page: number;
  limit: number;
  count: number;
  message?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Occasion API Service Class
 */
export class OccasionApiService {
  /**
   * Fetch all categories for the current user's community
   * Backend auto-filters by user's community based on token
   * Filtering by occasionType is done on the frontend
   */
  static async fetchCategories(): Promise<CategoriesResponse> {
    try {
      const headers = await getAuthHeaders();

      if (!headers.Authorization) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${BASE_URL}/api/occasion-categories?limit=100`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        if (response.status === 404) {
          throw new Error('Categories not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      const data: CategoriesResponse = await response.json();
       console.log("Fetched occasion categories:", data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('OccasionApiService.fetchCategories error:', error);
      throw error;
    }
  }

  /**
   * Fetch occasions with filters
   * @param occasionType - Required: Type selected from Screen 1
   * @param categoryId - Required: Category ID from Screen 2
   * @param gotra - Optional: Gotra filter from Screen 3
   * @param subGotra - Optional: Sub-gotra filter from Screen 3
   * @param gender - Optional: Gender filter from Screen 3
   */

static async fetchOccasions(
  occasionType: string,
  categoryId: string | null,
  gotra?: string,
  subGotra?: string,
  gender?: string
): Promise<OccasionsResponse> {
  try {
    const headers = await getAuthHeaders();

    if (!headers.Authorization) {
      throw new Error('Authentication token not found');
    }

    // Build query parameters
    const params = new URLSearchParams({
      occasionType,
    });

    // Add category if provided (may be null when no categories exist)
    if (categoryId) {
      params.append('category', categoryId);
    }

    // Add optional filters if provided
    if (gotra) params.append('gotra', gotra);
    if (subGotra) params.append('subGotra', subGotra);
    if (gender) params.append('gender', gender);
    console.log('Fetching occasions with params:', params.toString());
    const url = `${BASE_URL}/api/occasions?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      if (response.status === 404) {
        throw new Error('Occasions not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OccasionsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch occasions');
    }

    // No contentType or language filtering here, just return data
    return data;
  } catch (error) {
    console.error('OccasionApiService.fetchOccasions error:', error);
    throw error;
  }
}
// ...existing code...
  /**
   * Fetch categories with retry logic
   */
  static async fetchCategoriesWithRetry(maxRetries = 2): Promise<CategoriesResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchCategories();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors
        if (error.message?.includes('Unauthorized')) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retry
        const delay = 1000 * attempt;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Fetch occasions with retry logic
   */
  static async fetchOccasionsWithRetry(
    occasionType: string,
    categoryId: string | null,
    gotra?: string,
    subGotra?: string,
    gender?: string,
    maxRetries = 2
  ): Promise<OccasionsResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchOccasions(occasionType, categoryId, gotra, subGotra, gender);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors
        if (error.message?.includes('Unauthorized')) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retry
        const delay = 1000 * attempt;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

// Convenience exports
export const fetchCategories = () => OccasionApiService.fetchCategories();
export const fetchOccasions = (
  occasionType: string,
  categoryId: string | null,
  gotra?: string,
  subGotra?: string,
  gender?: string
) => OccasionApiService.fetchOccasions(occasionType, categoryId, gotra, subGotra, gender);

export default OccasionApiService;
