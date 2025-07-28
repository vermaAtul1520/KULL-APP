import React from 'react';
import {GlobalStyles} from '@app/constants';
import { View } from 'react-native';
import { Text } from 'react-native';

export default function NotificationsScreen(): React.JSX.Element {
  return (
    <View style={GlobalStyles?.containerBase}>
      <Text>Notifications Screen</Text>
    </View>
  );
}
