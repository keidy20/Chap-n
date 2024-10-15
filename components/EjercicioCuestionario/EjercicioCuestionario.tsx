import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const EjercicioCuestionario: React.FC = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const {correctAnswers} = useLocalSearchParams();

  console.log('Cantidad Palabras ', correctAnswers);

  useEffect(() => {
    // Función para cargar y reproducir el sonido
    const playCongratulationsAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/Cuestionario.mp3') // Asegúrate de tener este archivo de audio en tu carpeta de assets
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
    router.push('/menuEjercicios'); // Cambia por la ruta que desees para continuar
  };

  return (
    <View style={styles.container}>
      <Icon name="celebration" size={90} color="#FFD700" style={styles.celebrationIcon} />
      <Text style={styles.congratulationsText}>¡Felicidades!</Text>
      <Text style={styles.messageText}>
        Has completado el cuestionario con éxito.</Text>
      <Text style={styles.messageText}>Total de palabras correctas: {correctAnswers}</Text>
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

export default EjercicioCuestionario;
