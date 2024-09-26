import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { router } from 'expo-router';
import * as Speech from 'expo-speech'; // Importa expo-speech

export default function FluidezLectoraComponent() {
  const [isStarting, setIsStarting] = useState(true); // Estado para controlar la pantalla de inicio
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minuto
  const [phraseIndex, setPhraseIndex] = useState(0);

  const textToRead = "Este es un ejemplo de una frase corta. Otra frase para medir la fluidez lectora";
  const phrasesToRead = textToRead.split('. ').map((phrase) => phrase.trim());

  const recordingRef = useRef(null);

  useEffect(() => {
    setTimeLeft(60);
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso denegado', 'Necesitas otorgar permisos para grabar audio.');
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

  useEffect(() => {
    if (isStarting) {
      const instructions = "Por favor, lee en voz alta las palabras que aparecen en la pantalla. Se te evaluará para saber cuántas palabras lograr decir correctamente en un minuto. Inicia la Evaluación";
      Speech.speak(instructions); // Reproduce el texto en voz alta cuando la pantalla de inicio se muestra
    }
  }, [isStarting]);

  async function startRecording() {
    try {
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
      console.log('Se esta deteniendo la grabacion ', recordingRef.current)
      setIsRecording(false);
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecordedURI(uri);
        recordingRef.current = null
        console.log('Audio grabado guardado en:', uri);
        // Subir el archivo a la API
        const result = await uploadAudio(uri);
  
        // Redirigir a LeccionCompletada con el porcentaje

        router.push({
          pathname: '/leccionCompleta',
          params: {
            similitud: result.similitud.toFixed(0),
            cantidadPalabras:  result.cantidadPalabras
          }
        })
      } catch (err) {
        console.error('Error al detener la grabación:', err);
      }
    } else {
      console.log('Intendando detener ', recordingRef.current)
    }
  }

  async function uploadAudio(uri) {
    const formData = new FormData();
    const file = {
      uri: uri,
      name: 'output.mp3',
      type: 'audio/mp3'
    };
    formData.append('file', file);
    formData.append('texto', textToRead)

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/speach-to-text/compare-by-audio`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Resultado del servicio ', result)
      if (typeof result.similitud === 'number') {
        return result;
      } else {
        console.log('Error', 'No se pudo obtener el porcentaje de similitud.');
      }
    } catch (err) {
      console.error('Error uploading audio:', err);
      console.log('Error', 'Ocurrió un error al subir el audio.');
    }
  }

  const handleStart = () => {
    Speech.stop()
    setIsStarting(false); // Cambia el estado para mostrar la evaluación
  };

  return (
    <View style={styles.container}>
      {isStarting ? (
        <View style={styles.startContainer}>
          <Text style={styles.startHeaderText}>Instrucciones</Text>
          <Text style={styles.startInstructions}>
            Por favor, lee en voz alta la frase que aparece en la pantalla. La grabación durará un minuto.
          </Text>
          <Image
            source={require('../../assets/Instrucciones.png')} // Cambia la imagen según tus necesidades
            style={styles.startImage}
          />
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Iniciar Evaluación</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Botón de regresar */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="close" size={40} color="#2A6F97" />
          </TouchableOpacity>
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
        </>
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
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startHeaderText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2A6F97',
  },
  startInstructions: {
    fontSize: 22,
    marginTop: 10,
    textAlign: 'center',
    color: '#000',
  },
  startImage: {
    width: 250,
    height: 250,
    marginTop: 20,
  },
  startButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2A6F97',
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
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
    fontSize: 22,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 22,
    color: '#999',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 6,
    padding: 10,
  },
});
