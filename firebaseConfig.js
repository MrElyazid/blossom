import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnb8sSIQB9nyTkUf7yyJBNqXA8vsBhs-s",
  authDomain: "blossom-77ec5.firebaseapp.com",
  projectId: "blossom-77ec5",
  storageBucket: "blossom-77ec5.appspot.com",
  messagingSenderId: "224118477905",
  appId: "1:224118477905:web:b2ba1798b0da3a978fd470",
  measurementId: "G-TEZJTW8B4K"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };