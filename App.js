import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

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

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("./assets/BlossomLogo.png")}
        style={{ width: 150, height: 150, borderRadius: 75 }}
      />
      <Text style={{ marginTop: 20, fontSize: 18, textAlign: "center" }}>
        Your Dermatologist AI companion
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 10,
          backgroundColor: "#007AFF",
          borderRadius: 5,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={{ color: "white" }}>Launch</Text>
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
  );
};

export default App;
