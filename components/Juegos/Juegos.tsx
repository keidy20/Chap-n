import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Definir un tipo para letras y sus imágenes
interface LetterData {
  [key: string]: {
    text: string;
    image: any; // Puedes reemplazar `any` con un tipo más específico si es necesario
  };
}

// Datos de letras con ejemplos e imágenes
const letterData: LetterData = {
  b: {
    text: 'bicicleta',
    image: require('../../assets/bicicleta.png'),
  },
  d: {
    text: 'dado',
    image: require('../../assets/dado.png'),
  },
  p: {
    text: 'pelota',
    image: require('../../assets/pelota.png'),
  },
  // Añade más letras según sea necesario
};

const LetterIdentificationGame: React.FC = () => {
  const [currentLetter, setCurrentLetter] = useState<string>('b');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    playLetterAudio();
  }, [currentLetter]);

  const playLetterAudio = () => {
    const text = letterData[currentLetter].text;
    Speech.speak(`La letra es ${currentLetter.toUpperCase()}`, { language: 'es' });
  };

  const playFeedbackAudio = (isCorrect: boolean) => {
    const feedbackText = isCorrect ? '¡Correcto!' : 'Inténtalo de nuevo';
    Speech.speak(feedbackText, { language: 'es' });
  };

  const handleLetterPress = (letter: string) => {
    if (letter === currentLetter) {
      setFeedback('¡Correcto!');
      playFeedbackAudio(true);
    } else {
      setFeedback('Inténtalo de nuevo');
      playFeedbackAudio(false);
    }
  };

  const getRandomLetter = () => {
    const letters = Object.keys(letterData);
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const nextLetter = () => {
    setCurrentLetter(getRandomLetter());
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instructions}>Escucha y selecciona la letra correcta</Text>
        <Image source={letterData[currentLetter].image} style={styles.image} />
        <Text style={styles.feedback}>{feedback}</Text>
        <View style={styles.letterContainer}>
          {Object.keys(letterData).map((letter) => (
            <TouchableOpacity key={letter} onPress={() => handleLetterPress(letter)} style={styles.letterButton}>
              <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={nextLetter}>
        <FontAwesome name="arrow-right" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Asegura que el contenido principal esté en la parte superior
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',
    width: '100%',
  },
  instructions: {
    fontSize: 22,
    marginBottom: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  feedback: {
    fontSize: 26,
    color: '#cf161f',
    marginBottom: 20,
  },
  letterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que las opciones se envuelvan en varias filas
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20, // Añade padding a los lados
  },
  letterButton: {
    backgroundColor: '#2A6F97',
    padding: 20, // Aumenta el padding
    borderRadius: 10, // Aumenta el radio de borde
    margin: 10, // Añade margen entre los botones
    width: 80, // Establece un ancho fijo para los botones
    height: 80, // Establece una altura fija para los botones
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: '#fff',
    fontSize: 32, // Aumenta el tamaño de la fuente
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 5,
    width: '90%', // Ocupa el 90% del ancho
    alignItems: 'center', // Centra el icono horizontalmente
    flexDirection: 'row', // Alinea el icono y el texto
    justifyContent: 'center', // Centra el contenido horizontalmente
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10, // Espacio entre el icono y el texto
  },
});

export default LetterIdentificationGame;
