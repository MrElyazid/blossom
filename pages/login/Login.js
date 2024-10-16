// pages/login/Login.js
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import {
  Container,
  Input,
  Button,
  ButtonText,
  LinkText,
} from "../../styles/login/LoginStyled";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully!");
      // Navigation will be handled by the auth state listener in App.js
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
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
      <Button onPress={handleLogin}>
        <ButtonText>Login</ButtonText>
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <LinkText>Don't have an account? Sign up</LinkText>
      </TouchableOpacity>
    </Container>
  );
};

export default Login;
