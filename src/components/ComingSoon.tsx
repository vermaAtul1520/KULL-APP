import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// App Colors matching your existing theme
const AppColors = {
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
};

// Professional Construction/Development Icon
const DevelopmentIcon = ({ size = 80, color = AppColors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Defs>
      <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={color} stopOpacity="1" />
        <Stop offset="100%" stopColor={AppColors.teal} stopOpacity="1" />
      </LinearGradient>
    </Defs>
    
    {/* Building blocks */}
    <Path 
      d="M20 60h15v15H20zM40 45h15v30H40zM60 30h15v45H60z" 
      fill="url(#grad1)" 
      opacity="0.8"
    />
    
    {/* Crane arm */}
    <Path 
      d="M75 25h20M85 15v20M85 15l-5 5M85 15l5 5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    
    {/* Tools */}
    <Circle cx="25" cy="40" r="3" fill={color} opacity="0.6" />
    <Circle cx="35" cy="35" r="2" fill={color} opacity="0.6" />
    <Circle cx="45" cy="25" r="2.5" fill={color} opacity="0.6" />
    
    {/* Progress dots */}
    <Circle cx="15" cy="85" r="1.5" fill={color} />
    <Circle cx="25" cy="85" r="1.5" fill={color} opacity="0.7" />
    <Circle cx="35" cy="85" r="1.5" fill={color} opacity="0.4" />
  </Svg>
);

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  message?: string;
  onNotifyPress?: () => void;
  showNotifyButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming Soon",
  subtitle = "We're working on something amazing",
  message = "This feature is currently under development. Stay tuned for updates!",
  onNotifyPress,
  showNotifyButton = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main content animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loading dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Icon with pulse animation */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <DevelopmentIcon size={100} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* Animated loading dots */}
        <Animated.View 
          style={[
            styles.dotsContainer,
            { opacity: dotsAnim }
          ]}
        >
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </Animated.View>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  transform: [{
                    translateX: Animated.multiply(dotsAnim, 100),
                  }],
                },
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Development in Progress</Text>
        </View>

        {/* Optional Notify Button */}
        {showNotifyButton && (
          <TouchableOpacity 
            style={styles.notifyButton} 
            onPress={onNotifyPress}
            activeOpacity={0.8}
          >
            <Text style={styles.notifyButtonText}>Notify Me</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 30,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.lightGray,
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.85,
  },
  iconContainer: {
    marginBottom: 30,
    backgroundColor: AppColors.white,
    borderRadius: 75,
    padding: 20,
    elevation: 8,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: AppColors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.3,
  },
  message: {
    fontSize: 16,
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    maxWidth: '90%',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: AppColors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    width: 30,
    backgroundColor: AppColors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  notifyButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  notifyButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: height * 0.15,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    opacity: 0.1,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: height * 0.2,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.teal,
    opacity: 0.1,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    opacity: 0.2,
  },
});

export default ComingSoon;