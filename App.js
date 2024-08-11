import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import auth from firebaseConfig.js

// Import your pages
import Home from './pages/home/Home';
import LoginSignup from './pages/login/LoginSignup';

const Stack = createStackNavigator();

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('./assets/BlossomLogo.png')}
        style={{ width: 150, height: 150, borderRadius: 75 }}
      />
      <Text style={{ marginTop: 20, fontSize: 18, textAlign: 'center' }}>
        Your Dermatologist AI companion
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 10,
          backgroundColor: '#007AFF',
          borderRadius: 5,
        }}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={{ color: 'white' }}>Launch</Text>
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
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={Home} />
          </>
        ) : (
          <Stack.Screen name="LoginSignup" component={LoginSignup} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
