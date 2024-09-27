import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const LecturaCompletada: React.FC = () => {
  const router = useRouter();

  const { similitud, cantidadPalabras } = useLocalSearchParams();
  console.log('Similitud ', similitud)
  console.log('Cantidad Palabras ', cantidadPalabras)

  const handleContinue = () => {
    router.push('/menuLecturaBasico'); // Cambia por la ruta que desees para continuar
  };

  return (
    <View style={styles.container}>
      <Icon name="celebration" size={90} color="#FFD700" style={styles.celebrationIcon} />
      <Text style={styles.congratulationsText}>¡Felicidades!</Text>
      <Text style={styles.messageText}>Has completado la lectura con éxito. Continúa asi para poder seguir avanzando con tu aprendizaje</Text>
      <Text>Cantidad de palabras dichas: {cantidadPalabras}</Text>
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
  continueButton: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  goBackButton: {
    backgroundColor: '#2A6F97',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 25,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LecturaCompletada;