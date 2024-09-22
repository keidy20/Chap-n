import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Speech from 'expo-speech';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';  
import { existToken, getToken } from '@/utils/TokenUtils';

interface Lesson {
  id: number;
  audioPregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

interface LessonData {
  id: number;
  titulo: string;
  contenido: {
    quiz: Lesson[];
    audios: any[];
  };
}

const QuizComponent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 5 segundos por pregunta
  const [isSpeaking, setIsSpeaking] = useState(false); // Controla si el audio está en reproducción
  const [loading, setLoading] = useState(true); // Estado de carga
  const { id } = useLocalSearchParams();  
  const router = useRouter();

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchLessonById = async () => {
      let token = null;
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
      } else {
        router.navigate('/home')
      }
      try {
        const response = await fetch(`${baseUrl}/lecciones/${20}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });
        const data: LessonData = await response.json();
        console.log("Marquiña ", data);

        if (data && data.contenido && data.contenido.quiz) {
          setLessons(data.contenido.quiz);  
        } else {
          Alert.alert('Error', 'No se encontraron lecciones para este ID.');
        }
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la lección.');
        setLoading(false);
      }
    };

    if (id) {
      fetchLessonById();
    }
  }, [id]);

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption === currentQuestion.answer;
      speakFeedback(isCorrect);

      setIsSpeaking(true); // Indica que el audio está en reproducción
      const currentQuestion = lessons[currentQuestionIndex];

      // Reproduce el audio de la pregunta
      Speech.speak(currentQuestion.audioPregunta, {
        language: 'es-ES', // Cambia esto a español
        voice: 'es-ES',
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          setIsSpeaking(false); // Termina de reproducir el audio
          setTimeLeft(5); // Inicia el temporizador de inmediato
        },
        onError: (error) => {
          console.error('Error al reproducir el audio:', error);
          setIsSpeaking(false); // Termina de reproducir el audio en caso de error
          setTimeLeft(5); // Inicia el temporizador de inmediato
        },
      });
    };

    speakAndStartTimer();

    // Limpiar el temporizador y estado cuando cambie la pregunta
    return () => {
      setTimeLeft(5); // Reiniciar el tiempo cuando cambie la pregunta
      setSelectedOption(null); // Limpiar la opción seleccionada
    };
  }, [currentQuestionIndex, lessons]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0 && !isSpeaking) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSpeaking) {
      handleNextQuestion(); // Pasar a la siguiente pregunta cuando se agote el tiempo
    }

    return () => clearInterval(timer); // Limpiar el cronómetro cuando cambie la pregunta o se agote el tiempo
  }, [timeLeft, isSpeaking]);

  const playSound = async (type: 'correct' | 'incorrect') => {
    const soundPath = type === 'correct'
      ? require('../../assets/Correcto.mp3')
      : require('../../assets/incorrecto.mp3');

    const { sound } = await Audio.Sound.createAsync(soundPath);
    await sound.playAsync();
  };

  const handleOptionPress = async (option: string) => {
    if (selectedOption) return; // Evitar cambiar la respuesta si ya se ha respondido

    setSelectedOption(option);
    const currentQuestion = lessons[currentQuestionIndex];
    const isCorrect = option === currentQuestion.respuestaCorrecta;

    if (isCorrect) {
      setScore(score + 1); // Aumentar el puntaje si la respuesta es correcta
      await playSound('correct'); // Reproducir sonido correcto
    } else {
      await playSound('incorrect'); // Reproducir sonido incorrecto
    }

    // Iniciar el cambio de pregunta inmediatamente
    setTimeLeft(0);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < lessons.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Limpiar la opción seleccionada
      setTimeLeft(5); // Reiniciar el temporizador para la siguiente pregunta
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(5); // Reiniciar el cronómetro
    setShowResult(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A6F97" />
        <Text>Cargando preguntas...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>¡Has completado el quiz!</Text>
        <Text style={styles.scoreText}>Tu puntuación: {score}/{lessons.length}</Text>
        <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
          <Text style={styles.restartButtonText}>Reiniciar Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = lessons[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={180}
        width={12}
        fill={(timeLeft / 5) * 100} // Porcentaje de progreso
        tintColor="#2A6F97"
        backgroundColor="#e0e0e0"
      >
        {() => <Text style={styles.timeText}>{timeLeft}</Text>}
      </AnimatedCircularProgress>

      {currentQuestion.opciones.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option && option === currentQuestion.respuestaCorrecta
              ? styles.correctOption
              : selectedOption === option && option !== currentQuestion.respuestaCorrecta
              ? styles.incorrectOption
              : styles.optionButton
          ]}
          onPress={() => handleOptionPress(option)}
          disabled={!!selectedOption || isSpeaking} // Deshabilitar opciones mientras se reproduce el audio o si ya se seleccionó una opción
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20
  },
  optionButton: {
    borderWidth: 3,
    borderColor: '#d0d0d0',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  correctOption: {
    borderColor: '#28a745',
  },
  incorrectOption: {
    borderColor: '#dc3545',
  },
  optionText: {
    fontSize: 22,
    color: '#333',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 30,
    color: '#2A6F97',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuizComponent;
