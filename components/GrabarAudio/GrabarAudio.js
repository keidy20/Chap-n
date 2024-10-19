import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { router } from 'expo-router';
import { storeToken, getToken, existToken } from "../../utils/TokenUtils";
import { getUsuario, storeUsuario } from "@/utils/UsuarioUtils";
import Modal from 'react-native-modal';

export default function GrabarAudio() {
  const [isStarting, setIsStarting] = useState(true); // Estado para controlar la pantalla de inicio
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 1 minuto
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phrasesToRead, setPhrasesToRead] = useState([]); // Nuevo 
  const [idLeccion, setIdLeccion] = useState(0)
  const [ idEvaluacion, setIdEvaluacion ] = useState(0)
  const [showNextButton, setShowNextButton] = useState(false);
  const [totalPalabras, setTotalPalabras] = useState(0); 
  const [lecciones, setLecciones] = useState([]);  
  const [sound, setSound] = useState();
  const [ enviando, setEnviando ] = useState(false);
  const [recording, setRecording] = useState();
  

  const recordingRef = useRef(null);
  const soundRef = useRef(null); // Para almacenar el sonido de instrucciones

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso denegado', 'Necesitas otorgar permisos para grabar audio.');
        return;
      }
    })();

    fetchPhrasesFromApi();
  }, []);

  async function fetchPhrasesFromApi() {
    try {
      let token = null;
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
        console.log('Usuario ', await getUsuario())
      } else {
        router.navigate('/login')
      }
        const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/lecciones/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });
        const data = await response.json();
        //console.log("Lecciones obtenidas", data);

        if (data && Array.isArray(data)) {
          // Filtra las lecciones por tipoLeccion 'EI'
          const leccionesEI = data.filter(leccion => leccion.tipoLeccion === 'EI');
          
        // Verificamos que haya al menos una lección de tipo "EI"
        if (leccionesEI.length > 0) {
            const evaluaciones = leccionesEI[0].contenido?.Evaluacion;
            console.log('Evaluacion inicial ', leccionesEI[0]?.id)
            setIdEvaluacion(leccionesEI[0]?.id)
            // Convertimos cada objeto de Evaluacion en un array y separamos por punto
            const arraysDeEvaluaciones = evaluaciones.map((evaluacion) => {
                // Dividimos el texto por punto y eliminamos espacios
                const frases = evaluacion?.Texto.split('.').map(frase => frase.trim()).filter(frase => frase !== '');
                return frases;  // Retornamos el array de frases
            });

            setLecciones(arraysDeEvaluaciones);
            console.log(arraysDeEvaluaciones);
             // Establece el primer array de frases en `phrasesToRead`
          setPhrasesToRead(arraysDeEvaluaciones[0] || []);
          setIdLeccion(0);
        }
          
      } else {
          console.error('Error al obtener las frases de la API.');
      }
      
    } catch (error) {
        console.error('Error al llamar a la API de lecciones:', error);
    }
}


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
      }, 4000);

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


  // Reproducir instrucciones de audio al inicio
  useEffect(() => {
    if (isStarting) {
      playInstructionAudio(); // Llamada a la función para reproducir el audio
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync(); // Descargar el audio al desmontar
      }
    };
  }, [isStarting]);

  async function playInstructionAudio() {

    //Detener audio al inicio si existe
    try {
      if (sound) {
        await sound.unloadAsync(); // Detener cualquier audio que esté sonando
      }

    } catch(error) {
      console.log('No se pudo detener el audio')
    }


    try {
      console.log('Cargando sonido...');

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/EvaluacionInicial.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error al reproducir el audio de instrucciones iniciales:', error);
    }
  }

  async function startRecording() {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      
      setIsRecording(true);
      setTimeLeft(10); // Reiniciar el tiempo a 1 minuto
      setShowNextButton(false);
    } catch (err) {
      console.log('Error al iniciar la grabación:', err);
    }
  }

  async function stopRecording() {
    
    if (recordingRef.current) {
      console.log('Se esta deteniendo la grabacion ', recordingRef.current)
      setIsRecording(false);
      setEnviando(true)
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null
        console.log('Audio grabado guardado en:', uri);
        // Subir el archivo a la API
        const result = await uploadAudio(uri);
  
        // Redirigir a LeccionCompletada con el porcentaje
        if (result) {
          console.log('Resultado de palabras ', result)
          setTotalPalabras((prevTotal) => prevTotal + result.cantidadPalabras); // Sumar palabras
          setShowNextButton(true);
          setEnviando(false)
        }
        console.log('Phrase Index', phraseIndex)
        console.log('Ultimo index ', lecciones.length -1)
        if (idLeccion == (lecciones.length -1)) {
          let total = totalPalabras + result.cantidadPalabras
          completarEvaluacion(total)
          router.push({
            pathname: '/evaluacionInicial',
            params: {
              similitud: result.similitud.toFixed(0),
              cantidadPalabras: total 
            }
          })
        }

      } catch (err) {
        console.log('Error al detener la grabación:', err);
      }
    } else {
      console.log('Intendando detener ', recordingRef.current)
    }
  }

  async function uploadAudio(uri) {
    let token = await getToken();
    let usuario = await getUsuario()

    const formData = new FormData();
    const file = {
      uri: uri,
      name: 'output.mp3',
      type: 'audio/mp3'
    };
    formData.append('file', file);
    formData.append('texto', phrasesToRead.join('. '))
    console.log('URL ', `${process.env.EXPO_PUBLIC_URL}/speach-to-text/compare-by-audio`)

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/speach-to-text/compare-by-audio`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`, 
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

  const handleStart = async () => {
    //Detener audio al inicio si existe
    try {
      if (sound) {
        await sound.unloadAsync(); // Detener cualquier audio que esté sonando
      }

    } catch(error) {
      console.log('No se pudo detener el audio')
    }

    setIsStarting(false); // Cambia el estado para mostrar la evaluación
  };

  const completarEvaluacion = async (cantidadPalabras) => {
    let token = null;
    let usuario = await getUsuario()
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
        console.log('Usuario ', usuario)
      } else {
        router.navigate('/login')
      }

    try {
      let body = JSON.stringify({
        username: usuario,
        idLeccion: idEvaluacion,
        completado: true,
        puntuacion: cantidadPalabras
      })
      console.log('Json a enviar ', body)
      const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/usuarios_lecciones/registrar_leccion_by_username`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        },
        body: body
      });
    } catch (error) {
      
    }
  }

  const loadNextLesson = () => {
    if (idLeccion < lecciones.length - 1) {
      const nextLeccionIndex = idLeccion + 1; // Avanzar a la siguiente lección
      setIdLeccion(nextLeccionIndex); // Actualizar el índice de la lección
      setPhrasesToRead(lecciones[nextLeccionIndex] || []); // Establecer el nuevo conjunto de frases
      setPhraseIndex(0);  // Reiniciar el índice de la frase
      setTimeLeft(10);  // Reiniciar el tiempo
      setShowNextButton(false);
    } else {
      console.log("No hay mas evaluaciones")
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={48} color="#2A6F97" />
      </TouchableOpacity>
      {isStarting ? (
        <View style={styles.startContainer}>
          <Text style={styles.startHeaderText}>Instrucciones</Text>
          <Text style={styles.startInstructions}>
            Por favor, lee en voz alta las palabras que aparecen en la pantalla. Se te evaluará para saber cuántas palabras logras decir correctamente en un minuto.
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
          <Text style={styles.phraseToRead}>
            {phrasesToRead.length > 0 && phrasesToRead[phraseIndex]}
          </Text>
  
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={(10 - timeLeft) * (100 / 10)} // Asegúrate de que esta lógica sea correcta
            tintColor="#2A6F97"
            backgroundColor="#f0f0f0"
            style={styles.circularProgress}
          >
            {() => (
              <TouchableOpacity disabled={enviando || showNextButton}
              style={[
                styles.micContainer,
                isRecording && styles.recording,
                (enviando || showNextButton) && styles.disabledMicContainer // Aplica estilo si está deshabilitado
              ]}
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
            <Text style={styles.recordingText}>Grabando...</Text>
          ) : (
            <Text style={styles.footerText}></Text>
          )}
          {showNextButton && (
            <View style={styles.nextButtonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={loadNextLesson}>
              <Icon name="arrow-forward" size={50} color="#fff" />
            </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {/* <Modal isVisible={enviando}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>Enviando al servidor...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal> */}
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
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20, // Pegado al fondo de la pantalla
    left: 20,
    right: 0,
    width: '100%',
    backgroundColor: '#2A6F97',
    borderRadius: 10,
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
  endText: {
    fontSize: 20,
    color: 'red',
    marginTop: 20,
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
  disabledMicContainer: {
    // estilos cuando el botón está deshabilitado
    backgroundColor: '#d3d3d3', // un color gris claro
    opacity: 0.6, // para hacer que se vea más transparente
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
    top: 30,
    left: 4,
    padding: 10,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, // Altura ajustada del botón
    backgroundColor: '#2A6F97',
    borderRadius: 10,
  },
});