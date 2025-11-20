import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_VIDEO_UPLOAD_URL, CLOUDINARY_CONFIG } from './cloudinaryConfig';

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface VideoUploadResponse {
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
    console.log('Cloudinary request:', `${CLOUDINARY_UPLOAD_URL}`, formData);
    const result = await response.json();

    console.log(
      'Cloudinary response:',
      result
    )

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

// Upload video to Cloudinary
export const uploadVideoToCloudinary = async (
  videoUri: string,
  fileName?: string,
  mimeType?: string
): Promise<VideoUploadResponse> => {
  try {
    const formData = new FormData();

    // Append the video file
    formData.append('file', {
      uri: videoUri,
      type: mimeType || 'video/mp4',
      name: fileName || `video_${Date.now()}.mp4`,
    } as any);

    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    // Append folder for videos (you can use a different folder for videos)
    formData.append('folder', 'appeal_videos');

    // Add timestamp for cache busting
    formData.append('timestamp', Date.now().toString());

    console.log('☁️ Uploading video to Cloudinary...', {
      uri: videoUri,
      fileName,
      mimeType,
    });

    const response = await fetch(CLOUDINARY_VIDEO_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();

    console.log('Cloudinary video response:', result);

    if (response.ok && result.secure_url) {
      console.log('✅ Video uploaded successfully:', result.secure_url);
      return {
        success: true,
        url: result.secure_url,
      };
    } else {
      console.error('❌ Cloudinary video upload error:', result);
      return {
        success: false,
        error: result.error?.message || 'Video upload failed',
      };
    }
  } catch (error) {
    console.error('💥 Video upload error:', error);
    return {
      success: false,
      error: 'Network error occurred while uploading video',
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

// Helper function to validate video
export const validateVideo = (videoUri: string): boolean => {
  if (!videoUri) return false;

  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const extension = videoUri.toLowerCase().split('.').pop();

  return validExtensions.includes(`.${extension}`);
};