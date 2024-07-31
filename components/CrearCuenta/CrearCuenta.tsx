import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CryptoJS from 'crypto-js';
import { router } from 'expo-router';
import { validarCampos } from '@/utils/StringUtils';

const { width, height } = Dimensions.get('window');

const CrearCuenta: React.FC = () => {
  const secretKey: any = process.env.EXPO_PUBLIC_SECRET_KEY;
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const goBack = () => {
    router.back();
  };

  const [disabled, setDisabled] = useState(true);
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  useEffect(() => {
    if (validarCampos(usuario) && validarPassword(usuario.password)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [usuario]);

  const validarPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const encrypt = (txt: string) => {
    return CryptoJS.AES.encrypt(txt, secretKey).toString();
  };

  const crearCuenta = async () => {
    let usuarioTemp: any = { ...usuario, password: encrypt(usuario.password) };
    const url = `${baseUrl}/usuarios`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(usuarioTemp)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
    } catch (error) {
      console.log('Error ', error);
    }
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
            <Ionicons name="checkmark-circle" size={80} color="#2A6F97" />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#242424"
            value={usuario.nombre}
            onChangeText={text => setUsuario({ ...usuario, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#242424"
            keyboardType="email-address"
            value={usuario.email}
            onChangeText={text => setUsuario({ ...usuario, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Número de telefono"
            placeholderTextColor="#242424"
            keyboardType="phone-pad"
            value={usuario.telefono}
            onChangeText={text => setUsuario({ ...usuario, telefono: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#242424"
            secureTextEntry={true}
            value={usuario.password}
            onChangeText={text => setUsuario({ ...usuario, password: text })}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#2A6F97' }]} onPress={crearCuenta} disabled={disabled}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Sign in')}>
            <Text style={styles.signInText}>Ya tienes una cuenta? <Text style={styles.signInLink}>Sign in</Text></Text>
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
  signInText: {
    marginTop: 10,
    color: '#242424',
  },
  signInLink: {
    color: '#2A6F97',
    fontWeight: 'bold',
  },
});

export default CrearCuenta;
