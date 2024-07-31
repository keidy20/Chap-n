import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const Splash: React.FC = () => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.navigate('/bienvenida')
    }, 1500); // Duración del splash screen
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient
      colors={['#2A6F97', '#2C7DA0', '#468FAF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/1.png')} style={styles.image} />
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
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
  },
});

export default Splash;
