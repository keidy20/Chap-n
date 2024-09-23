import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

interface LessonContent {
  letra: string;
  silabas: string[][];
  palabra: string[];
  sentencia: string[];
}

interface LessonCardProps {
  lesson: LessonContent;
}

const OpcionesReconocerLetras: React.FC<LessonCardProps> = ({ lesson }) => {
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
  
  const goBack = () => {
    router.navigate('/home');
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
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name="close" size={24} color="#2A6F97" />
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 8,
    borderColor: '#2A6F97',
    padding: 20,
    width: '90%', // Ajusta el ancho para dejar márgenes laterales
    marginHorizontal: '5%', // Márgenes laterales automáticos
    marginBottom: 20,
    marginTop: 150,
    paddingVertical: 20, // Asegura que haya espacio vertical
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
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
  backButton: {
    position: 'absolute',
    top: -110,
    left: -20,
    padding: 10,
  },
  word: {
    fontSize: 25,
    marginHorizontal: 10,
    color: '#000',
  },
  sentenciasContainer: {
    marginTop: 20,
  },
  sentence: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginVertical: 5,
  },
  redletra: {
    fontSize: 30,
    color: '#ce0606',
  },
  defaultText: {
    fontSize: 30,
    color: '#000',
  },
});

export default OpcionesReconocerLetras;
