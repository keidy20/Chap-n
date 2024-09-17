import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

interface ResultScreenProps {
  similarityPercentage: number;
}

export default function ResultScreen({ similarityPercentage }: ResultScreenProps) {
  const router = useRouter();

  const getMessage = () => {
    if (similarityPercentage >= 90) {
      return '¡Excelente trabajo!';
    } else if (similarityPercentage >= 75) {
      return '¡Buen trabajo! Sigue mejorando.';
    } else {
      return '¡Sigue practicando para mejorar tu fluidez!';
    }
  };

  const handleTryAgain = () => {
    router.push('/fluidez-lectora'); // Cambia la ruta a la pantalla que quieras
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Resultado</Text>

      <AnimatedCircularProgress
        size={250}
        width={15}
        fill={similarityPercentage}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        rotation={0}
        style={styles.circularProgress}
      >
        {() => (
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{similarityPercentage.toFixed(2)}%</Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <Text style={styles.resultMessage}>{getMessage()}</Text>

      <Image
        source={require('../../assets/celebration.png')} // Coloca aquí una imagen de celebración, como un trofeo o medalla
        style={styles.image}
      />

      <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
        <Text style={styles.buttonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 20,
  },
  circularProgress: {
    marginVertical: 20,
  },
  percentageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#00e0ff',
  },
  resultMessage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3d5875',
    textAlign: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  tryAgainButton: {
    backgroundColor: '#00e0ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
