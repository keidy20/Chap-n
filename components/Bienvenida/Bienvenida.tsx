import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { existToken } from '../../utils/TokenUtils';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');
const scale = width / 375;  // Basado en un ancho de referencia de iPhone 8 (375px)

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const Bienvenida: React.FC = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const redirect = async () => {
    if (await existToken()) {
      router.navigate('/home');
    } else {
      console.log("NO EXISTE TOKEN");
      setIsLoading(false);
    }
  };

  const playWelcomeAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/Bienvenida.mp3') // Ruta de tu archivo de audio
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    redirect();
    playWelcomeAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      console.log('Audio detenido');
    }
  };

  const handleContinue = async () => {
    await stopAudio();
    router.navigate('/login');
  };

  const handleCreateAccount = async () => {
    await stopAudio();
    router.navigate('/crear_cuenta');
  };

  return (
    <LinearGradient colors={['#2A6F97', '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={require('../../assets/bombilla1.png')} style={styles.avatar} />
        <View style={styles.card}>
          <Text style={styles.welcomeText}>HOLA!</Text>
          <Text style={styles.subtitle}>¡Vamos a mejorar la fluidez lectora juntos! Empecemos</Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.createAccountButton]} onPress={handleCreateAccount}>
            <Text style={[styles.buttonText, styles.createAccountButtonText]}>CREAR CUENTA</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: normalize(20),
  },
  avatar: {
    width: width * 0.6,  // 60% del ancho de la pantalla
    height: height * 0.3,  // 30% del alto de la pantalla
    marginTop: normalize(40),
    resizeMode: 'contain',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: normalize(20),
    padding: normalize(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  welcomeText: {
    fontSize: normalize(30),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(18),
    textAlign: 'center',
    color: '#242424',
    marginBottom: normalize(10),
  },
  button: {
    backgroundColor: '#2A6F97',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(50),
    borderRadius: normalize(30),
    marginTop: normalize(10),
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: normalize(15),
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2A6F97',
  },
  createAccountButtonText: {
    color: '#2A6F97',
  },
});

export default Bienvenida;