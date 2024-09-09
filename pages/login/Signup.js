// pages/login/Signup.js
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  Container,
  Input,
  Button,
  ButtonText,
  LinkText
} from '../../styles/login/SignupStyled';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User account created & signed in!');
      // Navigation will be handled by the auth state listener in App.js
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Container>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button onPress={handleSignup}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <LinkText>Already have an account? Log in</LinkText>
      </TouchableOpacity>
    </Container>
  );
};

export default Signup;