import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  return (
    <LinearGradient
      colors={['#56BBE1', '#285769']}
      style={styles.container}
    >
      <Icon name="user" size={100} color="#fff" style={styles.icon} />
      <Text style={styles.title}>EDÚCATE CHAPÍN</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={['#ff6600', '#F49726']}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingHorizontal: 30
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#db4437',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;


