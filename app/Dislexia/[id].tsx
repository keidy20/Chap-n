import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Lesson {
  id: number;
  titulo: string;
  texto: string;
  highlights: string[];
  sounds: string[];
  quiz: number;  // ID del quiz
}

interface LessonData {
  id: number;
  titulo: string;
  contenido: {
    lecciones: Lesson[];
    audios: string[];  // Array de URLs de los audios
  };
}

const CKLessonComponent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [audios, setAudios] = useState<string[]>([]);  // Estado para los audios
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(0); 
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchLessonById = async () => {
      try {
        const response = await fetch(`${baseUrl}/lecciones/${id}`);
        const data: LessonData = await response.json();

        if (data && data.contenido && data.contenido.lecciones && data.contenido.audios) {
          setLessons(data.contenido.lecciones);
          setAudios(data.contenido.audios.map((elemento: any) => elemento.url)); 
          console.log("JODIDA LA QUE ME DI ", data.contenido.lecciones) // Guardamos las URLs de los audios
        } else {
          Alert.alert('Error', 'No se encontraron lecciones o audios para este ID.');
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

  useEffect(() => {
    if (audios.length > 0) {
      const currentAudio = audios[currentLesson];
      console.log('Audios disponibles:', audios); // Verifica las URLs de los audios
      console.log('Reproduciendo audio de lección:', currentAudio); // Verifica la URL de la lección actual
      if (typeof currentAudio === 'string') {
        playAudio(currentAudio);  // Reproducir el audio de la URL actual
      }
    }

    return () => {
      stopAudio();  // Detener la reproducción de audio al desmontar el componente o cambiar de lección
    };
  }, [currentLesson, audios]);

  const playAudio = async (audioUrl: string) => {
    try {
      console.log('Reproduciendo audio desde URL:', audioUrl); // Verifica la URL del audio

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el audio:', error); // Muestra el error en la consola
      Alert.alert('Error', 'No se pudo reproducir el audio.');
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      const quizId = lessons[currentLesson]?.quiz;  // Obtener el ID del quiz de la lección actual
      if (quizId) {
        goToQuiz(quizId);
      } else {
        Alert.alert('Error', 'No se encontró el ID del quiz.');
      }
    }
  };
  
  const goToQuiz = (quiz: any) => {
    router.push(`/Quiz/${encodeURIComponent(quiz)}`);
    console.log("SHUCA ", quiz)
    console.log("YA ESTOY CANSADA ", id)
  };
  

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else {
      Alert.alert('No hay lección anterior', 'Ya estás en la primera lección.');
    }
  };

  const renderHighlightedText = (text: string, highlights: string[], sounds: string[]) => {
    const regex = new RegExp(`(${[...highlights, ...sounds].join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text style={styles.text}>
        {parts.map((part, index) => {
          if (highlights.includes(part.toLowerCase())) {
            return <Text key={index} style={styles.highlight}>{part}</Text>;
          }
          if (sounds.includes(part)) {
            return <Text key={index} style={styles.sound}>{part}</Text>;
          }
          return part;
        })}
      </Text>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A6F97" />
        <Text>Cargando lecciones...</Text>
      </View>
    );
  }

  const currentLessonData = lessons[currentLesson];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Icon name="arrow-back" size={30} color="#2A6F97" />
        </TouchableOpacity>
      </View>

      {currentLessonData && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.speakerIcon}
            onPress={() => isPlaying ? stopAudio() : playAudio(audios[currentLesson])}
          >
            <FontAwesome
              name="volume-up"
              size={24}
              color={isPlaying ? '#1e90ff' : 'black'}
            />
          </TouchableOpacity>

          <Text style={styles.titulo}>{currentLessonData.titulo}</Text>
          {renderHighlightedText(currentLessonData.texto, currentLessonData.highlights, currentLessonData.sounds)}
        </View>
      )}

      <View style={styles.navigation}>
        <TouchableOpacity onPress={prevLesson} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextLesson} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 50,
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 120,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  goBackButton: {
    marginRight: 16,
  },
  speakerIcon: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 40,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    lineHeight: 24,
    marginBottom: 10,
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  sound: {
    color: '#007bff',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navigationButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CKLessonComponent;
