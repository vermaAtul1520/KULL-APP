import { useNavigation } from '@react-navigation/native';
import { useDrawerNavigation } from '@app/contexts/DrawerNavigationContext';

export const useDrawerAwareNavigation = () => {
  const navigation = useNavigation();
  const { getPreviousDrawerScreen } = useDrawerNavigation();

  const goBackToDrawer = () => {
    const previousDrawerScreen = getPreviousDrawerScreen();
    
    if (previousDrawerScreen) {
      // Navigate to the previous drawer screen
      navigation.navigate(previousDrawerScreen as never);
    } else {
      // If no previous drawer screen, go to Home
      navigation.navigate('HomeTab' as never);
    }
  };

  const goBackNormally = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTab' as never);
    }
  };

  return {
    goBackToDrawer,
    goBackNormally,
    navigation,
  };
};
