import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';

const lessons = [
  {
    text: 'El hombre come ___ revueltos en el desayuno.',
    translation: 'El hombre come huevos revueltos en el desayuno.',
    options: ["Manzanas", "Huevos", "Batatas", "Tomates", "Zapallos"],
    correctOption: "Huevos"
  },
  {
    text: 'La mujer bebe jugo de ___ en la mañana.',
    translation: 'La mujer bebe jugo de naranja en la mañana.',
    options: ["Naranja", "Leche", "Agua", "Café", "Té"],
    correctOption: "Naranja"
  },
  {
    text: 'El niño juega con sus amigos en el ___',
    translation: 'El niño juega con sus amigos en el parque.',
    options: ["Perro", "Gato", "Niño", "Amigos", "Parque"],
    correctOption: "Parque"
  },
  {
    text: 'La familia cena ___ los domingos por la noche.',
    translation: 'La familia cena pasta los domingos por la noche.',
    options: ["Desayuno", "Almuerzo", "Cena", "Merienda", "Pasta"],
    correctOption: "Pasta"
  }
];

const LeccionLectura = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLesson = lessons[currentLessonIndex];
  const words = currentLesson.text.split(' ');

  const handleStartReading = () => {
    setIsSpeaking(true);
    Speech.speak(currentLesson.translation, {
      language: 'es',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(option === currentLesson.correctOption);

    if (option === currentLesson.correctOption) {
      Speech.speak('¡Correcto! Continúa con la siguiente lección.', { language: 'es' });
    } else {
      Speech.speak('Incorrecto. Vuelve a intentarlo y presta atención a la lectura.', { language: 'es' });
      handleStartReading();
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    handleStartReading();
    return () => {
      Speech.stop(); // Detener cualquier audio al desmontar el componente
    };
  }, [currentLessonIndex]);

  return (
    <LinearGradient
      colors={['#e0eafc', '#f5f5f5']}
      style={styles.container}
    >
      <LinearGradient
        colors={['#f5f5f5', '#e0eafc']}
        style={styles.topGradient}
      />
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Lección {currentLessonIndex + 1}</Text>
        <Image
          style={styles.flagIcon}
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg' }}
        />
      </View>
      <Text style={styles.title}>Comida</Text>
      <Text style={styles.subtitle}>Llena los espacios en esta oración</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>
            {words.map((word, index) => (
              <Text key={index} style={styles.word}>
                {word === '___' ? (
                  selectedOption === currentLesson.correctOption ? (
                    <Text style={styles.highlightedWord}>{currentLesson.correctOption.toLowerCase()} </Text>
                  ) : (
                    ' '
                  )
                ) : (
                  `${word} `
                )}
              </Text>
            ))}
          </Text>
          <TouchableOpacity onPress={handleStartReading} style={styles.speakerButton}>
            <FontAwesome name="volume-up" size={24} color={isSpeaking ? '#1e90ff' : 'black'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.translation}>{currentLesson.translation}</Text>
        <View style={styles.optionsContainer}>
          {currentLesson.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.progressContainer}>
        {lessons.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              currentLessonIndex === index && styles.currentProgressDot,
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.pageIndicator}>{currentLessonIndex + 1} / {lessons.length}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  lessonNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flagIcon: {
    width: 30,
    height: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 110,
    zIndex: 2,
  },
  lessonContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0eafc',
    paddingVertical: 30,
    paddingHorizontal: 30,
    zIndex: 2,
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    height: 180,
    position: 'relative',
  },
  sentence: {
    fontSize: 25,
    textAlign: 'center',
    flex: 1,
  },
  word: {
    fontSize: 25,
    color: '#000',
  },
  highlightedWord: {
    fontSize: 25,
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  translation: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    zIndex: 2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  selectedOptionButton: {
    backgroundColor: '#87ceeb',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
    marginTop: 20,
  },
  progressContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    margin: 5,
  },
  currentProgressDot: {
    backgroundColor: '#05517e',
  },
  pageIndicator: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    padding: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default LeccionLectura;
