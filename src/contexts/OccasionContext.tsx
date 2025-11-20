import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

// Filter state interface
export interface OccasionFilters {
  occasionType: string | null;
  categoryId: string | null;
  categoryName: string | null;
  gotra: string | null;
  subGotra: string | null;
  gender: string | null;
}

// Context interface
interface OccasionContextType {
  filters: OccasionFilters;
  occasions: any[];
  setOccasions: (occasions: any[]) => void;
  setOccasionType: (type: string) => void;
  setCategory: (id: string | null, name: string | null) => void;
  setGotraFilters: (gotra: string | null, subGotra: string | null) => void;
  setGender: (gender: string | null) => void;
  resetFilters: () => void;
}

// Initial filter state
const initialFilters: OccasionFilters = {
  occasionType: null,
  categoryId: null,
  categoryName: null,
  gotra: null,
  subGotra: null,
  gender: null,
};

// Create context
const OccasionContext = createContext<OccasionContextType | undefined>(undefined);

// Provider component
export const OccasionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<OccasionFilters>(initialFilters);
  const [occasions, setOccasions] = useState<any[]>([]);

  const setOccasionType = useCallback((type: string) => {
    setFilters(prev => ({
      ...prev,
      occasionType: type,
      // Reset downstream filters when occasion type changes
      categoryId: null,
      categoryName: null,
      gotra: null,
      subGotra: null,
      gender: null,
    }));
  }, []);

  const setCategory = useCallback((id: string | null, name: string | null) => {
    setFilters(prev => ({
      ...prev,
      categoryId: id,
      categoryName: name,
      // Reset downstream filters when category changes
      gotra: null,
      subGotra: null,
      gender: null,
    }));
  }, []);

  const setGotraFilters = useCallback((gotra: string | null, subGotra: string | null) => {
    setFilters(prev => ({
      ...prev,
      gotra,
      subGotra,
      // Reset gender when gotra changes
      gender: null,
    }));
  }, []);

  const setGender = useCallback((gender: string | null) => {
    setFilters(prev => ({
      ...prev,
      gender,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setOccasions([]);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      occasions,
      setOccasions,
      setOccasionType,
      setCategory,
      setGotraFilters,
      setGender,
      resetFilters,
    }),
    [
      filters,
      occasions,
      setOccasions,
      setOccasionType,
      setCategory,
      setGotraFilters,
      setGender,
      resetFilters,
    ],
  );

  return (
    <OccasionContext.Provider value={value}>
      {children}
    </OccasionContext.Provider>
  );
};

// Custom hook to use the context
export const useOccasion = (): OccasionContextType => {
  const context = useContext(OccasionContext);
  if (!context) {
    throw new Error('useOccasion must be used within an OccasionProvider');
  }
  return context;
};