import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { existToken, removeToken } from '../../utils/TokenUtils';

const { width } = Dimensions.get('window');

const CerrarSesion: React.FC = () => {

  
  const handleLogout = async () => {
    await  removeToken();
    // Lógica para cerrar sesión
    console.log("Sesión cerrada");
    router.navigate('/login'); // Cambia a la ruta que corresponda
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
            <View style={styles.iconCircle}>
              <Ionicons name="log-out-outline" size={50} color="#fff" />
            </View>
          </View>
          <Text style={styles.description}>
            ¿Estás seguro de que quieres cerrar sesión?
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#2A6F97',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#242424',
    marginBottom: 10,
  },
  description: {
    fontSize: 22,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
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
});

export default CerrarSesion;
