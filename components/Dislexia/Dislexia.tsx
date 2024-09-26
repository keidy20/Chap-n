import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { existToken, getToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';

interface Lesson {
  id: number;
  titulo: string;
  texto: string;
  audio: string;
  highlights: string[];
  sounds: string[];
}

interface LessonData {
  tipoLeccion: string;
  titulo: string;
  contenido: {
    lecciones: Lesson[];
  };
}

const CKLessonComponent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  // Fetch de datos desde la API
  useEffect(() => {
    const fetchLessons = async () => {
      let token = null;
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
        console.log('Usuario ', await getUsuario())
      } else {
        router.navigate('/home')
      }
      try {
        const response = await fetch(`${baseUrl}/lecciones/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });
        const data: LessonData[] = await response.json();

        // Filtra solo las lecciones con tipoLeccion "RL"
        const filteredLessons = data
          .filter(lesson => lesson.tipoLeccion === 'RL')
          .flatMap(lesson => lesson.contenido.lecciones); // Accede a las lecciones dentro de 'contenido'

        if (filteredLessons.length > 0) {
          setLessons(filteredLessons); // Guardamos las lecciones filtradas
        } else {
          console.log('Error', 'No se encontraron lecciones con el tipo "RL".');
        }
        setLoading(false);
      } catch (error) {
        console.log('Error', 'No se pudieron cargar las lecciones');
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const currentLessonData = lessons[currentLesson];
  console.log("KEIDY", currentLesson)

  const speakLesson = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'es',
      rate: 1.0,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
    });
  };

  const stopSpeech = () => {
    setIsSpeaking(false);
    Speech.stop();
  };

  useEffect(() => {
    if (currentLessonData) {
      speakLesson(currentLessonData.audio);
    }

    return () => {
      stopSpeech();
    };
  }, [currentLesson, lessons]);

  const goBack = () => {
    router.back();
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      console.log('Finalizado', 'Has completado todas las lecciones.');
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else {
      console.log('No hay lección anterior', 'Ya estás en la primera lección.');
    }
  };

  console.log("CHACHO MALO", currentLessonData);
  console.log("CHACHO MALO", currentLessonData);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Icon name="arrow-back" size={40} color="#2A6F97" />
        </TouchableOpacity>
      </View>

      {currentLessonData && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.speakerIcon}
            onPress={() => isSpeaking ? stopSpeech() : speakLesson(currentLessonData.audio)}
          >
            <Ionicons name="volume-high" size={24} color={isSpeaking ? '#007bff' : '#000'} />
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
    marginTop: 16,
  },
  navigationButton: {
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  navigationButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CKLessonComponent;
