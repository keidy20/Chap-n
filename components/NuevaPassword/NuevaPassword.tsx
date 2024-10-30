import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { validarPassword } from '@/utils/StringUtils';
import { changePassword } from '@/services/Services';

const { width } = Dimensions.get('window');

const IngresarToken: React.FC = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (validateToken() && validarPassword(password)) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [token, password])

  const validateToken = () => {
    return token.trim() !== '' && password.trim() !== '';
  };

  const handleChangePassword = () => {

    changePassword(token, password)

    console.log('Token:', token);
    console.log('New Password:', password);
    router.navigate('/login');
  
  };


  const goBack = () => {
    router.back();
  };

  return (
    <LinearGradient colors={['#2A6F97', '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <View style={styles.goBackCircle}>
            <Ionicons name="arrow-back" size={24} color="#2A6F97" />
          </View>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="lock-closed-outline" size={80} color="#2A6F97" />
          </View>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Token"
            placeholderTextColor="#242424"
            value={token}
            onChangeText={text => setToken(text)}
          />
          <View style={styles.passwordContainer}>
            <Ionicons name="lock-closed-outline" size={30} color="#242424" style={styles.inputIcon} />
            <TextInput
              style={styles.inputPassword}
              placeholder="Nueva Contraseña"
              placeholderTextColor="#242424"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#242424" />
            </TouchableOpacity>
          </View>
          {(!validarPassword(password) && password.length > 0) && (
            <Text style={styles.nota}>La contraseña debe contar como mínimo con 8 caracteres incluidos caracteres
              especiales, números y letras. La contraseña no debe incluir espacios en blanco.
            </Text>
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#2A6F97' }]}
            onPress={handleChangePassword}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  inputPassword: {
    flex: 1,
    color: '#242424',
  },
  inputIcon: {
    marginRight: 10,
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
  nota: {
    fontSize: 10,
    marginBottom: 10,
    color: '#808080'
  }
});

export default IngresarToken;
