import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { Audio } from 'expo-av';
import { router } from 'expo-router';

interface Lesson {
  id: number;
  opciones: string[];
}

interface LessonData {
  tipoEjercicio: string;
  titulo: string;
  contenido: {
    Ejercicios: Lesson[];
    audios: { url: string }[];
  };
}

const QuizEvaluacion: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [words, setWords] = useState<{ audio: string; opciones: string[] }[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${baseUrl}/ejercicios/all`);
        const data: LessonData[] = await response.json();

        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'QZ')
          .flatMap(lesson => {
            const lessonAudios = lesson.contenido.audios.map(audio => audio.url);
            return lesson.contenido.Ejercicios.map((ejercicio, index) => ({
              audio: lessonAudios[index], // Asegúrate de que el índice coincida
              opciones: ejercicio.opciones,
            }));
          });

        if (filteredLessons.length > 0) {
          setWords(filteredLessons);
        } else {
          Alert.alert('Error', 'No se encontraron lecciones con el tipo "QZ".');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las lecciones');
      }
    };

    fetchLessons();
  }, [baseUrl]);

  const playAudio = async (soundFile: string) => {
    if (sound) {
      await sound.stopAsync(); // Detener el sonido actual
      await sound.unloadAsync(); // Descargar el sonido actual
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: soundFile });
    setSound(newSound);
    await newSound.playAsync(); // Reproducir el nuevo audio
  };

  const handleOptionSelect = async (option: string) => {
    if (option === words[currentWordIndex].audio) {
      await playAudio(require('../../assets/Correcto.mp3'));
      setCorrectAnswers(correctAnswers + 1);
      setCorrectOption(option);
    } else {
      await playAudio(require('../../assets/incorrecto.mp3'));
      setCorrectOption(words[currentWordIndex].audio);
    }
    setSelectedOption(option);
    setTimeout(() => {
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex < words.length) {
        setCurrentWordIndex(nextWordIndex);
        setSelectedOption(null);
        setCorrectOption(null);
      } else {
        setIsEvaluating(false);
        alert(`Evaluación finalizada. Respuestas correctas: ${correctAnswers}`);
      }
    }, 1000);
  };

  const startEvaluation = () => {
    setIsEvaluating(true);
    setTimeLeft(60);
    setCorrectAnswers(0);
    setCurrentWordIndex(0);
    setSelectedOption(null);
    setCorrectOption(null);
    // Reproduce el audio de instrucciones aquí
    playAudio(require('../../assets/Instrucciones.mp3')); // Asegúrate de que este archivo esté disponible
  };

  const stopAndUnloadSound = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (error) {
          console.error('Error al detener o descargar el sonido:', error);
        }
      }
    }
    setSound(null); // Resetear el estado del sonido
  };
  const stopAllAudio = async () => {
    stopAndUnloadSound(); // Detener cualquier sonido de expo-av
    Speech.stop(); // Detener cualquier texto hablado en curso
  };

  const goBack = () => {
    stopAllAudio(); // Detener todos los sonidos antes de salir
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#2A6F97" />
      </TouchableOpacity>

      <Text style={styles.title}>Quiz de Evaluación</Text>

      {!isEvaluating && (
        <Image source={require('../../assets/evaluacion3.png')} style={styles.image} />
      )}

      {!isEvaluating ? (
        <TouchableOpacity style={styles.button} onPress={startEvaluation}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Iniciar Evaluación</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.word}>¿Qué audio escuchaste?</Text>
          <View style={styles.optionsContainer}>
            {words[currentWordIndex]?.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleOptionSelect(opcion)}
              >
                <Text style={styles.optionText}>{opcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2A6F97',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 6,
    padding: 10,
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2A6F97',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  highlightButton: {
    backgroundColor: '#4CAF50',
  },
  timerText: {
    fontSize: 32,
    color: '#2A6F97',
  },
  word: {
    fontSize: 20,
    marginVertical: 20,
    color: '#2A6F97',
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});

export default QuizEvaluacion;
