import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { existToken, getToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';


interface Lesson {
  id: number;
  opciones: string[];
}

interface LessonData {
  id: number;
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
  const [finished, setFinished] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ idEjercicio, setIdEjercicio ] = useState<any>(null)


  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  let sound: any = null;

  useEffect(() => {
    const fetchLessons = async () => {
      let token = null;
      let usuario = await getUsuario();
      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate("/home");
      }
      try {
        const response = await fetch(`${baseUrl}/ejercicios/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data: LessonData[] = await response.json();

        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'QZ')
          .flatMap(lesson => {
            const lessonAudios = lesson.contenido.audios.map(audio => audio.url);
            //console.log("PRUEBAAAA", lesson.contenido.audios)
            setAudios(lessonAudios);
            setIdEjercicio(lesson.id)
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

  const playAudio = async (audioUrl: string) => {
    console.log("Intentando reproducir audio:", audioUrl); // Verifica la URL

    try {
      if (sound) {
        console.log("Entro aqui jejeje");
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      sound = newSound
      setFinished(false);
      newSound.setOnPlaybackStatusUpdate((playbackStatus) => {


        if (playbackStatus.isLoaded) {

          if (playbackStatus.didJustFinish) {

            setFinished(true);
          }
        } else {
          console.log("El audio no está cargado.");
        }
      });

      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
      Alert.alert("Error", "No se pudo reproducir el audio.");
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo detener el audio.");
    }
  };


  // Funciones específicas para sonidos correctos, incorrectos y cronómetro
  const playCorrectSound = async () => {
    await stopAudio()
    await playAudio(require('../../assets/Correcto.mp3'));
  }
  const playIncorrectSound = () => playAudio(require('../../assets/incorrecto.mp3'));
  const playCronometroSound = async () => {
    await stopAudio()
    await playAudio(require('../../assets/cronometro.mp3'));
  }

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
    sound = null;
  };



  // Función para regresar y detener todos los audios
  const goBack = () => {
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
    await stopAudio()
    if (option === words[currentWordIndex].audio) {
      //await playCorrectSound(); // Reproduce el sonido si la opción es correcta
      setCorrectAnswers(correctAnswers + 1);
      setCorrectOption(option);
    } else {
      //await playIncorrectSound();
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
        //alert(`Evaluación finalizada. Respuestas correctas: ${correctAnswers}`);
      }
    }, 1000);
  };

  const completarEjercicio = async () => {
    let token = null;
    if (await existToken()) {
      token = await getToken()
      console.log('Token en lecciones ', token)
    } else {
      router.navigate('/home')
    }
    try {
      let usuario = await getUsuario()
      const response = await fetch(`${baseUrl}/usuarios_ejercicios/registrar_ejercicio_by_username`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          username: usuario,
          idEjercicio: idEjercicio,
          completado: true,
          puntuacion: correctAnswers
        })
      });
      const data: LessonData[] = await response.json();
      router.push("/menuEjercicios")
  
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las lecciones');
      
    }
  }

  // Función para reproducir el audio de la palabra
  const playAudioSound = async () => {
    await stopAudio()
    await playAudio(audios[currentWordIndex])

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
    //sound2 = null
    if (isEvaluating) {
      playAudioSound();
    }
    else {
      console.log('Se ejecuta guardado')
      completarEjercicio()
    }
  }, [currentWordIndex, isEvaluating]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEvaluating && timeLeft > 0) {
      //playCronometroSound();
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsEvaluating(false);
      //alert(`Tiempo terminado. Respuestas correctas: ${correctAnswers}`);
      //stopAndUnloadSound(); 
      stopAudio()
    }
    return () => {
      if (isEvaluating || sound) { // Solo detener el sonido si la evaluación está activa o el sonido existe
        //stopAndUnloadSound();
      }
      clearTimeout(timer); 
    };
  }, [timeLeft, isEvaluating]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#2A6F97" />
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
    fontSize: 26,
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
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24
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
  },
  option: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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