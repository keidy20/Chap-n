import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const LeccionCompletada: React.FC = () => {

  const handleHome = () => {
    router.navigate('/home');
  };
  return (
    <LinearGradient
      colors={['#2A6F97', '#e2dddd', '#2A6F97']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.levelText}>Módulo 1</Text>
        <Text style={styles.completedText}>¡COMPLETADO!</Text>
        <View style={styles.starsContainer}>
          <FontAwesome name="star" size={60} color="#FFD700" />
          <FontAwesome name="star" size={80} color="#FFD700" />
          <FontAwesome name="star" size={60} color="#FFD700" />
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>PUNTOS</Text>
          <Text style={styles.score}>100</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>Tiempo gastado: 00:00:21</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleHome}>
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#05517e',
  },
  statsContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#05517e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeccionCompletada;
