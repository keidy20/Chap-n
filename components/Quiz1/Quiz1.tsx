import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';

// Definir las preguntas del quiz relacionadas con letras
const quizQuestions = [
  {
    question: '¿Cuál es la letra mostrada?',
    letter: 'A',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Qué letra es la siguiente en esta secuencia?',
    letter: 'C',
    options: ['A', 'B', 'C', 'D'],
    answer: 'C',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Cuál es la letra que sigue en esta secuencia?',
    letter: 'F',
    options: ['E', 'F', 'G', 'H'],
    answer: 'G',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Qué letra falta aquí?',
    letter: 'B',
    options: ['A', 'B', 'C', 'D'],
    answer: 'B',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: 'Selecciona la letra correcta.',
    letter: 'D',
    options: ['C', 'D', 'E', 'F'],
    answer: 'D',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Cuál letra es esta?',
    letter: 'G',
    options: ['F', 'G', 'H', 'I'],
    answer: 'G',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Qué letra sigue después de E?',
    letter: 'E',
    options: ['D', 'E', 'F', 'G'],
    answer: 'F',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Cuál es la primera letra del alfabeto?',
    letter: 'A',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: '¿Qué letra precede a H?',
    letter: 'H',
    options: ['G', 'H', 'I', 'J'],
    answer: 'G',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  {
    question: 'Selecciona la letra que viene antes de K.',
    letter: 'K',
    options: ['J', 'K', 'L', 'M'],
    answer: 'J',
    correctFeedback: '¡Correcto!',
    incorrectFeedback: 'Incorrecto',
  },
  // (otras preguntas aquí)
];

const QuizLevel1: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timer, setTimer] = useState(60); // Tiempo total en segundos
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Contador de respuestas correctas
  const [quizComplete, setQuizComplete] = useState(false); // Estado para manejar la pantalla de resultados

  const screenWidth = Dimensions.get('window').width;
  const progressBarWidth = (timer / 60) * screenWidth; // Calcular el ancho en píxeles para la barra de progreso decreciente

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (quizComplete) return; // No hacer nada si el quiz está completo

    // Iniciar temporizador global
    const id = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(id);
          handleQuizEnd(); // Mostrar pantalla de resultados cuando el tiempo se agota
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [quizComplete]);

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

  const handleOptionPress = (option: string) => {
    if (!quizComplete) {
      setSelectedOption(option);
    }
  };

  const handleNextQuestion = () => {
    setTotalQuestionsAnswered(prev => prev + 1);
    if (selectedOption === currentQuestion.answer) {
      setCorrectAnswers(prev => prev + 1); // Contar respuesta correcta
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizEnd(); // Mostrar pantalla de resultados si se completan todas las preguntas
    }
  };

  const handleQuizEnd = () => {
    setQuizComplete(true); // Establecer que el quiz está completo
    Alert.alert('Quiz terminado', `Has respondido ${totalQuestionsAnswered} preguntas y acertado ${correctAnswers}.`);
  };

  if (quizComplete) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>¡Quiz terminado!</Text>
        <Text style={styles.result}>
          Has respondido {totalQuestionsAnswered} preguntas y acertado {correctAnswers}.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          setTimer(60);
          setCurrentQuestionIndex(0);
          setTotalQuestionsAnswered(0);
          setCorrectAnswers(0);
          setQuizComplete(false);
        }}>
          <Text style={styles.buttonText}>Reiniciar Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <Text style={styles.letter}>{currentQuestion.letter}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  letter: {
    fontSize: 100,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    width: '45%',
  },
  option: {
    backgroundColor: '#007bff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#0056b3',
  },
  optionText: {
    color: '#fff',
    fontSize: 25,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  result: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default QuizLevel1;
