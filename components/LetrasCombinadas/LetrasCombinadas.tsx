import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Image } from 'react-native';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

// Define el tipo para las letras posibles
type LetterKey = 'b' | 'd' | 'p' | 'q' | 'm' | 'n' | 'u' | 'v';

// Definir un tipo para ejemplos e imágenes que pueda tener solo un subconjunto de letras
interface LetterExamples {
  [key: string]: string; // Puede contener cualquier clave de tipo `string`
}

interface ImageSources {
  [key: string]: any; // Puede contener cualquier clave de tipo `string`, y `any` puede ser reemplazado por el tipo adecuado
}

interface CombinedLettersData {
  letters: string;
  examples: LetterExamples;
  images: ImageSources;
}

const combinedLettersData: CombinedLettersData[] = [
  { letters: 'b / d', examples: { b: 'bicicleta', d: 'dado' }, images: { b: require('../../assets/bicicleta.png'), d: require('../../assets/dado.png') } },
  { letters: 'p / q', examples: { p: 'pelota', q: 'queso' }, images: { p: require('../../assets/pelota.png'), q: require('../../assets/queso.png') } },
  { letters: 'm / n', examples: { m: 'mamá', n: 'niña' }, images: { m: require('../../assets/mama.png'), n: require('../../assets/niña.png') } },
  { letters: 'u / v', examples: { u: 'uniforme', v: 'vaca' }, images: { u: require('../../assets/uniforme.png'), v: require('../../assets/vaca.png') } },
  // Añadir más combinaciones si es necesario
];

const CombinedLettersLesson: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0); // Índice para la letra actual dentro de la combinación
  const [scaleAnim] = useState(new Animated.Value(1)); // Animación de escala
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de desvanecimiento
  const [imageSource, setImageSource] = useState(require('../../assets/bicicleta.png')); // Imagen inicial
  const [exampleText, setExampleText] = useState('bicicleta'); // Texto del ejemplo inicial

  const { letters, examples, images } = combinedLettersData[currentIndex];
  const letterKeys = letters.split(' / ').map(letter => letter.trim()) as LetterKey[]; // Obtener las letras como un array y asegurar el tipo

  useEffect(() => {
    updateContent(); // Actualiza el contenido cuando cambian el índice de la combinación o el índice de la letra
    speakLetter(); // Pronuncia la letra y el ejemplo correspondiente
    startAnimations(); // Inicia las animaciones cada vez que cambie la combinación actual
  }, [currentIndex, currentLetterIndex]);

  useEffect(() => {
    // Actualiza la imagen cuando cambie la letra actual
    const currentLetter = letterKeys[currentLetterIndex];
    setImageSource(images[currentLetter]);
  }, [currentLetterIndex]);

  const speakLetter = () => {
    const currentLetter = letterKeys[currentLetterIndex];
    const speechText = `${currentLetter} de ${examples[currentLetter] || ''}`;
    Speech.speak(speechText, { language: 'es' });
  };

  const startAnimations = () => {
    scaleAnim.setValue(1);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const highlightExampleText = (text: string, letter: LetterKey) => {
    // Resaltar la letra en el texto del ejemplo
    const parts = text.split(new RegExp(`(${letter})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === letter.toLowerCase() ? (
        <Text key={index} style={styles.highlightedText}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  const updateContent = () => {
    const currentLetter = letterKeys[currentLetterIndex];
    setExampleText(examples[currentLetter] || '');
  };

  const nextLetter = () => {
    if (currentLetterIndex < letterKeys.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else {
      // Si estamos en la última letra de la combinación actual, pasar a la siguiente combinación
      if (currentIndex < combinedLettersData.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentLetterIndex(0); // Reiniciar el índice de letra para la nueva combinación
      }
    }
  };

  const previousLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    } else {
      // Si estamos en la primera letra de la combinación actual, volver a la combinación anterior
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCurrentLetterIndex(letterKeys.length - 1); // Establecer el índice de letra al final de la nueva combinación
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.combinationContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.letters}>{letters}</Text>
        <Text style={styles.lettersHighlighted}>{letterKeys[currentLetterIndex]}</Text>
        <Text style={styles.example}>
          {highlightExampleText(exampleText, letterKeys[currentLetterIndex])}
        </Text>
        <Image source={imageSource} style={styles.image} />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.prevButton]}
          onPress={previousLetter}
          disabled={currentIndex === 0 && currentLetterIndex === 0}
        >
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={nextLetter}
          disabled={currentIndex === combinedLettersData.length - 1 && currentLetterIndex === letterKeys.length - 1}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  combinationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  letters: {
    fontSize: 70,
    color: '#555',
    marginBottom: 10,
  },
  lettersHighlighted: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#2A6F97',
    textAlign: 'center',
    marginBottom: 10,
  },
  example: {
    fontSize: 36,
    color: '#555',
    marginTop: 10,
  },
  highlightedText: {
    fontWeight: 'bold',
    color: '#cf161f',
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: 'contain',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 50,
  },
  prevButton: {
    backgroundColor: '#2A6F97',
  },
  nextButton: {
    backgroundColor: '#2A6F97',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CombinedLettersLesson;
