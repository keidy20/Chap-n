import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';

const generateRandomLetter = (): string => {
  const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

const ReconocerLetra: React.FC = () => {
  const [correctLetter, setCorrectLetter] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [roundCount, setRoundCount] = useState<number>(0);
  const [correctPosition, setCorrectPosition] = useState<number>(0);
  const [showText, setShowText] = useState<boolean>(true);
  const [animation] = useState(new Animated.Value(0));
  const [audioCount, setAudioCount] = useState<number>(0);

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (roundCount > 0 && audioCount < 2) {
      speakAndAnimate(`Encuentra la letra ${correctLetter}`);
    }
  }, [roundCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedLetter && audioCount < 2) {
        speakAndAnimate(`Encuentra la letra ${correctLetter}`);
      }
    }, 5000); // Repite el audio cada 5 segundos si no se ha seleccionado ninguna letra

    return () => clearInterval(interval);
  }, [selectedLetter, correctLetter, audioCount]);

  const startNewRound = () => {
    if (roundCount < 3) {
      const correct = generateRandomLetter();
      const position = getRandomIndex(4); // 0 to 3
      setCorrectLetter(correct);
      setCorrectPosition(position);
      setRoundCount(roundCount + 1);
      setSelectedLetter('');
      setFeedbackMessage('');
      setShowText(roundCount === 0); // Show text only in the first round
      setAudioCount(0); // Reset audio count for the new round
      speakAndAnimate(`Encuentra la letra ${correct}`);
    }
  };

  const speakAndAnimate = (message: string) => {
    Speech.speak(message, {
      language: 'es-ES',
      onDone: () => {
        startAnimation();
        setAudioCount(prevCount => prevCount + 1); // Increment the audio count
      },
    });
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleLetterSelection = (letter: string) => {
    setSelectedLetter(letter);
    if (letter === correctLetter) {
      speakAndAnimate('¡Correcto! Continúa aprendiendo.');
      setTimeout(startNewRound, 2000); // Wait for 2 seconds before starting a new round
    } else {
      speakAndAnimate('Incorrecto, vuelve a intentarlo.');
    }
  };

  const letters = Array(4).fill(null).map((_, i) => (i === correctPosition ? correctLetter : generateRandomLetter()));
  const shuffledLetters = shuffleArray([...letters]);

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.gameContainer}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
        <View style={styles.speakerIcon}>
          <Text style={styles.speakerText}>Escucha: encuentra la letra</Text>
          {showText && correctLetter !== '' && (
            <Text style={styles.speakerText}>{correctLetter}</Text>
          )}
        </View>
        <View style={styles.cardsContainer}>
          {[0, 1].map(row => (
            <View key={row} style={styles.row}>
              {[0, 1].map(col => {
                const index = row * 2 + col;
                const letter = shuffledLetters[index];
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.card,
                      selectedLetter === letter ? styles.selectedCard : null,
                    ]}
                    onPress={() => handleLetterSelection(letter)}
                    disabled={!!selectedLetter}
                  >
                    <Text style={styles.letter}>{letter}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
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
  gameContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 400,
  },
  feedbackContainer: {
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  speakerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  speakerText: {
    fontSize: 18,
    color: 'white',
    marginRight: 10,
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff6347',
  },
  selectedCard: {
    backgroundColor: '#90ee90',
  },
  letter: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReconocerLetra;

