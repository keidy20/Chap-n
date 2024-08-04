import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const RecuperarPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);

  // Valida que el correo electrónico sea válido
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Maneja el envío del correo para recuperación de contraseña
  const handleRecoverPassword = () => {
    if (validateEmail(email)) {
      console.log('Email:', email);
      // Aquí puedes agregar la lógica para enviar el correo de recuperación de contraseña
      router.navigate('/home');
    } else {
      console.log('Correo electrónico no válido');
    }
  };

  // Habilita o deshabilita el botón dependiendo de la validez del correo electrónico
  React.useEffect(() => {
    setDisabled(!validateEmail(email));
  }, [email]);

  const goBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#2A6F97', '#FFFFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <View style={styles.goBackCircle}>
            <Ionicons name="arrow-back" size={24} color="#2A6F97" />
          </View>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="key-outline" size={80} color="#2A6F97" />
          </View>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#242424"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#2A6F97' }]} 
            onPress={handleRecoverPassword} 
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Recuperar</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    bottom: 20,
    left: -22,
    width: 90,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A6F97',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  goBackCircle: {
    width: 40,
    height: 40,
    left: 19,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#242424',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#242424',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RecuperarPassword;
