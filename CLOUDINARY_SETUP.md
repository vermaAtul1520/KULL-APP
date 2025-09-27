# Cloudinary Profile Image Upload Setup

## 📋 Required Dependencies

Add these dependencies to your project:

```bash
npm install react-native-image-picker
# For iOS, also run:
cd ios && pod install
```

## 🔧 Configuration Steps

### 1. **Update Cloudinary Config**
Edit `src/utils/cloudinaryConfig.ts` with your actual Cloudinary credentials:

```typescript
export const CLOUDINARY_CONFIG = {
  cloudName: 'YOUR_ACTUAL_CLOUD_NAME',
  apiKey: 'YOUR_ACTUAL_API_KEY',
  apiSecret: 'YOUR_ACTUAL_API_SECRET',
  uploadPreset: 'YOUR_ACTUAL_UPLOAD_PRESET',
  folder: 'profile_images',
};
```

### 2. **Android Permissions**
Add to `android/app/src/main/AndroidManifest.xml` (if not already present):

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 3. **iOS Permissions**
Add to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take profile photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select profile photos</string>
```

## 🌟 Features Added

### ✅ **Join Community Screen**
- Profile photo upload (optional)
- Image picker with camera/gallery options
- Cloudinary integration
- API payload includes `profileImage` field

### ✅ **Request Community Screen**
- Profile photo upload (optional)
- Same image picker functionality
- API payload includes `profileImage` field

### ✅ **User Profile Screen**
- Edit mode shows image picker
- View mode shows uploaded image or initials
- Profile image updates are saved to user profile

## 🔗 Backend API Changes Required

Your backend APIs need to handle the new `profileImage` field:

### **Signup API** (`/api/auth/signup`)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "profileImage": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile_images/abc123.jpg",
  // ... other fields
}
```

### **Profile Update API**
The `updateUser` function in AuthContext should send profileImage to backend for persistence.

## 🎯 How It Works

1. **User selects image** → Image Picker opens
2. **Image selected** → Automatically uploads to Cloudinary
3. **Upload success** → Returns secure Cloudinary URL
4. **URL saved** → Added to form data and sent to backend
5. **Profile displays** → Shows uploaded image or fallback to initials

## 🔄 Usage

The ImagePickerComponent is now integrated into:
- Join Community (Page 1)
- Request Community (Page 1)
- User Profile (Edit mode)

Users can upload profile photos which will be stored on Cloudinary and the URLs sent to your backend APIs.

## 🛠️ Next Steps

1. **Install dependencies**: `npm install react-native-image-picker`
2. **Update Cloudinary config** with your actual credentials
3. **Add platform permissions** for camera/gallery access
4. **Update backend** to handle `profileImage` field
5. **Test on real device** (camera access required)

---

**Note**: Make sure to test on a real device as camera functionality doesn't work on simulators/emulators.