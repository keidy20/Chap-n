import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

// Array de imágenes relacionadas con cada letra
const images: { [key: string]: { image: any, name: string } } = {
  'A': { image: require('../../assets/abeja.png'), name: 'ABEJA' },
  'B': { image: require('../../assets/botas.png'), name: 'BOTA' },
  'C': { image: require('../../assets/casa.png'), name: 'CASA' },
  'D': { image: require('../../assets/dado.png'), name: 'DADO' },
  'E': { image: require('../../assets/elefante.png'), name: 'ELEFANTE' },
  'F': { image: require('../../assets/fresa.png'), name: 'FRESA' },
  'G': { image: require('../../assets/gato.png'), name: 'GATO' },
  'H': { image: require('../../assets/hongo.png'), name: 'HONGO' },
  'I': { image: require('../../assets/iglesia.png'), name: 'IGLESIA' },
  'J': { image: require('../../assets/jirafas.png'), name: 'JIRAFA' },
  'K': { image: require('../../assets/koalas.png'), name: 'KOALA' },
  'L': { image: require('../../assets/limon.png'), name: 'LIMÓN' },
  'M': { image: require('../../assets/mariposa.png'), name: 'MARIPOSA' },
  'N': { image: require('../../assets/niña.png'), name: 'NIÑA' },
  'Ñ': { image: require('../../assets/ñoño.png'), name: 'ÑOÑO' },
  'O': { image: require('../../assets/oso.png'), name: 'OSO' },
  'P': { image: require('../../assets/pastel.png'), name: 'PASTEL' },
  'Q': { image: require('../../assets/queso.png'), name: 'QUESO' },
  'R': { image: require('../../assets/rosa.png'), name: 'ROSA' },
  'S': { image: require('../../assets/sandia.png'), name: 'SANDÍA' },
  'T': { image: require('../../assets/tomate.png'), name: 'TOMATE' },
  'U': { image: require('../../assets/uva.png'), name: 'UVA' },
  'V': { image: require('../../assets/vaca.png'), name: 'VACA' },
  'W': { image: require('../../assets/whatsapp.png'), name: 'WHATSAPP' },
  'X': { image: require('../../assets/xilofono.png'), name: 'XILÓFONO' },
  'Y': { image: require('../../assets/yoyo.png'), name: 'YOYO' },
  'Z': { image: require('../../assets/zorro.png'), name: 'ZORRO' },
  // Agrega más imágenes según sea necesario
};

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
  const [roundCount, setRoundCount] = useState<number>(0);
  const [animation] = useState(new Animated.Value(0));
  const [audioCount, setAudioCount] = useState<number>(0);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [imageLabel, setImageLabel] = useState<string>('');

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
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedLetter, correctLetter, audioCount]);

  const startNewRound = () => {
    const correct = generateRandomLetter();
    const position = getRandomIndex(4); // 0 to 3
    setCorrectLetter(correct);
    setSelectedLetter('');
    setShowNextButton(false);
    setShowImage(false);

    // Generar letras y barajarlas solo una vez por ronda
    const letters = Array(4).fill(null).map((_, i) => (i === position ? correct : generateRandomLetter()));
    setShuffledLetters(shuffleArray(letters));
    
    speakAndAnimate(`Encuentra la letra ${correct}`);
  };

  const speakAndAnimate = (message: string) => {
    Speech.speak(message, {
      language: 'es-ES',
      onDone: () => {
        startAnimation();
        setAudioCount(prevCount => prevCount + 1);
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
    if (selectedLetter === '') {
      setSelectedLetter(letter);
      if (letter === correctLetter) {
        setImageLabel(images[correctLetter].name); // Obtener el nombre de la imagen
        speakAndAnimate(`¡Correcto! Esta es la imagen de ${images[correctLetter].name}`);
        setShowNextButton(true);
        setShowImage(true); // Mostrar imagen cuando es correcto
        Speech.speak(`Esta es la imagen de ${images[correctLetter].name}`, { language: 'es-ES' });
      } else {
        speakAndAnimate('Incorrecto, vuelve a intentarlo.');
        setSelectedLetter(''); // Permitir reintentar
      }
    }
  };

  return (
    <LinearGradient
      colors={['#2A6F97', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.gameContainer}>
        {showImage && (
          <View style={styles.imageContainer}>
            <Image source={images[correctLetter].image} style={styles.image} />
            <Text style={styles.imageName}>{images[correctLetter].name}</Text>
          </View>
        )}
        {!showImage && (
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
                      disabled={!!selectedLetter && selectedLetter !== letter}
                    >
                      <Text style={styles.letter}>{letter}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}
        {showNextButton && (
          <TouchableOpacity style={styles.nextButton} onPress={startNewRound}>
            <FontAwesome name="arrow-right" size={40} color="white" />
          </TouchableOpacity>
        )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 400,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#2A6F97',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: '#a1d7e6',
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffff',
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  imageName: {
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ReconocerLetra;
