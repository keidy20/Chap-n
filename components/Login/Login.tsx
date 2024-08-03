import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    router.navigate('/home');
  };

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
            <Ionicons name="checkmark-circle" size={80} color="#2A6F97" />
          </View>
          <Text style={styles.title}>BIENVENIDO!</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#242424" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Usuario / Correo Electrónico"
              placeholderTextColor="#242424"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#242424" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#242424"
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#242424" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Has olvidado tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>No tienes una cuenta?</Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#242424',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '10%',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#242424',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#2A6F97',
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    color: '#242424',
  },
  registerLink: {
    color: '#2A6F97',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default Login;
