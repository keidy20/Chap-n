import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { router } from 'expo-router';
import { existToken, getToken } from '@/utils/TokenUtils';

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
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [instructionAudioPlayed, setInstructionAudioPlayed] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    playInstructionAudio();
  }, []);

  const playInstructionAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(require('../../assets/Instrucciones.mp3'));
      setSound(newSound);
      
      await newSound.playAsync();
      setInstructionAudioPlayed(true); // Marcar que se ha reproducido el audio
    } catch (error) {
      console.error('Error al reproducir el sonido de instrucciones:', error);
    }
  };

  const stopAndUnloadSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error al detener o descargar el sonido:', error);
      }
      setSound(null);
    }
  };

  const goBack = () => {
    stopAllAudio();
    router.back();
  };

  const startEvaluation = async () => {
    stopAndUnloadSound(); // Detener el audio de instrucciones al iniciar la evaluación

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
        .filter(lesson => lesson.tipoEjercicio === 'QZ')
        .flatMap(lesson => {
          const lessonAudios = lesson.contenido.audios.map(audio => audio.url);
          setAudios(lessonAudios);
          return lesson.contenido.Ejercicios;
        });

      if (filteredLessons.length > 0) {
        setLessons(filteredLessons);
        setIsEvaluating(true);
      } else {
        Alert.alert('Error', 'No se encontraron lecciones con el tipo "QZ".');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las lecciones');
    }
  };

  const stopAllAudio = async () => {
    await stopAndUnloadSound();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#2A6F97" />
      </TouchableOpacity>

      <Text style={styles.title}>Cuestionario de Evaluación</Text>

      {!isEvaluating && (
        <TouchableOpacity
          style={styles.button}
          onPress={startEvaluation}
          disabled={!instructionAudioPlayed} // Deshabilitar hasta que se haya reproducido el audio
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Iniciar Evaluación</Text>
          </View>
        </TouchableOpacity>
      )}

      {isEvaluating && (
        <>
          <Text style={styles.subtitle}>Selecciona la opción correcta:</Text>
          {lessons.length > 0 && (
            lessons[currentWordIndex].opciones.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))
          )}
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
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#2A6F97',
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#2A6F97',
  },
});

export default QuizEvaluacion;
