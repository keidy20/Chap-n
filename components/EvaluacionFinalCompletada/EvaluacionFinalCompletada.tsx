import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const EvaluacionFinalCompletada: React.FC = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const { similitud, cantidadPalabras } = useLocalSearchParams();

  console.log('Similitud ', similitud);
  console.log('Cantidad Palabras ', cantidadPalabras);

  useEffect(() => {
    // Función para cargar y reproducir el sonido
    const playCongratulationsAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/EvaluacionFinal1.mp3') // Asegúrate de tener este archivo de audio en tu carpeta de assets
      );
      setSound(sound);
      await sound.playAsync();
    };

    playCongratulationsAudio();

    // Limpiar el sonido cuando el componente se desmonte
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handleContinue = () => {
    router.push('/home'); // Cambia por la ruta que desees para continuar
  };

  return (
    <View style={styles.container}>
      <Icon name="celebration" size={90} color="#FFD700" style={styles.celebrationIcon} />
      <Text style={styles.congratulationsText}>¡Felicidades!</Text>
      <Text style={styles.messageText}>
        Has completado la Evaluación Final con éxito.</Text>
      <Text style={styles.messageText}>Total de palabras dichas: {cantidadPalabras}</Text>
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleContinue}>
          <Icon name="arrow-forward" size={50} color="#fff" />
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
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20, // Pegado al fondo de la pantalla
    left: 20,
    right: 0,
    width: '100%',
    backgroundColor: '#2A6F97',
    borderRadius: 10,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, // Altura ajustada del botón
    backgroundColor: '#2A6F97',
    borderRadius: 10,
  },
  congratulationsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 20,
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
    top: 20
  },
  buttonText: {
    fontSize: 25,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default EvaluacionFinalCompletada;
