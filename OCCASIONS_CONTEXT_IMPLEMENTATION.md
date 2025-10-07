# Occasions Context Implementation - Complete Guide

## Overview

The Occasions feature now uses **React Context** to manage filter state across all screens. This ensures that all filter selections are stored centrally and the API call is made with **whatever filters are available** (null values are handled properly).

---

## Architecture

### Context-Based Filter Management

```
OccasionContext (Global State)
    ├── occasionType: string | null
    ├── categoryId: string | null
    ├── categoryName: string | null
    ├── gotra: string | null
    ├── subGotra: string | null
    └── gender: string | null
```

### Flow

```
1. OccasionTypesScreen → setOccasionType()
2. CategoriesScreen → setCategory()
3. FiltersScreen → setGotraFilters()
4. GenderSelectionScreen → setGender()
5. ContentScreen → USE filters from context to make API call
```

---

## Files Created/Modified

### 1. **NEW: OccasionContext.tsx**
**Location:** `src/contexts/OccasionContext.tsx`

**Purpose:** Centralized state management for all occasion filters

**Key Features:**
- Stores all filter values (null-safe)
- Provides setter functions for each filter group
- Automatically resets downstream filters when parent filter changes
- Export `useOccasion()` hook for easy access

**Example Usage:**
```typescript
const { filters, setOccasionType, setCategory, setGotraFilters, setGender } = useOccasion();

// Set occasion type
setOccasionType("Boys Marriage");

// Set category
setCategory("cat123", "Wedding Rituals");

// Set gotra filters
setGotraFilters("Kashyap", "Branch1");

// Set gender
setGender("male");

// Read all filters
console.log(filters);
// Output:
// {
//   occasionType: "Boys Marriage",
//   categoryId: "cat123",
//   categoryName: "Wedding Rituals",
//   gotra: "Kashyap",
//   subGotra: "Branch1",
//   gender: "male"
// }
```

---

### 2. **Modified: navigators/index.tsx**

**Changes:**
- Import `OccasionProvider`
- Wrap app with `OccasionProvider`

```typescript
export default (): React.JSX.Element => {
  return (
    <AuthProvider>
      <OccasionProvider>  {/* ← Added */}
        <AppNavigator />
      </OccasionProvider>
    </AuthProvider>
  );
};
```

---

### 3. **Modified: OccasionTypesScreen.tsx**

**Changes:**
```typescript
import { useOccasion } from '@app/contexts/OccasionContext';

const { setOccasionType } = useOccasion();

const handleSelectType = (occasionType: string) => {
  setOccasionType(occasionType);  // ← Save to context
  navigation.navigate('OccasionCategories', { occasionType });
};
```

---

### 4. **Modified: CategoriesScreen.tsx**

**Changes:**
```typescript
import { useOccasion } from '@app/contexts/OccasionContext';

const { setCategory } = useOccasion();

const handleSelectCategory = (category: OccasionCategory) => {
  setCategory(category._id, category.name);  // ← Save to context
  navigation.navigate('OccasionFilters', {
    occasionType,
    categoryId: category._id,
    categoryName: category.name,
  });
};

// Auto-skip when no categories
useEffect(() => {
  if (!loading && categories.length === 0) {
    setCategory(null, null);  // ← Save null to context
    navigation.replace('OccasionFilters', {
      occasionType,
      categoryId: null,
      categoryName: null,
    });
  }
}, [loading, categories]);
```

---

### 5. **Modified: FiltersScreen.tsx**

**Changes:**
```typescript
import { useOccasion } from '@app/contexts/OccasionContext';

const { setGotraFilters } = useOccasion();

const handleContinue = () => {
  // Save to context (convert empty strings to null)
  setGotraFilters(
    selectedGotra || null,
    selectedSubGotra || null
  );

  navigation.navigate('OccasionGender', {
    occasionType,
    categoryId,
    categoryName,
    gotra: selectedGotra,
    subGotra: selectedSubGotra,
  });
};
```

---

### 6. **Modified: GenderSelectionScreen.tsx**

**Changes:**
```typescript
import { useOccasion } from '@app/contexts/OccasionContext';

const { setGender: setContextGender } = useOccasion();

const handleContinue = () => {
  // Save to context (convert empty string to null)
  setContextGender(selectedGender || null);

  navigation.navigate('OccasionContent', {
    occasionType,
    categoryId,
    categoryName,
    gotra,
    subGotra,
    gender: selectedGender,
  });
};
```

---

### 7. **Modified: ContentScreen.tsx** (Most Important!)

**Changes:**
```typescript
import { useOccasion } from '@app/contexts/OccasionContext';

export const ContentScreen = () => {
  const navigation = useNavigation();

  // Get filters from context (NOT from route params!)
  const { filters } = useOccasion();

  useEffect(() => {
    // Fetch occasions using filters from context
    fetchOccasions();
  }, []);

  const fetchOccasions = async () => {
    try {
      setLoading(true);

      // Use filters from context - pass available values to API
      const response = await OccasionApiService.fetchOccasions(
        filters.occasionType!,          // Required - always set
        filters.categoryId,              // Can be null
        filters.gotra || undefined,      // Optional
        filters.subGotra || undefined,   // Optional
        filters.gender || undefined      // Optional
      );

      setOccasions(response.data);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      Alert.alert('Error', error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  // Display filters in header
  <Text style={styles.headerTitle}>
    {filters.categoryName || filters.occasionType}
  </Text>
  <Text style={styles.headerSubtitle}>
    {filters.gotra && `${filters.gotra}${filters.subGotra ? ` - ${filters.subGotra}` : ''}`}
    {filters.gender && ` • ${filters.gender === 'male' ? 'Male' : filters.gender === 'female' ? 'Female' : 'All'}`}
  </Text>
};
```

---

## How It Works

### Example Flow: User Selects All Filters

**Step 1: Select Occasion Type**
```typescript
// User selects "Boys Marriage"
setOccasionType("Boys Marriage");

// Context state:
{
  occasionType: "Boys Marriage",
  categoryId: null,
  categoryName: null,
  gotra: null,
  subGotra: null,
  gender: null
}
```

**Step 2: Select Category**
```typescript
// User selects "Wedding Rituals"
setCategory("cat123", "Wedding Rituals");

// Context state:
{
  occasionType: "Boys Marriage",
  categoryId: "cat123",
  categoryName: "Wedding Rituals",
  gotra: null,      // ← Reset
  subGotra: null,   // ← Reset
  gender: null      // ← Reset
}
```

**Step 3: Select Gotra & SubGotra**
```typescript
// User selects gotra/subgotra
setGotraFilters("Kashyap", "Branch1");

// Context state:
{
  occasionType: "Boys Marriage",
  categoryId: "cat123",
  categoryName: "Wedding Rituals",
  gotra: "Kashyap",
  subGotra: "Branch1",
  gender: null      // ← Reset
}
```

**Step 4: Select Gender**
```typescript
// User selects "Male"
setGender("male");

// Context state:
{
  occasionType: "Boys Marriage",
  categoryId: "cat123",
  categoryName: "Wedding Rituals",
  gotra: "Kashyap",
  subGotra: "Branch1",
  gender: "male"    // ← Set
}
```

**Step 5: ContentScreen Makes API Call**
```typescript
// API call with filters from context
fetchOccasions(
  "Boys Marriage",  // occasionType
  "cat123",         // categoryId
  "Kashyap",        // gotra
  "Branch1",        // subGotra
  "male"            // gender
);

// API Request:
GET /api/occasions?occasionType=Boys%20Marriage&category=cat123&gotra=Kashyap&subGotra=Branch1&gender=male
```

---

### Example Flow: No Categories Available

**Step 1: Select Occasion Type**
```typescript
setOccasionType("Family Deities");
// Context state: { occasionType: "Family Deities", ...rest null }
```

**Step 2: Categories Screen (Auto-Skip)**
```typescript
// No categories found
setCategory(null, null);

// Context state:
{
  occasionType: "Family Deities",
  categoryId: null,     // ← null is OK!
  categoryName: null,
  gotra: null,
  subGotra: null,
  gender: null
}
```

**Step 3: Select Gotra & SubGotra**
```typescript
setGotraFilters("Kashyap", null);  // No subgotra selected

// Context state:
{
  occasionType: "Family Deities",
  categoryId: null,
  categoryName: null,
  gotra: "Kashyap",
  subGotra: null,     // ← null is OK!
  gender: null
}
```

**Step 4: Select Gender**
```typescript
setGender("");  // "All" (empty string → converted to null)

// Context state:
{
  occasionType: "Family Deities",
  categoryId: null,
  categoryName: null,
  gotra: "Kashyap",
  subGotra: null,
  gender: null        // ← null is OK!
}
```

**Step 5: ContentScreen Makes API Call**
```typescript
// API call with available filters only
fetchOccasions(
  "Family Deities",  // occasionType (required)
  null,              // categoryId (null - not sent)
  "Kashyap",         // gotra
  undefined,         // subGotra (null → undefined, not sent)
  undefined          // gender (null → undefined, not sent)
);

// API Request:
GET /api/occasions?occasionType=Family%20Deities&gotra=Kashyap
```

---

## API Service Null Handling

### Updated: occasionApi.ts

```typescript
static async fetchOccasions(
  occasionType: string,
  categoryId: string | null,  // ← Can be null
  gotra?: string,
  subGotra?: string,
  gender?: string
): Promise<OccasionsResponse> {
  const params = new URLSearchParams({
    occasionType,  // Always required
  });

  // Only add category if not null
  if (categoryId) {
    params.append('category', categoryId);
  }

  // Only add optional filters if provided
  if (gotra) params.append('gotra', gotra);
  if (subGotra) params.append('subGotra', subGotra);
  if (gender) params.append('gender', gender);

  const url = `${BASE_URL}/api/occasions?${params.toString()}`;
  // ...
}
```

---

## Benefits of Context Approach

### 1. **Centralized State**
- All filters in one place
- Easy to access from any screen
- No prop drilling needed

### 2. **Null-Safe**
- Handles missing/optional filters gracefully
- No need to check `undefined` everywhere
- API only receives non-null values

### 3. **Automatic Cleanup**
- Downstream filters reset when parent changes
- Example: Changing occasion type resets all other filters

### 4. **Flexible API Calls**
- API called with whatever filters are available
- Works with all combinations:
  - All filters present
  - Some filters null
  - Only required filters present

### 5. **Easy to Debug**
- Can console.log entire filter state
- Can see exactly what API receives
- Clear data flow

---

## Testing Scenarios

### ✅ Scenario 1: All Filters Selected
```typescript
// Filters in context:
{
  occasionType: "Boys Marriage",
  categoryId: "cat123",
  gotra: "Kashyap",
  subGotra: "Branch1",
  gender: "male"
}

// API Call:
GET /api/occasions?occasionType=Boys%20Marriage&category=cat123&gotra=Kashyap&subGotra=Branch1&gender=male
```

### ✅ Scenario 2: No Category (Auto-Skipped)
```typescript
// Filters in context:
{
  occasionType: "Family Deities",
  categoryId: null,           // ← null
  gotra: "Kashyap",
  subGotra: null,             // ← null
  gender: null                // ← null (All)
}

// API Call:
GET /api/occasions?occasionType=Family%20Deities&gotra=Kashyap
```

### ✅ Scenario 3: Minimal Filters
```typescript
// Filters in context:
{
  occasionType: "Death Details",
  categoryId: "cat456",
  gotra: null,                // ← Not selected
  subGotra: null,
  gender: "female"
}

// API Call:
GET /api/occasions?occasionType=Death%20Details&category=cat456&gender=female
```

---

## Summary

### What Changed:
❌ **Before:** Filters passed via route params, hard to manage null values
✅ **After:** Filters stored in Context, centralized and null-safe

### How It Works:
1. Each screen saves its selection to Context
2. ContentScreen reads all filters from Context
3. API called with available (non-null) filters
4. Backend receives properly formatted query string

### Result:
✅ Works with any combination of filters
✅ Null values handled properly
✅ Clean, maintainable code
✅ Easy to debug and extend

**Perfect solution for dynamic filter management!** 🎉
