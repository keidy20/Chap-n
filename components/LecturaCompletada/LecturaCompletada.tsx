import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';


const EjercicioCompletado: React.FC = () => {
  const router = useRouter();
  const sound = useRef<Audio.Sound | null>(null); // Referencia para el sonido
  const { nivel } = useLocalSearchParams(); 

  // Función para reproducir el audio
  const playSound = async () => {
    try {
      const { sound: audio } = await Audio.Sound.createAsync(
        require('@/assets/Felicidades.mp3') // Reemplaza con la ruta correcta a tu archivo de audio
      );
      sound.current = audio;
      await sound.current.playAsync();
    } catch (error) {
      console.log('Error al reproducir el sonido:', error);
    }
  };

  // useEffect para reproducir el audio cuando se carga el componente
  useEffect(() => {
    playSound();

    // Limpiar el sonido cuando el componente se desmonta
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const handleContinue = () => {
    // Redirigir según el nivel
    if (nivel === 'Basico') {
      router.push('/menuLecturaBasico'); // Redirige al menú básico
    } else if (nivel === 'Intermedio') {
      router.push('/menuLecturaIntermedio'); // Redirige al menú intermedio
    } else if (nivel === 'Avanzado') {
      router.push('/menuLecturaAvanzado'); // Redirige al menú avanzado
    } else {
      console.warn('Nivel no reconocido:', nivel);
    }
  }
  

  return (
    <View style={styles.container}>
      <Icon name="celebration" size={90} color="#FFD700" style={styles.celebrationIcon} />
      <Text style={styles.congratulationsText}>¡Felicidades!</Text>
      <Text style={styles.messageText}>
        Has completado la lectura con éxito. Continúa así para poder seguir avanzando con tu aprendizaje.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  celebrationIcon: {
    marginBottom: 20,
  },
  congratulationsText: {
    fontSize: 36, // Tamaño de fuente ajustado
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 10,
    textAlign: 'center', // Centrado para pantallas pequeñas
  },
  messageText: {
    fontSize: 18, // Tamaño de fuente ajustado
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  goBackButton: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20, // Tamaño de fuente ajustado
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default EjercicioCompletado;
