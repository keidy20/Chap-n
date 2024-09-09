import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function FluidezLectoraComponent() {
  
  const baseUrl = process.env.EXPO_PUBLIC_URL;

  const recordingRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minuto
  const [phraseIndex, setPhraseIndex] = useState(0);

  const textToRead = "Este es un ejemplo de una frase corta.";
  
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

  useEffect(() => {
    let phraseInterval = null;
    let timerInterval = null;

    console.log('is recording ', isRecording)
    if (isRecording) {
      phraseInterval = setInterval(() => {
        setPhraseIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= phrasesToRead.length) {
            stopRecording(); // Detener la grabación si se han mostrado todas las frases
            return prevIndex;
          }
          return nextIndex;
        });
      }, 3000);

      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            stopRecording(); // Detener la grabación si el tiempo se agota
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(phraseInterval);
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(phraseInterval);
      clearInterval(timerInterval);
    };
  }, [isRecording]);

  async function startRecording() {
    try {
      console.log("comienza la grabada")
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setTimeLeft(60); // Reiniciar el tiempo a 1 minuto
      setPhraseIndex(0); // Reiniciar el índice de frases
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
        // Subir el archivo a la API
        await uploadAudio(uri);
      } catch (err) {
        console.error('Error al detener la grabación:', err);
      }
    }

    async function uploadAudio(uri) {
      const formData = new FormData();
      
      // Obtén el archivo desde la URI
      const file = {
        uri: uri,
        name: 'output.mp3', // Cambia la extensión según el formato de grabación
        type: 'audio/mp3' // Cambia el tipo MIME según el formato de grabación
      };
    
      formData.append('file', file);
      formData.append('texto', textToRead)

      console.log('Formulario ', formData)
    
      try {
        const response = await fetch(`${baseUrl}/speach-to-text/compare-by-audio`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        const result = await response.json();
        console.log('Upload success:', result);
      } catch (err) {
        console.error('Error uploading audio:', err);
      }
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
  subHeaderText: {
    fontSize: 18,
    marginTop: 10,
    color: '#000',
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