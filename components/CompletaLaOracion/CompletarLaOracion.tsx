import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

interface Lesson {
  id: number;
  oracion: string;
  audio: string;
  opciones: string[];
  opcionCorrecta: string;
}

interface LessonData {
  tipoEjercicio: string;
  titulo: string;
  contenido: {
    Ejercicios: Lesson[];
  };
}

const CompletaLaOracion = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  // Fetch de datos desde la API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${baseUrl}/ejercicios/all`);
        const data: LessonData[] = await response.json();
        console.log("OJO", data)

        // Filtra solo las lecciones con tipoLeccion "RL"
        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'CO')
          .flatMap(lesson => lesson.contenido.Ejercicios); // Accede a las lecciones dentro de 'contenido'

        if (filteredLessons.length > 0) {
          setLessons(filteredLessons); // Guardamos las lecciones filtradas
        } else {
          Alert.alert('Error', 'No se encontraron lecciones con el tipo "CO".');
        }
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las lecciones');
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const currentLessonData = lessons[currentLessonIndex];
  console.log("KEIDY", currentLessonIndex)

  const handleStartReading = (text: string) => {
    if (!lessons.length) return;
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'es',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    if (currentLessonData) {
      handleStartReading(currentLessonData.audio);
    }

    return () => {
      stopSpeech();
    };
  }, [currentLessonIndex, lessons]);

  const stopSpeech = () => {
    setIsSpeaking(false);
    Speech.stop();
  };

  const goBack = () => {
    router.back();
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === currentLesson.opcionCorrecta;
    setIsCorrect(correct);

    if (correct) {
      Speech.speak('¡Correcto! Continúa con la siguiente lección.', { language: 'es' });
      setIsNextButtonEnabled(true); // Habilita el botón "Siguiente"
    } else {
      Speech.speak('Incorrecto. Vuelve a intentarlo y presta atención a la lectura.', { language: 'es' });
      handleStartReading(currentLesson.audio);
      setIsNextButtonEnabled(false); // Mantén el botón "Siguiente" deshabilitado
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsNextButtonEnabled(false); // Deshabilita el botón "Siguiente" al pasar a la siguiente lección
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A6F97" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Verifica que currentLesson esté definido
  const currentLesson = lessons[currentLessonIndex];

  if (!currentLesson) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando lección...</Text>
      </View>
    );
  }

  const words = currentLesson.oracion.split(' ');

  return (
    <LinearGradient colors={['#e0eafc', '#f5f5f5']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Ejercicio {currentLessonIndex + 1}</Text>
      </View>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={30} color="#2A6F97" />
      </TouchableOpacity>
      <Text style={styles.subtitle}>Elije la palabra correcta que hace falta para completar la oración</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>
            {words.map((word, index) => (
              <Text key={index} style={styles.word}>
                {word === '___' ? (
                  selectedOption === currentLesson.opcionCorrecta ? (
                    <Text style={styles.highlightedWord}>
                      {currentLesson.opcionCorrecta.toLowerCase()}{' '}
                    </Text>
                  ) : (
                    <Text style={styles.placeholderOval}>_____ </Text>
                  )
                ) : (
                  `${word} `
                )}
              </Text>
            ))}
          </Text>
          <TouchableOpacity
            onPress={() => handleStartReading(currentLesson.audio)}
            style={styles.speakerButton}
          >
            <FontAwesome
              name="volume-up"
              size={24}
              color={isSpeaking ? '#1e90ff' : 'black'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.opcionesContainer}>
          {currentLesson.opciones.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionoracion}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.progressContainer}>
        {lessons.map((_: any, index: number) => (
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
        <TouchableOpacity
          style={[styles.nextButton, !isNextButtonEnabled && { backgroundColor: '#d3d3d3' }]} // Deshabilita el color del botón cuando está deshabilitado
          onPress={handleNextLesson}
          disabled={!isNextButtonEnabled} // Deshabilita el botón si isNextButtonEnabled es false
        >
          <Text style={styles.nextButtonoracion}>Siguiente</Text>
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
  flagIcon: {
    width: 30,
    height: 20,
  },
  subtitle: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 100,
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
  word: {
    fontSize: 30,
    color: '#000',
  },
  highlightedWord: {
    fontSize: 30,
    color: '#2A6F97',
    fontWeight: 'bold',
  },
  placeholderOval: {
    fontSize: 30,
    color: '#2A6F97',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2A6F97',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: 80, // Adjust width as needed
    marginRight: 5, // Add some spacing if needed
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#e0eafc',
    padding: 10,
    borderRadius: 25,
    margin: 5,
    borderWidth: 2,
    borderColor: '#2A6F97',
  },
  selectedOptionButton: {
    backgroundColor: '#81bdf8',
  },
  optionoracion: {
    fontSize: 18,
    color: '#000',
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
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonoracion: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  goBackButton: {
    position: 'absolute',
    top: 50, // Ajustar para que esté visible
    left: 10, // Margen desde el borde izquierdo
    padding: 10,
    zIndex: 10, // Asegura que el botón esté encima de otros elementos
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#2A6F97',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CompletaLaOracion;
