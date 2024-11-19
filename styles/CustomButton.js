import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: pressed ? '#D36D6D' : '#F38181' },  // Lighter color when pressed
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',  // Button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
