# Occasions Module

Modular occasion management screens following the APK_OCCASION_API documentation.

## Structure

```
src/screens/Occasions/
├── OccasionTypesScreen.tsx    # Screen 1: Select occasion type (5 hardcoded options)
├── CategoriesScreen.tsx        # Screen 2: Select category (API call)
├── FiltersScreen.tsx           # Screen 3: Apply gotra/sub-gotra filters
├── ContentScreen.tsx           # Screen 4: View content (API call)
├── constants.ts                # Shared constants and colors
├── components/
│   └── OccasionIcons.tsx      # Reusable SVG icons
└── index.ts                    # Module exports
```

## API Integration

The module uses the centralized API service:
- **Service**: `src/services/occasionApi.ts`
- **Endpoints**:
  - `GET /api/occasion-categories` - Fetch categories
  - `GET /api/occasions?occasionType=...&category=...&gotra=...` - Fetch content

## Navigation Setup

Add these routes to your navigation stack:

```typescript
import {
  OccasionTypesScreen,
  CategoriesScreen,
  FiltersScreen,
  ContentScreen,
} from '@app/screens/Occasions';

// In your Stack Navigator:
<Stack.Screen name="OccasionTypes" component={OccasionTypesScreen} />
<Stack.Screen name="OccasionCategories" component={CategoriesScreen} />
<Stack.Screen name="OccasionFilters" component={FiltersScreen} />
<Stack.Screen name="OccasionContent" component={ContentScreen} />
```

## Navigation Flow

```
OccasionTypesScreen
    ↓ (occasionType)
CategoriesScreen
    ↓ (occasionType, categoryId, categoryName)
FiltersScreen
    ↓ (occasionType, categoryId, categoryName, gotra?, subGotra?, gender?)
ContentScreen
```

## Usage

Navigate to the occasion flow from anywhere:

```typescript
navigation.navigate('OccasionTypes');
```

## Features

- ✅ Hardcoded 5 occasion types (Screen 1)
- ✅ API-driven categories (Screen 2)
- ✅ Gotra/Sub-gotra/Gender filters (Screen 3)
- ✅ API-driven content display (Screen 4)
- ✅ PDF viewer with WebView
- ✅ Image viewer in modal
- ✅ Video links open externally
- ✅ Pull-to-refresh on API screens
- ✅ Loading and error states
- ✅ Empty state handling
- ✅ Retry logic in API service

## Dependencies

Required packages:
- `@react-native-picker/picker` - For dropdowns
- `@react-native-async-storage/async-storage` - For community config
- `react-native-webview` - For PDF viewing
- `react-native-svg` - For icons

Install if not present:
```bash
npm install @react-native-picker/picker @react-native-async-storage/async-storage react-native-webview react-native-svg
```

## Community Config

The filters screen expects community configuration with gotras:

```typescript
// Stored in AsyncStorage as 'communityConfig'
{
  gotras: [
    {
      name: "Kashyap",
      subGotras: ["Branch1", "Branch2"]
    },
    {
      name: "Bharadwaj",
      subGotras: ["SubA", "SubB"]
    }
  ]
}
```

## Customization

- **Colors**: Edit `constants.ts` to change the color scheme
- **Icons**: Modify `components/OccasionIcons.tsx` to update icons
- **API**: Update `src/services/occasionApi.ts` for backend changes
