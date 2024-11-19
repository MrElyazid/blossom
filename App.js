import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Platform } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// pages
import Home from "./pages/home/Home";
import Result from "./pages/home/Result";
import Chatbot from "./pages/home/Chatbot"; // Import the Chatbot page
import Product from "./pages/products/Product";
import LoginSignup from "./pages/login/LoginSignup";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import Profile from "./pages/userProfile/Profile";
import History from "./pages/userProfile/History";
import SavedProducts from "./pages/userProfile/SavedProducts";

const Stack = createStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "black", borderLeftColor: "green" }}
      text1Style={{
        color: "white",
        fontWeight: "bold",
      }}
      text2Style={{
        color: "white",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: "black", borderLeftColor: "red" }}
      text1Style={{
        color: "white",
        fontWeight: "bold",
      }}
      text2Style={{
        color: "white",
      }}
    />
  ),
};

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      <Image
        source={require("./assets/BlossomLogo.png")}
        style={{ width: 350, height: 300, borderRadius: 75 }}
      />
      
      <Text
        style={{
          marginTop: 15,
          fontSize: 23,
          textAlign: "center",
          fontFamily: Platform.OS === "ios" ? "American Typewriter" : "serif",
        }}
      >
        YOUR DERMATOLOGIST AI COMPANION
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 10,
          paddingLeft: 67,
          paddingRight: 67,
          backgroundColor: "#E9AFB9",
          borderRadius: 20,
          fontSize: 30,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <Text
          style={{
            color: "black",
            fontFamily: Platform.OS === "ios" ? "Comic Sans MS" : "Comic Sans",
            fontSize: 20,
          }}
        >
          GET STARTED
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Result" component={Result} />
              <Stack.Screen name="Chatbot" component={Chatbot} />
              <Stack.Screen name="Product" component={Product} />
              <Stack.Screen name="SavedProducts" component={SavedProducts} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="History" component={History} />
            </>
          ) : (
            <>
              <Stack.Screen name="LoginSignup" component={LoginSignup} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;