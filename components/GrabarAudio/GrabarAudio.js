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

  const textToRead = "Este es un ejemplo de una frase corta. Otra frase para medir la fluidez lectora. Sigue leyendo para completar la prueba. La lectura fluida es importante para comprender. Leer en voz alta mejora la comprensión.";

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

  useEffect(() => {
    let interval = null;
    if (isRecording && phraseIndex < phrasesToRead.length) {
      interval = setInterval(() => {
        setPhraseIndex((prevIndex) => prevIndex + 1);
      }, 2000);
    } else if (phraseIndex >= phrasesToRead.length) {
      stopRecording();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, phraseIndex]);

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

  async function startRecording() {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setRecording(recording);
      setIsRecording(true);
      setTimeLeft(60);
      setPhraseIndex(0);
    } catch (err) {
      console.error('Error al iniciar la grabación:', err);
    }
  }

  async function stopRecording() {
    if (recordingRef.current) {
      setIsRecording(false);
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecordedURI(uri);
        recordingRef.current = null;
        console.log('Audio grabado guardado en:', uri);

        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        await uploadAudio(base64);
      } catch (err) {
        console.error('Error al detener la grabación:', err);
      }
    } else {
      console.error('No se encontró el grabador al detener la grabación.');
    }
  }

  async function uploadAudio(base64) {
    try {
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: JSON.stringify({ audio: base64 }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const textResponse = await response.text();
      console.log('Respuesta del servidor:', textResponse);

      try {
        const result = JSON.parse(textResponse);
        console.log('Respuesta del servidor (JSON):', result);
      } catch (error) {
        console.log('Respuesta no es JSON:', textResponse);
      }
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
        fill={(60 - timeLeft) * (100 / 60)}
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
              source={require('../../assets/Microfono.png')}
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
