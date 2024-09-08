import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const OpcionesPrimeraLeccion = () => {

    const handleGoBack = () => {
        router.back(); // Esto asume que estás utilizando React Navigation para gestionar la navegación
      };

    const redirectReconocerLetra = () => {
    router.navigate('/repasoDeLetras');
    };

    const redirectQuiz = () => {
    router.navigate('/quizPrimeraLeccion');
    };

  return (
    <View style={styles.container}>
      {/* Opción "Reconocer la Letra" */}
      <TouchableOpacity style={styles.optionContainer} onPress={redirectReconocerLetra}>
        <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.optionBackground}>
          <View style={styles.iconContainer}>
            <FontAwesome name="pencil" size={40} color="#fff" />
          </View>
          <Text style={styles.optionText}>Reconocer la Letra</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Opción "Quiz" */}
      <TouchableOpacity style={styles.optionContainer} onPress={redirectQuiz}>
        <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.optionBackground}>
          <View style={styles.iconContainer}>
            <FontAwesome name="question-circle" size={40} color="#fff" />
          </View>
          <Text style={styles.optionText}>Quiz</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón de regresar */}
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <View style={styles.goBackCircle}>
          <Ionicons name="arrow-back" size={24} color="#2A6F97" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  optionContainer: {
    width: '80%',
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  optionBackground: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  optionText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
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
});

export default OpcionesPrimeraLeccion;
