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
  const [words, setWords] = useState<{ audio: string, opciones: string[] }[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [highlightButton, setHighlightButton] = useState(false);
  const [instructionsGiven, setInstructionsGiven] = useState(false);
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
            console.log("PRUEBAAAA", lesson.contenido.audios)
            setAudios(lessonAudios);
            return lesson.contenido.Ejercicios;
          });

        if (filteredLessons.length > 0) {
          setLessons(filteredLessons);
        } else {
          Alert.alert('Error', 'No se encontraron lecciones con el tipo "CO".');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las lecciones');
      }
    };

    fetchLessons();
  }, [baseUrl]);



  // Función para reproducir sonidos (correcto, incorrecto, cronómetro)
  const playSound = async (soundFile: any) => {
    await stopAndUnloadSound(); // Asegúrate de detener cualquier sonido anterior
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el sonido:', error);
    }
  };

  // Funciones específicas para sonidos correctos, incorrectos y cronómetro
  const playCorrectSound = () => playSound(require('../../assets/Correcto.mp3'));
  const playIncorrectSound = () => playSound(require('../../assets/incorrecto.mp3'));
  const playCronometroSound = () => playSound(require('../../assets/cronometro.mp3'));

  // Función para detener y descargar el sonido
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

  // Detener todos los sonidos
  const stopAllAudio = async () => {
    stopAndUnloadSound(); // Detener cualquier sonido de expo-av
    Speech.stop(); // Detener cualquier texto hablado en curso
  };

  // Función para regresar y detener todos los audios
  const goBack = () => {
    stopAllAudio(); // Detener todos los sonidos antes de salir
    router.back();
  };

// Función para iniciar la evaluación
const startEvaluation = () => {
  stopAndUnloadSound(); // Asegúrate de detener cualquier sonido activo antes de comenzar
  setIsEvaluating(true);
  setTimeLeft(60);
  setCorrectAnswers(0);
  setCurrentWordIndex(0);
  setSelectedOption(null);
  setCorrectOption(null);
  setHighlightButton(false);
};

  // Función para manejar la selección de opción
  const handleOptionSelect = async (option: string) => {
    if (option === words[currentWordIndex].audio) {
      await playCorrectSound(); // Reproduce el sonido si la opción es correcta
      setCorrectAnswers(correctAnswers + 1);
      setCorrectOption(option);
    } else {
      await playIncorrectSound();
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

  // Función para reproducir el audio de la palabra
  const playAudio = () => {
    Speech.speak(words[currentWordIndex].audio, { language: 'es-ES', rate: 1.0 });
  };

  // Cargar los datos de la API y filtrar lecciones
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${baseUrl}/ejercicios/all`);
        const data: any[] = await response.json();
        console.log("OJO", data);

        // Filtra solo las lecciones con tipoEjercicio "CP"
        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'QZ')
          .flatMap(lesson => lesson.contenido.Ejercicios); // Accede a las lecciones dentro de 'contenido'

        if (filteredLessons.length > 0) {
          const wordsData = filteredLessons.map((lesson: any) => ({
            audio: lesson.audio,
            opciones: lesson.opciones,
          }));
          setWords(wordsData);
        } else {
          Alert.alert('Error', 'No se encontraron lecciones con el tipo "CP".');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las lecciones');
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    if (isEvaluating) {
      playAudio();
    }
  }, [currentWordIndex, isEvaluating]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEvaluating && timeLeft > 0) {
      playCronometroSound();
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsEvaluating(false);
      alert(`Tiempo terminado. Respuestas correctas: ${correctAnswers}`);
      stopAndUnloadSound();
    }
    return () => {
      if (isEvaluating || sound) { // Solo detener el sonido si la evaluación está activa o el sonido existe
        stopAndUnloadSound();
      }
      clearTimeout(timer); 
    };
  }, [timeLeft, isEvaluating]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#2A6F97" />
      </TouchableOpacity>

      <Text style={styles.title}>Quiz de Evaluación</Text>

      {!isEvaluating && (
        <Image 
          source={require('../../assets/evaluacion3.png')}
          style={styles.image}
        />
      )}

      {!isEvaluating ? (
        <TouchableOpacity
          style={[styles.button, highlightButton && styles.highlightButton]}
          onPress={startEvaluation}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Iniciar Evaluación</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <AnimatedCircularProgress
            size={200}
            width={10}
            fill={100 - (timeLeft / 60) * 100}
            tintColor="#2A6F97"
            backgroundColor="#e0e0e0"
          >
            {() => <Text style={styles.timerText}>{timeLeft}</Text>}
          </AnimatedCircularProgress>
          <Text style={styles.word}>¿Qué audio escuchaste?</Text>
          <View style={styles.optionsContainer}>
            {words[currentWordIndex]?.opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedOption === opcion && {
                    borderColor: opcion === words[currentWordIndex]?.audio ? '#4CAF50' : '#F44336',
                    borderWidth: 3,
                    backgroundColor: opcion === words[currentWordIndex]?.audio ? '#e8f5e9' : '#ffebee',
                  },
                ]}
                onPress={() => handleOptionSelect(opcion)}
                disabled={selectedOption !== null}
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highlightButton: {
    backgroundColor: '#1E90FF',
  },
  word: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 24,
  },
  correctOptionText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#4CAF50',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2A6F97',
  },
});

export default QuizEvaluacion;