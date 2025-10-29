import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {userLogout} from '@app/redux/actions';
import {HomeTabAStackParamList} from '@app/navigators/types';
import {StoreRootState} from '@app/redux/store';
import {GlobalStyles} from '@app/constants';
import {Button} from 'react-native';

const TabA = (): React.JSX.Element => {
  const userData = useSelector(
    (state: StoreRootState) => state.user?.userData ?? {},
  );

  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeTabAStackParamList>>();

  const onLogoutPress = () => {
    dispatch(userLogout());
  };

  return (
    <View style={styles.containerBase}>
      <Button
        onPress={() => navigation.navigate('TabADetails')}
        title={`Hello, ${userData.username ?? ''}. Go to User Details`}
      />
      <Button onPress={onLogoutPress} title="Logout" />
    </View>
  );
};

const styles = StyleSheet.flatten([
  GlobalStyles,
  {
    containerBase: {
      padding: 16,
      flex: 1,
      justifyContent: 'center',
    },
  },
]) as StyleSheet.NamedStyles<any>;

export default TabA;
