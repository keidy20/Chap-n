import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // Necesitas instalar esta librería
import * as FileSystem from 'expo-file-system';

export default function FluidezLectoraComponent() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minuto
  const [phraseIndex, setPhraseIndex] = useState(0);
  const recordingRef = useRef(null);

  // Ejemplo de frases para que el usuario lea
  const textToRead = "Este es un ejemplo de una frase corta. Otra frase para medir la fluidez lectora. Sigue leyendo para completar la prueba. La lectura fluida es importante para comprender. Leer en voz alta mejora la comprensión. Cada día es una oportunidad para aprender. La práctica constante te hará un lector fluido. La lectura es la llave del conocimiento. Concentrarse en las palabras mejora la fluidez. Un buen lector entiende y disfruta el texto. Las palabras tienen el poder de cambiar el mundo. Leer en voz alta te ayuda a mejorar la pronunciación. La fluidez lectora se logra con perseverancia. Las frases cortas son ideales para practicar la lectura. Leer con precisión es tan importante como leer rápido. La velocidad lectora es clave para una buena comprensión. Los buenos lectores disfrutan de las historias escritas. La lectura es una habilidad que se perfecciona con el tiempo. Las palabras bien pronunciadas transmiten mejor el mensaje. Cada palabra cuenta en la fluidez lectora. La lectura es un viaje a mundos desconocidos. Las historias están hechas para ser leídas y contadas. La lectura diaria aumenta tu vocabulario. Practicar la lectura en voz alta mejora tu confianza. Leer es una habilidad esencial para el éxito académico. Los libros son una ventana al conocimiento. La práctica hace al maestro, también en la lectura. Las palabras escritas tienen un poder increíble. Leer bien es un arte que se desarrolla. La lectura rápida y fluida se logra con práctica diaria. Las frases bien construidas hacen la lectura más fácil. Un buen lector puede capturar la esencia del texto. La lectura te abre puertas a nuevas experiencias. Cada libro leído es un paso más hacia la sabiduría.";

  // Dividir el texto en frases usando el punto como delimitador
  const phrasesToRead = textToRead.split('. ').map((phrase) => phrase.trim());

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitas otorgar permisos para grabar audio.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  // Controla la aparición de frases cada 2 segundos
  useEffect(() => {
    let interval = null;
    if (isRecording && phraseIndex < phrasesToRead.length) {
      interval = setInterval(() => {
        setPhraseIndex((prevIndex) => prevIndex + 1);
      }, 3000); // 2000 ms = 2 segundos
    } else if (phraseIndex >= phrasesToRead.length) {
      stopRecording();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, phraseIndex]);

  // Función para manejar el tiempo de lectura
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      stopRecording();
    }
  }, [isRecording, timeLeft]);

  // Iniciar grabación
  async function startRecording() {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setRecording(recording);
      setIsRecording(true);
      setTimeLeft(60); // Reiniciar el tiempo a 1 minuto
      setPhraseIndex(0); // Reiniciar el índice de frases
    } catch (err) {
      console.error('Error al iniciar la grabación:', err);
    }
  }

  // Detener grabación y enviar archivo a la API
  async function stopRecording() {
    if (recordingRef.current) {
      setIsRecording(false);
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecordedURI(uri);
        recordingRef.current = null;
        console.log('Audio grabado guardado en:', uri);

        // Subir el archivo a la API
        await uploadAudio(uri);

        // Reproducir el archivo grabado (opcional)
        const { sound } = await Audio.Sound.createAsync(
          { uri: uri },
          { shouldPlay: false }
        );
        setSound(sound);

      } catch (err) {
        console.error('Error al detener la grabación:', err);
      }
    }
  }

  // Función para subir el archivo de audio a la API
  async function uploadAudio(uri) {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/m4a', // Asegúrate de usar el tipo MIME correcto según el formato de tu archivo
      name: 'recording.m4a', // Nombre del archivo
    });

    try {
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la carga');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Fluidez Lectora</Text>

      <Text style={styles.phraseToRead}>
        {phrasesToRead[phraseIndex] || "Fin de la prueba"}
      </Text>

      <AnimatedCircularProgress
        size={200}
        width={15}
        fill={(60 - timeLeft) * (100 / 60)} // Calcula el progreso en base al tiempo restante
        tintColor="#2A6F97"
        backgroundColor="#f0f0f0"
        style={styles.circularProgress}
      >
        {() => (
          <TouchableOpacity
            style={[styles.micContainer, isRecording && styles.recording]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Image
              source={require('../../assets/Microfono.png')} // Ruta de la imagen de micrófono
              style={styles.micImage}
            />
          </TouchableOpacity>
        )}
      </AnimatedCircularProgress>

      {isRecording ? (
        <Text style={styles.recordingText}>Recording...</Text>
      ) : (
        <Text style={styles.footerText}></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2A6F97',
  },
  phraseToRead: {
    marginTop: 20,
    fontSize: 30,
    color: '#000',
    textAlign: 'center',
  },
  circularProgress: {
    marginTop: 30,
  },
  micContainer: {
    borderWidth: 5,
    borderRadius: 100,
    borderColor: '#2A6F97',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    borderColor: '#ff3b30',
  },
  micImage: {
    width: 100,
    height: 100,
  },
  recordingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
});
