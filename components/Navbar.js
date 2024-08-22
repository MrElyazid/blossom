import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.navButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.navButtonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.navButtonText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    padding: 10,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default Navbar;