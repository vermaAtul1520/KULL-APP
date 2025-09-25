import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ComingSoon from '@app/components/ComingSoon';

export default function CitySearchScreen() {
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