// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlltMPTlMMJISUSYnWhNyJMYu4Pv0RyNI',
  authDomain: 'walfit-c6ff8.firebaseapp.com',
  projectId: 'walfit-c6ff8',
  storageBucket: 'walfit-c6ff8.appspot.com',
  messagingSenderId: '555941055092',
  appId: '1:555941055092:web:eaf6a679a9f2fb6075df21',
  measurementId: 'G-W4NK8WTFP0' // You can remove this line if you're not using other features requiring it
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app,auth };
