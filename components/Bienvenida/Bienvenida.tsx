import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const Bienvenida: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const welcomeMessage = 'Bienvenido a Edùcate Chapìn. ¡Vamos a aprender a leer juntos! Empecemos';
    Speech.speak(welcomeMessage, {
      language: 'es',
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const handleContinue = () => {
    console.log('Iniciar sesión presionado');
    router.navigate('/recuperarPassword');
  };

  const handleCreateAccount = () => {
    console.log('Crear cuenta presionado');
    router.navigate('/crear_cuenta');
  };

  return (
    <LinearGradient
      colors={['#2A6F97', '#FFFFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/3.png')}
          style={styles.avatar}
        />
        <View style={styles.card}>
          <Text style={styles.welcomeText}>HOLA!</Text>
          <Text style={styles.subtitle}>¡Vamos a aprender a leer juntos! Empecemos</Text>
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
    padding: 20,
  },
  avatar: {
    width: 250,
    height: 250,
    marginTop: 110,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#242424',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#242424',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#242424',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
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
