import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 380;
const guidelineBaseHeight = 680;

const scale: (size: number) => number = (size) => (width / guidelineBaseWidth) * size;
const verticalScale: (size: number) => number = (size) => (height / guidelineBaseHeight) * size;
const moderateScale: (size: number) => number = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
