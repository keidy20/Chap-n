import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Bienvenida = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showButton, setShowButton] = useState(false); // Estado para mostrar el botón

  const router = useRouter();
  
  const text = "¡Bienvenidos a Aprende Fácil! Estamos aquí para ayudarte a descubrir el maravilloso mundo de la lectura. Presiona el botón para acompañarte en este emocionante viaje y que puedas disfrutar de los beneficios de la lectura en tu vida diaria.";
  const words = text.split(' ');

  useEffect(() => {
    let interval: string;

    const speakText = async () => {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const selectedVoice = availableVoices.find(voice => voice.language === 'es-ES' && voice.quality === 'Enhanced');
      const voiceIdentifier = selectedVoice ? selectedVoice.identifier : undefined;

      // Obtener la duración estimada del texto
      const estimatedDuration = text.length * 50; // Aproximadamente 50ms por caracter

      // Calcular el tiempo para cada palabra
      const wordDuration = estimatedDuration / words.length;

      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'es',
        voice: voiceIdentifier,
        onStart: () => {
          setCurrentIndex(0);
          setDisplayedText(words[0]); // Mostrar la primera palabra inmediatamente
          interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
              if (prevIndex < words.length - 1) {
                setDisplayedText((prevText) => prevText + ' ' + words[prevIndex + 1]);
                return prevIndex + 1;
              }
              clearInterval(interval);
              setIsSpeaking(false);
              return prevIndex;
            });
          }, wordDuration);
        },
        onDone: () => {
          setCurrentIndex(words.length);
          clearInterval(interval);
          setIsSpeaking(false);
          setShowButton(true); // Mostrar el botón después de que termine la reproducción
        },
      });
    };

    speakText();

    return () => {
      clearInterval(interval);
      Speech.stop();
      setIsSpeaking(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Icon name="volume-up" size={50} color={isSpeaking ? '#ff6347' : '#000'} style={styles.icon} />
      <View style={styles.textContainer}>
        {displayedText.split(' ').map((word, index) => (
          <Text
            key={index}
            style={styles.word}
          >
            {word}{' '}
          </Text>
        ))}
      </View>
      {showButton && (
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/opciones')}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  icon: {
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  word: {
    color: 'black',
    fontSize: 24,
  },
  highlightedWord: {
    color: '#ff6347',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Bienvenida;




