// pages/login/LoginSignup.js
import React from "react";
import {
  Container,
  Logo,
  Button,
  ButtonText,
} from "../../styles/login/LoginSignupStyled";

const LoginSignup = ({ navigation }) => {
  return (
    <Container>
      <Logo source={require("../../assets/BlossomLogo.png")} />

      <Button color="#007AFF" onPress={() => navigation.navigate("Login")}>
        <ButtonText>Login</ButtonText>
      </Button>

      <Button color="#34C759" onPress={() => navigation.navigate("Signup")}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
    </Container>
  );
};

export default LoginSignup;
