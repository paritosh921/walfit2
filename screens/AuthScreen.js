import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/walfit_logo.png')} // Update the path if needed
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.header}>Let's Sign You In</Text>
      <Text style={styles.subheader}>Welcome Back!</Text>
      <Text style={styles.subheader}>Back to Health!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.switchButtonText}>Create Account!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150, // Adjust width and height as needed
    height: 150,
    marginBottom: 20, // Adjust spacing between logo and form
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 5,
  },
  button: {
    width: '90%',
    padding: 15,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    width: '90%',
    padding: 15,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    borderRadius: 5,
  },
  switchButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
