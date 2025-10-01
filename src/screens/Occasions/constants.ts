// Occasion Constants
export const OCCASION_TYPES = [
  'Family Deities',
  'Birth Details / Naming',
  'Boys Marriage',
  'Girls Marriage',
  'Death Details',
] as const;

export type OccasionType = typeof OCCASION_TYPES[number];

export const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f8f9fa',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899',
};
