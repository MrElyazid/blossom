import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const LoginSignup = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/BlossomLogo.png')}
        style={{ width: 150, height: 150, borderRadius: 75 }}
      />
      <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 10,
          backgroundColor: '#007AFF',
          borderRadius: 5,
          width: 200,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: 'white' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#34C759',
          borderRadius: 5,
          width: 200,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={{ color: 'white' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginSignup;
