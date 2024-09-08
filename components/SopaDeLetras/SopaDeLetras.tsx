import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech'; // Importa el módulo de expo-speech

const lessons = [
  { phrase: 'La luna y el s___', word: 'sol', missingLetters: ['o', 'l'] },
  { phrase: 'El ni___ juega', word: 'niño', missingLetters: ['ñ', 'o'] },
  { phrase: 'La m___ y el mar', word: 'mar', missingLetters: ['a', 'r'] },
  { phrase: 'Ella come una m___zana', word: 'manzana', missingLetters: ['a', 'n', 'z', 'a', 'n', 'a'] },
  { phrase: 'El c___rrito rojo', word: 'carrito', missingLetters: ['a', 'r', 'r', 'i', 't', 'o'] },
  { phrase: 'El p___jaro vuela', word: 'pajaro', missingLetters: ['a', 'j', 'a', 'r', 'o'] },
  { phrase: 'La flor es de c___lor', word: 'color', missingLetters: ['o', 'l', 'o', 'r'] },
  { phrase: 'El sol brilla en el c___lo', word: 'cielo', missingLetters: ['i', 'e', 'l', 'o'] },
  { phrase: 'La b___la es redonda', word: 'bola', missingLetters: ['o', 'l', 'a'] },
  { phrase: 'El perro c___mina', word: 'camina', missingLetters: ['a', 'm', 'i', 'n', 'a'] },
];

const CompleteWordInSentence = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [phrase, setPhrase] = useState(lessons[0].phrase);
  const [letters, setLetters] = useState(['e', 'l', 'a', 'o', 't', 'n', 'm', 'r', 'i', 's', 'u', 'ñ', 'c']);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const currentLesson = lessons[currentLessonIndex];

  const handleLetterPress = (letter: string) => {
    if (letter === currentLesson.missingLetters[currentLetterIndex]) {
      const updatedPhrase = phrase.replace('_', letter);
      setPhrase(updatedPhrase);
      setCurrentLetterIndex(currentLetterIndex + 1);

      if (currentLetterIndex + 1 === currentLesson.missingLetters.length) {
        handleNextLesson();
      }

      setLetters((prev) => prev.filter((l) => l !== letter));
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex + 1 < lessons.length) {
      const nextLessonIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextLessonIndex);
      setPhrase(lessons[nextLessonIndex].phrase);
      setCurrentLetterIndex(0);
      setLetters(['e', 'l', 'a', 'o', 't', 'n', 'm', 'r', 'i', 's', 'u', 'ñ', 'c']);
    } else {
      Alert.alert('¡Felicidades!', 'Has completado todas las lecciones.');
    }
  };

  const speakPhrase = (text: string) => {
    Speech.speak(text, {
      language: 'es', // Configura el idioma a español
      rate: 0.9, // Ajusta la velocidad de la voz si es necesario
    });
  };

  return (
    <LinearGradient colors={['#e0eafc', '#f5f5f5']} style={styles.container}>
      <LinearGradient colors={['#f5f5f5', '#e0eafc']} style={styles.topGradient} />
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Lección {currentLessonIndex + 1}</Text>
        <TouchableOpacity style={styles.goBackButton}>
          <View style={styles.goBackCircle}>
            <Ionicons name="arrow-back" size={24} color="#2A6F97" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Completa la palabra en la frase</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>{phrase}</Text>
          <TouchableOpacity style={styles.speakerButton} onPress={() => speakPhrase(currentLesson.phrase)}>
            <FontAwesome name="volume-up" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          <FlatList
            data={letters}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.letterButton}
                onPress={() => handleLetterPress(item)}
                disabled={currentLetterIndex >= currentLesson.missingLetters.length || !letters.includes(item)}
              >
                <Text style={styles.letterText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            numColumns={5}
          />
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
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
    marginTop: 120,
    marginBottom: 45,
    zIndex: 2,
  },
  lessonNumber: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 100,
    zIndex: 2,
  },
  goBackButton: {
    position: 'absolute',
    top: -85,
    left: -47,
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
    zIndex: 1,
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
    marginTop: -50,
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
    fontSize: 30,
    textAlign: 'center',
    flex: 1,
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0eafc',
    margin: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  letterText: {
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0eafc',
    margin: 3,
  },
  currentProgressDot: {
    backgroundColor: '#2A6F97',
  },
  footer: {
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  nextButton: {
    top: 20,
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default CompleteWordInSentence;
