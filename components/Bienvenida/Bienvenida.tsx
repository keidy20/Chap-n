import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';
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
    // Navegar a la pantalla de inicio de sesión u otra acción
  };

  const handleCreateAccount = () => {
    console.log('Crear cuenta presionado');
    // Navegar a la pantalla de creación de cuenta u otra acción
  };

  return (
    <LinearGradient
      colors={['#637cb4', '#3a5692', '#213b83']}
      style={styles.container}
    >
      <Text style={styles.title}>EDÚCATE CHAPÍN</Text>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/imagen.jpg')} 
          style={styles.avatar}
        />
      </View>
      <TouchableOpacity
        onPress={() => Speech.speak('Bienvenido a Edùcate Chapìn. ¡Vamos a aprender a leer juntos!', { language: 'es' })}
        style={styles.speakerIcon}
      >
        <FontAwesome name="volume-up" size={30} color={isSpeaking ? '#1e90ff' : 'black'} />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>¡BIENVENIDO!</Text>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>INICIAR SESIÓN </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.createAccountButton]} onPress={handleCreateAccount}>
        <Text style={[styles.buttonText, styles.createAccountButtonText]}>CREAR CUENTA</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 30,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  speakerIcon: {
    position: 'absolute',
    top: 60,
    right: 25,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: '#fff',
  },
  createAccountButtonText: {
    color: '#FF5722',
  },
});

export default Bienvenida;
