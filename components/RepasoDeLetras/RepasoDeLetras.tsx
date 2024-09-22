import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { existToken, getToken } from '@/utils/TokenUtils';
import { router } from 'expo-router';

interface Lesson {
  letra: string;
  silabas: string[][];
  palabra: string[];
  sentencia: string[];
}

const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    speakText();
  }, [lesson]);

  const speakText = () => {
    // Concatenamos todas las combinaciones de sílabas como palabras sueltas separadas por comas.
    const silabasSonido = lesson.silabas.map(syllable => syllable.join('')).join(', ');

    setIsSpeaking(true);
    startAnimation(); // Iniciar la animación al comenzar a hablar

    // Modificamos el texto de voz para decir la combinación de sonidos en español
    Speech.speak(`Las combinaciones son: ${silabasSonido}`, {
      language: 'es', // Asegura que el idioma sea español
      onDone: () => {
        setIsSpeaking(false);
        stopAnimation(); // Detener la animación cuando el habla termine
      },
      onStopped: () => {
        setIsSpeaking(false);
        stopAnimation(); // Detener la animación si se interrumpe el habla
      },
    });
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopAnimation = () => {
    scaleAnim.setValue(1); // Restablecer el valor de la animación a 1
    scaleAnim.stopAnimation(); // Detener la animación
  };

  const highlightletra = (text: string) => {
    return text.split('').map((char, index) => (
      <Animated.Text 
        key={index} 
        style={char.toLowerCase() === lesson.letra[0].toLowerCase() ? [styles.redletra, { transform: [{ scale: scaleAnim }] }] : styles.defaultText}>
        {char}
      </Animated.Text>
    ));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Animated.Text style={[styles.letra, { transform: [{ scale: scaleAnim }] }]}>
          {lesson.letra}
        </Animated.Text>
        <TouchableOpacity onPress={speakText} style={styles.iconContainer}>
          <Ionicons 
            name="volume-high" 
            size={40} 
            color={isSpeaking ? '#00BFFF' : '#000'} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.silabasContainer}>
        <View style={styles.silabasRow}>
          {lesson.silabas.slice(0, 5).map((syllable, index) => (
            <Text key={index} style={styles.syllable}>
              {highlightletra(syllable[0])}{syllable[1]}
            </Text>
          ))}
        </View>
        <View style={styles.silabasRow}>
          {lesson.silabas.slice(5, 10).map((syllable, index) => (
            <Text key={index} style={styles.syllable}>
              {highlightletra(syllable[0])}{syllable[1]}
            </Text>
          ))}
        </View>
      </View>
      
      <View style={styles.palabrasContainer}>
        <View style={styles.palabrasRow}>
          {lesson.palabra.slice(0, 4).map((word, index) => (
            <Text key={index} style={styles.word}>
              {highlightletra(word)}
            </Text>
          ))}
        </View>
        <View style={styles.palabrasRow}>
          {lesson.palabra.slice(4).map((word, index) => (
            <Text key={index} style={styles.word}>
              {highlightletra(word)}
            </Text>
          ))}
        </View>
      </View>
      
      <View style={styles.sentenciasContainer}>
        {lesson.sentencia.map((sentence, index) => (
          <Text key={index} style={styles.sentence}>
            {highlightletra(sentence)}
          </Text>
        ))}
      </View>
    </View>
  );
};

const LessonScreen: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    getLecciones();
  }, []);

  const getLecciones = async () => {
    const url = `${baseUrl}/lecciones/all`;
    let token = null;
    if (await existToken()) {
      token = await getToken()
      console.log('Token en lecciones ', token)
    } else {
      router.navigate('/home')
    }
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        }
      });

      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      const data = await res.json();
      const contenido = data.map((d: any) => d.contenido);
      setLessons(contenido);
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {lessons.length > 0 ? (
          <>
            <LessonCard lesson={lessons[currentLesson]} />
          </>
        ) : (
          <Text style={styles.loadingText}>Cargando lecciones...</Text>
        )}
      </ScrollView>
      
      {lessons.length > 0 && currentLesson < lessons.length - 1 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E8F5FF',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 8,
    borderColor: '#2A6F97',
    padding: 20,
    width: '100%',
    marginBottom: 20,
    marginTop: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Centra la letra en el contenedor
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute', // Posiciona el ícono a la derecha
    right: 0,
  },
  letra: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ce0606',
    textAlign: 'center',
  },
  silabasContainer: {
    marginBottom: 10,
  },
  silabasRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  syllable: {
    fontSize: 30,
    marginHorizontal: 5,
    color: '#000',
  },
  palabrasContainer: {
    marginBottom: 10,
  },
  palabrasRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  word: {
    fontSize: 25,
    marginHorizontal: 10,
    color: '#000',
  },
  sentenciasContainer: {
    marginTop: 10,
  },
  sentence: {
    fontSize: 28,
    marginVertical: 2,
    color: '#333',
  },
  redletra: {
    color: '#ce0606',
    fontWeight: 'bold',
  },
  defaultText: {
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default LessonScreen;
