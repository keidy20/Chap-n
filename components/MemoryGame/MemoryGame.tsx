import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const generateCards = (): string[] => {
  const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  const selectedLetters = letters.sort(() => 0.5 - Math.random()).slice(0, 3);
  const pairs = [...selectedLetters, ...selectedLetters];
  return pairs.sort(() => 0.5 - Math.random());
};

const MemoryGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [cards, setCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first] === cards[second]) {
        setMatchedCards((prev) => [...prev, first, second]);
        setFlippedCards([]);
        speakAndAnimate('¡Correcto!');
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
        speakAndAnimate('Incorrecto, intenta de nuevo');
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (gameStarted) {
      speakAndAnimate('Encuentra las parejas de letras');
    }
  }, [gameStarted]);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      speakAndAnimate('¡Lo lograste! Continúa con tu aprendizaje.');
    }
  }, [matchedCards, cards]);

  const speakAndAnimate = (message: string) => {
    setIsSpeaking(true);
    Speech.speak(message, {
      language: 'es-ES',
      onDone: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    if (isSpeaking) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isSpeaking]);

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

  const stopAnimation = () => {
    animation.stopAnimation();
    animation.setValue(0);
  };

  const handleCardPress = (index: number): void => {
    if (
      flippedCards.length < 2 &&
      !flippedCards.includes(index) &&
      !matchedCards.includes(index)
    ) {
      setFlippedCards((prev) => [...prev, index]);
      speakAndAnimate(cards[index]);
    }
  };

  const startGame = (): void => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setGameStarted(true);
  };

  return (
    <LinearGradient
      colors={['#2A6F97', '#FFFFFF']}
      style={styles.container}
    >
      {!gameStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Comenzar Juego de Memoria</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.gameContainer}>
          {isSpeaking && (
            <Animated.View style={[styles.speakerIcon, { opacity: animation }]}>
              <Icon name="volume-up" size={60} color="#ff6347" />
            </Animated.View>
          )}
          <View style={styles.cardsContainer}>
            {cards.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  flippedCards.includes(index) || matchedCards.includes(index)
                    ? styles.flippedCard
                    : styles.unflippedCard,
                ]}
                onPress={() => handleCardPress(index)}
              >
                {(flippedCards.includes(index) || matchedCards.includes(index)) && (
                  <Text style={styles.letter}>{letter}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  startButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  speakerIcon: {
    position: 'absolute',
    top: -200,
    right: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: 80,
    height: 120,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  unflippedCard: {
    backgroundColor: '#ff6347',
  },
  flippedCard: {
    backgroundColor: '#90ee90',
  },
  letter: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MemoryGame;
