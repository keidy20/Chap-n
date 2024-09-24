import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { Vibration } from 'react-native';
import { existToken, getToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';

interface Lesson {
  id: number;
  oracion: string;
  opciones: string[];
  opcionCorrecta: string;
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

const CompletaLaOracion = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl: string = process.env.EXPO_PUBLIC_URL || '';
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false); 
  const [ idEjercicio, setIdEjercicio ] = useState<any>(null)

  const correctSound = require('../../assets/Correct.mp3');
  const incorrectSound = require('../../assets/Incorrect.mp3');

  useEffect(() => {
    
    const fetchLessons = async () => {
      let token = null;
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
      } else {
        router.navigate('/home')
      }
      try {
        const response = await fetch(`${baseUrl}/ejercicios/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });
        const data: LessonData[] = await response.json();

        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'CO')
          .flatMap(lesson => {
            const lessonAudios = lesson.contenido.audios.map(audio => audio.url);
            setAudios(lessonAudios);
            setIdEjercicio(lesson.id)
            return lesson.contenido.Ejercicios;
          });

        if (filteredLessons.length > 0) {
          setLessons(filteredLessons);
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
  }, [baseUrl]);

  const currentLessonData = lessons[currentLessonIndex];
  const currentAudioUrl = audios[currentLessonIndex];

   // Reproducir el audio al iniciar una lección
   useEffect(() => {
    if (currentLessonData) {
      handleStartReading();
    }
    return () => {
      stopAudio();
    };
  }, [currentLessonIndex, lessons]);

  const handleStartReading = async () => {
    if (!currentAudioUrl) return;
  
    setIsSpeaking(true);
    const { sound } = await Audio.Sound.createAsync({ uri: currentAudioUrl });
    setSound(sound);
    await sound.playAsync();
  
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded) {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setIsSpeaking(false);
        }
      }
    });
  };

  

  const goBack = () => {
    router.back();
  };

  // Detener audio manualmente
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsSpeaking(false);
    }
  };
  

// Reproducir sonido de retroalimentación
const playFeedbackSound = async (isCorrect: boolean) => {
  const soundToPlay = isCorrect ? correctSound : incorrectSound;
  const { sound } = await Audio.Sound.createAsync(soundToPlay);
  await sound.playAsync();
};


const handleOptionSelect = async (option: string) => {
  setSelectedOption(option);
  const correct = option === currentLessonData.opcionCorrecta;
  setIsCorrect(correct);

  setSelectedOption(option);
  option === currentLessonData.opcionCorrecta;
  setIsCorrect(correct);

  // Deshabilitar las opciones mientras se reproduce el audio de feedback
  setIsOptionDisabled(true);

  // Reproducir el sonido de feedback (correcto o incorrecto)
  await playFeedbackSound(correct);

  // Una vez que termine el audio, habilitamos las opciones nuevamente
  setIsOptionDisabled(false);

  // Vibrar si es incorrecto
  if (!correct) {
    Vibration.vibrate(200);
  }

  if (!correct) {
    setTimeout(async () => {
      await handleStartReading();
    }, 500);
  }
};



const handleNextLesson = async () => {
  if (currentLessonIndex < lessons.length - 1) {
    //await completarEjercicio()
    setCurrentLessonIndex(currentLessonIndex + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  } else {
    console.log('Leccion terminada ', idEjercicio)
    await completarEjercicio()
    router.push("/menuEjercicios")
  }
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
        puntuacion: 10
      })
    });
    const data: LessonData[] = await response.json();


  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar las lecciones');
    
  }
}

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A6F97" />
      </View>
    );
  }

  if (!currentLessonData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando lección...</Text>
      </View>
    );
  }

  const words = currentLessonData.oracion.split(' ');

  const isNextButtonDisabled = !selectedOption || selectedOption !== currentLessonData.opcionCorrecta;

  return (
    <LinearGradient colors={['#e0eafc', '#f5f5f5']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Ejercicio {currentLessonIndex + 1}</Text>
      </View>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={24} color="#2A6F97" />
      </TouchableOpacity>
      <Text style={styles.subtitle}>Elije la palabra correcta que hace falta para completar la oración</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>
            {words.map((word, index) => (
              <Text key={index} style={styles.word}>
                {word === '___' ? (
                  selectedOption === currentLessonData.opcionCorrecta ? (
                    <Text style={styles.highlightedWord}>
                      {currentLessonData.opcionCorrecta.toLowerCase()}{' '}
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
          <TouchableOpacity onPress={handleStartReading} style={styles.speakerButton}>
            <FontAwesome name="volume-up" size={24} color={isSpeaking ? '#1e90ff' : 'black'} />
          </TouchableOpacity>

        </View>
        <View style={styles.opcionesContainer}>
          {currentLessonData.opciones.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionoracion}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.progressContainer}>
        {lessons.map((_, index) => (
          <View
            key={index}
            style={[styles.progressDot, currentLessonIndex === index && styles.currentProgressDot]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.pageIndicator}>{currentLessonIndex + 1} / {lessons.length}</Text>
        <TouchableOpacity 
          style={[styles.nextButton, isNextButtonDisabled && { opacity: 0.5 }]} 
          onPress={handleNextLesson} 
          disabled={isNextButtonDisabled}
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
    marginTop: 110,
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
