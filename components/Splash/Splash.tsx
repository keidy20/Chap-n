import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { existToken, removeToken } from '@/utils/TokenUtils';
import React, { useEffect, useState } from "react";

const Splash: React.FC = () => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      redirect()
      
    }, 1500); // Duración del splash screen

    return () => clearTimeout(timeout);
  }, []);

  const redirect = async () => {
    if (await existToken()) {
      router.navigate('/home')
    } else {
      router.navigate('/bienvenida')
    }
  }
  return (
    <LinearGradient
      colors={["#2A6F97", "#539ec9"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.image} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
});

export default Splash;