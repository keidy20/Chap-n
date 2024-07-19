import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

interface LetterDisplayProps {
  letter: string;
}

const IntroduccionSeccion: React.FC<LetterDisplayProps> = ({ letter }) => {
  const speakerRef = useRef<any>(null); // Referencia para la animación del icono de bocina

  useEffect(() => {
    // Reproducir el audio de la letra
    if (letter) {
      Speech.speak(letter, { language: 'es' });
      animateSpeaker(); // Iniciar animación del icono de bocina
    }
  }, [letter]);

  // Función para animar el icono de bocina
  const animateSpeaker = () => {
    if (speakerRef.current) {
      speakerRef.current.pulse(1000);
    }
  };

  return (
    <LinearGradient
      colors={['#51b8dd', '#1e5799']}
      style={styles.container}
    >
      <View style={styles.letterContainer}>
        <Text style={styles.letter}>{letter?.toLowerCase()}</Text>
        <Text style={styles.letter}>{letter?.toUpperCase()}</Text>
      </View>
      {/* Icono de bocina con animación */}
      <TouchableOpacity
        style={styles.speakerIconContainer}
        onPress={() => Speech.speak(letter, { language: 'es' })}
      >
        <Animatable.View
          ref={speakerRef}
          animation="pulse"
          iterationCount="infinite"
          style={styles.speakerIcon}
        >
          <LinearGradient
            colors={['#ff6347', '#ff8c00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <Icon name="volume-up" size={50} color="#fff" />
          </LinearGradient>
        </Animatable.View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letter: {
    fontSize: 150,
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  speakerIconContainer: {
    position: 'absolute',
    top: 80,
    right: 30,
    alignItems: 'flex-end',
  },
  speakerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IntroduccionSeccion;
