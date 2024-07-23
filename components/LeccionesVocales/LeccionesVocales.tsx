import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

const LeccionesVocales: React.FC<{ letter: string }> = ({ letter }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const speakLetter = () => {
    Speech.speak(letter, { language: 'es' });
  };

  const handleExercise1 = () => {
    if (answer.toLowerCase() === letter.toLowerCase()) {
      setFeedback('¡Correcto!');
    } else {
      setFeedback('Inténtalo de nuevo.');
    }
  };

  return (
    <LinearGradient
      colors={['#a1c4fd', '#c2e9fb']}
      style={styles.container}
    >
      <Text style={styles.title}>Lección de la letra {letter}</Text>
      <View style={styles.letterContainer}>
        <Text style={styles.letter}>{letter.toUpperCase()}</Text>
        <Text style={styles.letter}>{letter.toLowerCase()}</Text>
      </View>
      <TouchableOpacity style={styles.speakerIcon} onPress={speakLetter}>
        <Image
          source={require('../../assets/estudio.jpg')} 
          style={styles.speakerImage}
        />
      </TouchableOpacity>

      <View style={styles.exerciseContainer}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => setFeedback('Incorrecto')}>
            <Text style={styles.buttonText}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => setFeedback('¡Correcto!')}>
            <Text style={styles.buttonText}>{letter}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => setFeedback('Incorrecto')}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  letterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 30,
  },
  letter: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#fff',
  },
  speakerIcon: {
    marginBottom: 30,
  },
  speakerImage: {
    width: 50,
    height: 50,
  },
  instruction: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  exerciseContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
  },
  checkButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export default LeccionesVocales;
