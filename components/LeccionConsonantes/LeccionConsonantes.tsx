import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import * as Speech from 'expo-speech';

interface Lesson {
  consonant: string;
  vowel: string;
  text: string;
  translation: string;
  options: string[];
  correctOption: string;
}

const lessons: Lesson[] = [
  {
    consonant: 'C',
    vowel: 'A',
    text: 'La vaca dice ___',
    translation: 'La vaca dice "ba".',
    options: ["ca", "ce", "ci", "co", "cu"],
    correctOption: "ca"
  },
  {
    consonant: 'C',
    vowel: 'E',
    text: 'El niño juega con el ___',
    translation: 'El niño juega con el "be".',
    options: ["ca", "ce", "ci", "co", "cu"],
    correctOption: "ce"
  },
  {
    consonant: 'C',
    vowel: 'I',
    text: 'El niño juega con el ___',
    translation: 'El niño juega con el "bi".',
    options: ["ca", "ce", "ci", "co", "cu"],
    correctOption: "ci"
  },
  {
    consonant: 'C',
    vowel: 'O',
    text: 'El niño juega con el ___',
    translation: 'El niño juega con el "bo".',
    options: ["ca", "ce", "ci", "co", "cu"],
    correctOption: "co"
  },
  {
    consonant: 'C',
    vowel: 'U',
    text: 'El niño juega con el ___',
    translation: 'El niño juega con el "bu".',
    options: ["ca", "ce", "ci", "co", "cu"],
    correctOption: "cu"
  },
  // Agrega más lecciones según sea necesario
];

const LeccionConsonantes: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentLesson = lessons[currentLessonIndex];
  const totalLessons = lessons.length;

  useEffect(() => {
    Speech.speak(`${currentLesson.consonant} más ${currentLesson.vowel}`, { language: 'es' });
  }, [currentLessonIndex]);

  const handleOptionSelect = (option: string) => {
    const correct = option === currentLesson.correctOption;
    setSelectedOption(option);
    setIsCorrect(correct);
    Speech.speak(correct ? 'Correcto' : 'Incorrecto', { language: 'es' });
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={(currentLessonIndex + 1) / totalLessons}
        color="#00c3ff"
        style={styles.progressBar}
      />
      <View style={styles.lessonContainer}>
        <View style={styles.lessonTextContainer}>
          <Text style={styles.lessonText}>
            {currentLesson.consonant} + {currentLesson.vowel}
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentLesson.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && (isCorrect ? styles.correctOption : styles.incorrectOption)
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
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
  lessonContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTextContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 85,
    marginBottom: 20,
    padding: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  lessonText: {
    fontSize: 90, // Ajustar tamaño de la fuente
    fontWeight: 'bold',
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 30,
    margin: 10,
    borderRadius: 10,
  },
  correctOption: {
    backgroundColor: '#58a758',
  },
  incorrectOption: {
    backgroundColor: 'red',
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

export default LeccionConsonantes;
