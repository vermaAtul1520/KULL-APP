// Family Tree API utilities
import { BASE_URL } from '@app/constants/constant';
import { getAuthHeaders } from '@app/constants/apiUtils';

/**
 * Search for users to add to family tree
 * @param query - Search term (name, email, phone, or user code) - min 2 chars
 * @returns Promise with search results
 */
export const searchUsers = async (query: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/api/family/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Add a family member (creates bidirectional relationship)
 * @param relatedUserId - ID of the user to add as family member
 * @param relationType - Type of relationship (father, mother, son, etc.)
 * @returns Promise with added family member data
 */
export const addFamilyMember = async (relatedUserId: string, relationType: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/api/family/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        relatedUserId,
        relationType,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
};

/**
 * Get organized family tree of a user
 * @param userId - Optional user ID (defaults to current user)
 * @returns Promise with family tree data organized by categories
 */
export const getFamilyTree = async (userId?: string) => {
  try {
    const headers = await getAuthHeaders();
    const url = userId
      ? `${BASE_URL}/api/family/tree/${userId}`
      : `${BASE_URL}/api/family/tree`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting family tree:', error);
    throw error;
  }
};

/**
 * Update relationship type of an existing family member
 * @param relationshipId - ID of the relationship to update
 * @param relationType - New relationship type
 * @returns Promise with updated relationship data
 */
export const updateFamilyRelationship = async (relationshipId: string, relationType: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/api/family/update/${relationshipId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        relationType,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating relationship:', error);
    throw error;
  }
};

/**
 * Remove a family member from your tree
 * @param relationshipId - ID of the relationship to remove
 * @returns Promise with success status
 */
export const removeFamilyMember = async (relationshipId: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/api/family/remove/${relationshipId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
};

/**
 * Get all available relationship types
 * @returns Array of relationship type categories
 */
export const getRelationshipTypes = () => {
  return {
    'Parents': ['father', 'mother'],
    'Children': ['son', 'daughter'],
    'Spouse': ['husband', 'wife', 'spouse'],
    'Siblings': ['brother', 'sister'],
    'Grandparents': ['grandfather', 'grandmother'],
    'Grandchildren': ['grandson', 'granddaughter'],
    'Extended': ['uncle', 'aunt', 'nephew', 'niece', 'cousin'],
    'In-laws': [
      'father-in-law', 'mother-in-law',
      'son-in-law', 'daughter-in-law',
      'brother-in-law', 'sister-in-law'
    ],
  };
};