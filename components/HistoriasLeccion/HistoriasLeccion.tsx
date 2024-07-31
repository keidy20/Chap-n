import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import * as Speech from 'expo-speech';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface StoryPart {
  audio: string; // Texto para el audio
  image: any; // Reemplaza con la imagen específica
  options: { text: string; isCorrect: boolean }[];
}

const storyParts: StoryPart[] = [
  {
    audio: 'Los niños están jugando en el parque.',
    image: require('../../assets/imagen.jpg'), // Reemplaza con tu imagen
    options: [
      { text: 'Parque', isCorrect: true },
      { text: 'Cuarto', isCorrect: false },
      { text: 'Calle', isCorrect: false },
    ],
  },
  {
    audio: 'Están jugando con una pelota.',
    image: require('../../assets/imagen.jpg'), // Reemplaza con tu imagen
    options: [
      { text: 'Pelota', isCorrect: true },
      { text: 'Ropa', isCorrect: false },
      { text: 'Libro', isCorrect: false },
    ],
  },
  // Agrega más partes de la historia según sea necesario
];

const HistoriasLeccion: React.FC = () => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [optionsEnabled, setOptionsEnabled] = useState<boolean>(false);

  const currentPart = storyParts[currentPartIndex];
  const totalParts = storyParts.length;

  // Animaciones con react-native-reanimated
  const opacity = useSharedValue(1);

  useEffect(() => {
    Speech.speak(currentPart.audio, { language: 'es' });

    // Habilitar opciones después de que termine el audio
    const timer = setTimeout(() => {
      setOptionsEnabled(true);
    }, 2000); // Ajusta el tiempo según la duración del audio

    return () => {
      clearTimeout(timer);
      Speech.stop();
    };
  }, [currentPartIndex]);

  const handleOptionSelect = (option: { text: string; isCorrect: boolean }) => {
    if (!optionsEnabled) return; // Evitar selección antes de habilitar opciones

    setSelectedOption(option.text);
    setIsCorrect(option.isCorrect);
    Speech.speak(option.isCorrect ? 'Correcto' : 'Incorrecto', { language: 'es' });
    setOptionsEnabled(false); // Deshabilitar opciones hasta que avance a la siguiente parte
  };

  const handleNextPart = () => {
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setOptionsEnabled(false); // Deshabilitar opciones hasta que inicie la siguiente parte
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={(currentPartIndex + 1) / totalParts}
        color="#00c3ff"
        style={styles.progressBar}
      />
      <View style={styles.storyContainer}>
        <Image source={currentPart.image} style={styles.image} />
        <Animated.View style={[styles.optionsContainer, animatedStyle]}>
          {currentPart.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option.text && (isCorrect ? styles.correctOption : styles.incorrectOption),
                !optionsEnabled && styles.disabledOption
              ]}
              onPress={() => handleOptionSelect(option)}
              disabled={!optionsEnabled}
              accessibilityLabel={`Seleccionar opción ${option.text}`}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPart}>
          <FontAwesome name="arrow-right" size={40} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 15,
    borderRadius: 5,
    marginVertical: 50,
    marginHorizontal: 10,
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 100,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#58a758',
  },
  incorrectOption: {
    backgroundColor: 'red',
  },
  disabledOption: {
    backgroundColor: '#ddd', // Color para opciones deshabilitadas
  },
  optionText: {
    fontSize: 24,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    width: '95%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
  },
});

export default HistoriasLeccion;
