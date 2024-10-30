import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CryptoJS from 'crypto-js';
import { router } from 'expo-router';
import { validarCampos, validarNombre, validarPassword, validarUsuario } from '../../utils/StringUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CrearCuenta: React.FC = () => {
  const secretKey: any = process.env.EXPO_PUBLIC_SECRET_KEY;
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const goBack = () => {
    router.back();
  };

  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    username: '',
    password: ''
  });


  useEffect(() => {

    if (validarCampos(usuario) && validarPassword(usuario.password) && validarUsuario(usuario.username) && validarNombre(usuario.nombre)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [usuario]);



  const encrypt = (txt: string) => {
    return CryptoJS.AES.encrypt(txt, secretKey).toString();
  };

  const crearCuenta = async () => {
    console.log('Creando cuenta')
    const url = `${baseUrl}/auth/crear_usuario`;
    console.log('Url ', url)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(usuario)
      });

      if (!res.ok) {
        console.log('Resultado ', res.status)
        Alert.alert(
          'Error en el servidor',
          'Ocurrio un error al intentar crear el usuario. Intenta mas tarde.',
          [{ text: 'OK' }])
        throw new Error('Network response was not ok ' + res.statusText);
      }
      const data = await res.json()
      console.log('Respuesta del servidor ', data.token)
      storeToken(data.token)
      const token = await getToken()
      console.log('Token guardado ', token)
      router.navigate('/grabarAudio');
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const storeToken = async (token: any) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  };

  // Recuperar el token
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Obteniendo token ', token)
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  };

  const redirectLogin = () => {
    router.navigate('/login');
  }


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
          <Text style={styles.title}>BIENVENIDO!</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#242424"
            value={usuario.nombre}
            onChangeText={text => setUsuario({ ...usuario, nombre: text })}
          />
          {(!validarNombre(usuario.nombre) && usuario.nombre.length > 0) && (
            <Text style={styles.nota}>El nombre de usuario no debe contener números ni caracteres especiales, además de que el máximo es de 30 caracteres.    
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#242424"
            value={usuario.username}
            onChangeText={text => setUsuario({ ...usuario, username: text })}
          />
          {(!validarUsuario(usuario.username) && usuario.username.length > 0) && (
            <Text style={styles.nota}>El usuario no debe contener caracteres especiales, debe contar con un minimo de 3 caracteres
              y un maximo de 10, no debe de contar con espacios en blanco y no debe iniciar con un número.    
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#242424"
            keyboardType="email-address"
            value={usuario.email}
            onChangeText={text => setUsuario({ ...usuario, email: text })}
          />
          <View style={styles.passwordContainer}>
          <Ionicons name="lock-closed-outline" size={30} color="#242424" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Contraseña"
              placeholderTextColor="#242424"
              secureTextEntry={showPassword}
              value={usuario.password}
              onChangeText={text => setUsuario({ ...usuario, password: text })}
            />
            
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"} size={30} color="#242424" />
            </TouchableOpacity>
          </View>
          {(!validarPassword(usuario.password) && usuario.password.length > 0) && (
            <Text style={styles.nota}>La contraseña debe contar como mínimo con 8 caracteres incluidos caracteres
              especiales, números y letras. La contraseña no debe incluir espacios en blanco.
            </Text>
          )}
          
          <TouchableOpacity style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#2A6F97' }]} onPress={crearCuenta} disabled={disabled}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={redirectLogin}>
            <Text style={styles.signInText}>¿Ya tienes una cuenta? <Text style={styles.signInLink}>Iniciar Sesión</Text></Text>
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
  inputIcon: {
    marginRight: 10,
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
    fontSize: 16
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
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 20,
    color: '#242424',
    fontSize: 16
  },
  signInLink: {
    color: '#2A6F97',
    fontWeight: 'bold',
    fontSize: 16
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  nota: {
    fontSize: 10,
    marginBottom: 10,
    color: '#808080'
  }
});

export default CrearCuenta;
