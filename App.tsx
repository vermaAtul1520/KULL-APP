// import {Colors, Typography} from 'react-native-ui-lib';
import React from 'react';
import {LogBox} from 'react-native';
import RootContainer from '@app/navigators';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LanguageProvider} from '@app/hooks/LanguageContext';

// For dark theme support
// require('react-native-ui-lib/config').setConfig({appScheme: 'default'});

LogBox.ignoreLogs([
  'The new TextField implementation does not support the',
  'Warning: Function components cannot be given refs.',
]);

export default function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <RootContainer />
      </GestureHandlerRootView>
    </LanguageProvider>
  );
}
