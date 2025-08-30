import ComingSoon from '@app/components/ComingSoon';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GamesScreen = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
       <ComingSoon/>
      {/* Add your games content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default GamesScreen;