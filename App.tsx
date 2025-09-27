// import {Colors, Typography} from 'react-native-ui-lib';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import RootContainer from '@app/navigators';
import {theme} from '@constants';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { LanguageProvider } from '@app/hooks/LanguageContext';
import { ConfigurationProvider } from '@app/hooks/ConfigContext';

// For dark theme support
// require('react-native-ui-lib/config').setConfig({appScheme: 'default'});

LogBox.ignoreLogs([
  'The new TextField implementation does not support the',
  'Warning: Function components cannot be given refs.',
]);

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Colors.loadDesignTokens({primaryColor: theme?.primaryColor});
    // Colors.loadColors(theme?.colors);
    // Typography.loadTypographies(theme?.fonts);
  }, []);

  return (
    <ConfigurationProvider>
    <LanguageProvider>
    <GestureHandlerRootView style={{flex: 1}}>
      <RootContainer />
    </GestureHandlerRootView>
    </LanguageProvider>
    </ConfigurationProvider>
  );
}