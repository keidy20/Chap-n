import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Definir las preguntas del quiz relacionadas con letras
const quiz = [
  {
    question: '¿Cuál es la primer letra del abecedario?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  // (otras preguntas aquí)
];

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timer, setTimer] = useState(5); // Tiempo por pregunta en segundos
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Contador de respuestas correctas
  const [quizComplete, setQuizComplete] = useState(false); // Estado para manejar la pantalla de resultados

  const screenWidth = Dimensions.get('window').width;
  const progressBarWidth = (timer / 5) * screenWidth; // Calcular el ancho en píxeles para la barra de progreso decreciente

  const currentQuestion = quiz[currentQuestionIndex];

  useEffect(() => {
    if (quizComplete) return; // No hacer nada si el quiz está completo

    // Iniciar temporizador para cada pregunta
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(id);
          handleNextQuestion();
          return 5; // Reiniciar el temporizador
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [currentQuestionIndex, quizComplete]);

  useEffect(() => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption === currentQuestion.answer;
      speakFeedback(isCorrect);

      setTimeout(() => {
        setSelectedOption(null);
        handleNextQuestion(); // Cambiar a la siguiente pregunta después de un breve intervalo
      }, 1000);
    }
  }, [selectedOption]);

  const speakFeedback = (isCorrect: boolean) => {
    const feedbackText = isCorrect
      ? currentQuestion.correctFeedback
      : currentQuestion.incorrectFeedback;

    Speech.speak(feedbackText, {
      language: 'es',
      pitch: 1,
      rate: 1,
    });
  };

  
  const handleGoBack = () => {
    router.back(); // Esto asume que estás utilizando React Navigation para gestionar la navegación
  };

  const handleOptionPress = (option: string) => {
    if (!quizComplete) {
      setSelectedOption(option);
    }
  };

  const handleNextQuestion = () => {
    setTotalQuestionsAnswered((prev) => prev + 1);
    if (selectedOption === currentQuestion.answer) {
      setCorrectAnswers((prev) => prev + 1); // Contar respuesta correcta
    }

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(5); // Reiniciar el temporizador para la próxima pregunta
    } else {
      handleQuizEnd(); // Mostrar pantalla de resultados si se completan todas las preguntas
    }
  };

  const handleQuizEnd = () => {
    setQuizComplete(true); // Establecer que el quiz está completo
  };

  if (quizComplete) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>¡Quiz terminado!</Text>
        <Text style={styles.result}>
          Has respondido {totalQuestionsAnswered} preguntas y acertado {correctAnswers}.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setTimer(5);
            setCurrentQuestionIndex(0);
            setTotalQuestionsAnswered(0);
            setCorrectAnswers(0);
            setQuizComplete(false);
          }}
        >
          <Text style={styles.buttonText}>Reiniciar Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressBarWidth }]} />
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.column}>
          {currentQuestion.options.slice(0, 2).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {currentQuestion.options.slice(2).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    backgroundColor: '#EDEDED',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 30, // Separación mejorada del resto del contenido
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
  },
  progressBarContainer: {
    height: 12,
    width: '100%',
    backgroundColor: '#B0BEC5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#009688',
    borderRadius: 6,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    flexDirection: 'column',
    width: '45%',
  },
  option: {
    backgroundColor: '#009688',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  selectedOption: {
    backgroundColor: '#00796B',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#009688',
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  result: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333333',
  },
    optionBackground: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Quiz;
