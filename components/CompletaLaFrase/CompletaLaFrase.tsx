import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';;
import { Audio } from 'expo-av';
import { existToken, getToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';

interface Lesson {
  id: number;
  oracion: string;
  letrasDisponibles: string[];
  letrasCorrectas: string[];
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


const LeccionLectura = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [audios, setAudios] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [letterFrequency, setLetterFrequency] = useState<{ [letter: string]: number }>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [ idEjercicio, setIdEjercicio ] = useState<any>(null)
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const placeholder = '_';

  useEffect(() => {
    if (lessons.length > 0) {
      const currentLesson = lessons[currentLessonIndex];
      const frequency = calculateLetterFrequency(currentLesson.letrasCorrectas);
      setLetterFrequency(frequency);
      setSelectedLetters(Array(currentLesson.oracion.split(placeholder).length - 1).fill(''));
      generateAvailableLetters(frequency);

      handleStartReading();
    }
    
    return () => {
      Speech.stop();
    };
  }, [currentLessonIndex, lessons]);

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
        const response = await fetch(`${baseUrl}/ejercicios/all`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });
        const data: LessonData[] = await response.json();

        const filteredLessons = data
          .filter(lesson => lesson.tipoEjercicio === 'CP')
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

  const currentAudioUrl = audios[currentLessonIndex];

  const calculateLetterFrequency = (letters: string[]) => {
    const letterMap: Record<string, number> = {};
    letters.forEach(letter => {
      letterMap[letter] = (letterMap[letter] || 0) + 1;
    });
    return letterMap;
  };

  const generateAvailableLetters = (frequency: { [letter: string]: number }) => {
    let updatedLetters: string[] = [...lessons[currentLessonIndex].letrasDisponibles];
    
    Object.keys(frequency).forEach(letter => {
      const occurrencesInSentence = frequency[letter];
      const availableOccurrences = updatedLetters.filter(l => l === letter).length;
      if (availableOccurrences < occurrencesInSentence) {
        updatedLetters = [
          ...updatedLetters,
          ...Array(occurrencesInSentence - availableOccurrences).fill(letter),
        ];
      }
    });
    
    setAvailableLetters(updatedLetters);
  };

  const handleLetterSelect = (letter: string) => {
    const currentCount = selectedLetters.filter(l => l === letter).length;
    const maxCount = letterFrequency[letter] || 0;
  
    if (currentCount < maxCount) {
      const placeholderIndices = getAllPlaceholderIndices(letter);
      if (placeholderIndices.length > 0) {
        const updatedSelectedLetters = [...selectedLetters];
        placeholderIndices.forEach(index => {
          updatedSelectedLetters[index] = letter;
        });
        setSelectedLetters(updatedSelectedLetters);
  
        if (currentCount + 1 === maxCount) {
          setAvailableLetters(availableLetters.filter(l => l !== letter));
        }
      }
    } else {
      console.log(`Ya seleccionaste todas las '${letter}' necesarias`);
    }
  
    if (isComplete()) {
      Speech.speak('Correcto. Continúa con la siguiente lección.', { language: 'es' });
    }
  };

  const isComplete = () => {
    return !selectedLetters.includes('');
  };

  const getAllPlaceholderIndices = (letter: string): number[] => {
    const sentence = lessons[currentLessonIndex].oracion.split('');
    const indices: number[] = [];
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === placeholder && lessons[currentLessonIndex].audio[i] === letter) {
        indices.push(i);
      }
    }
    return indices;
  };

  const handleNextLesson = async () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      console.log('Leccion terminada ', idEjercicio)
      await completarEjercicio()
      router.push("/menuEjercicios")
    }
  };

  const getUpdatedSentence = () => {
    let sentence = lessons[currentLessonIndex].oracion.split('');
    selectedLetters.forEach((letter, index) => {
      if (letter) {
        sentence[index] = letter;
      }
    });
    return sentence.join('');
  };

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

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  return (
    <LinearGradient colors={['#e0eafc', '#f5f5f5']} style={styles.container}>
      <LinearGradient colors={['#f5f5f5', '#e0eafc']} style={styles.topGradient} />
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Ejercicio {currentLessonIndex + 1}</Text>
      </View>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={24} color="#2A6F97" />
      </TouchableOpacity>
      <Text style={styles.subtitle}>Selecciona las letras correctas para completar la frase</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>{getUpdatedSentence()}</Text>
          <TouchableOpacity onPress={handleStartReading} style={styles.speakerButton}>
            <FontAwesome name="volume-up" size={24} color={isSpeaking ? '#1e90ff' : 'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.lettersContainer}>
          {availableLetters.length > 0 ? (
            <FlatList
              data={availableLetters}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.letterButton} onPress={() => handleLetterSelect(item)}>
                  <Text style={styles.letterText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noLettersText}>No hay más letras disponibles.</Text>
          )}
        </View>
      </View>
      <View style={styles.progressContainer}>
        {lessons.map((_, index) => (
          <View key={index} style={[styles.progressDot, currentLessonIndex === index && styles.currentProgressDot]} />
        ))}
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
    height: 80,
    zIndex: 1,
  },
  noLettersText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 80,
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
    marginBottom: 90,
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
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterButton: {
    backgroundColor: '#2A6F97',
    borderRadius: 25,
    padding: 5,
    margin: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: '#fff',
    fontSize: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressDot: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    width: 10,
    height: 10,
    margin: 5,
  },
  currentProgressDot: {
    backgroundColor: '#2A6F97',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 18,
  },
  nextButton: {
    top: 20,
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 2,
  },
});

export default LeccionLectura;
