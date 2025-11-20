// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dcw1kjvwd',
  apiKey: '825152265933577',
  apiSecret: '-4VzVYVtul9gU0QffNrjmLosKOo',
  uploadPreset: 'mmjl53nk',
  folder: 'profile_images',
};

// Upload URLs for Cloudinary
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
export const CLOUDINARY_VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`;