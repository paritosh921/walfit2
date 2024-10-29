import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LogoScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000); // Changed to 3000 milliseconds (3 seconds)
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/walfit_logo.png')} // Make sure the path is correct
        style={styles.logo}
        resizeMode="contain" // Ensures the image fits within the container
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200, // Adjust width and height as needed
    height: 200,
  },
});
