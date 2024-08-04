import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const abecedario = [
  { lower: 'a', upper: 'A' }, { lower: 'b', upper: 'B' }, { lower: 'c', upper: 'C' },
];

const IntroduccionSeccion: React.FC = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const currentLetter = abecedario[currentLetterIndex];
  const [highlighted, setHighlighted] = useState({ lower: false, upper: false });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const speakAndHighlight = async () => {
      if (currentLetter) {
        // Pronunciar la letra minúscula
        Speech.speak(`${currentLetter.lower} minúscula`, {
          language: 'es',
          onStart: () => setHighlighted({ lower: true, upper: false }),
          onDone: () => {
            // Pronunciar la letra mayúscula después de una pequeña pausa
            setTimeout(() => {
              Speech.speak(`${currentLetter.upper} mayúscula`, {
                language: 'es',
                onStart: () => setHighlighted({ lower: false, upper: true }),
                onDone: () => {
                  // Pasar a la siguiente letra después de otra pequeña pausa
                  setTimeout(() => {
                    setHighlighted({ lower: false, upper: false });
                    if (currentLetterIndex < abecedario.length - 1) {
                      setCurrentLetterIndex((prevIndex) => prevIndex + 1);
                    } else {
                      setCompleted(true);
                    }
                  }, 500);
                },
              });
            }, 500);
          },
        });
      }
    };

    if (!completed) {
      speakAndHighlight();
    }else{
      router.navigate('/leccionCompleta');
    }
  }, [currentLetter, completed]);

  return (
    <LinearGradient
      colors={['#2A6F97', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.letterContainer}>
        <Text style={[styles.letter, highlighted.lower && styles.highlightedLetter]}>
          {currentLetter.lower}
        </Text>
        <Text style={[styles.letter, highlighted.upper && styles.highlightedLetter]}>
          {currentLetter.upper}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letter: {
    fontSize: 150,
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  highlightedLetter: {
    color: '#05517e', // Color resaltado
  },
  congratulationsContainer: {
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    color: '#2A6F97',
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default IntroduccionSeccion;
