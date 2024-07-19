// SplashScreen.tsx

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const Splash: React.FC = () => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.navigate('/login')
    }, 1500); // Duración del splash screen
    

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/LogoApp1.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
});

export default Splash;
