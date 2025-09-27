import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_CONFIG } from './cloudinaryConfig';

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToCloudinary = async (
  imageUri: string,
  fileName?: string
): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();

    // Append the image file
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName || `profile_${Date.now()}.jpg`,
    } as any);

    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    // Append folder (optional)
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    // Add timestamp for cache busting
    formData.append('timestamp', Date.now().toString());

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();

    if (response.ok && result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
      };
    } else {
      console.error('Cloudinary upload error:', result);
      return {
        success: false,
        error: result.error?.message || 'Upload failed',
      };
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: 'Network error occurred while uploading image',
    };
  }
};

// Helper function to validate image
export const validateImage = (imageUri: string): boolean => {
  if (!imageUri) return false;

  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const extension = imageUri.toLowerCase().split('.').pop();

  return validExtensions.includes(`.${extension}`);
};