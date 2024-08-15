import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper'; // Importar ProgressBar

type VowelKey = 'A' | 'E' | 'I' | 'O' | 'U';

const VocalGame: React.FC = () => {
  const [currentVowel, setCurrentVowel] = useState<VowelKey>('A');
  const [selectedVowel, setSelectedVowel] = useState<VowelKey | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);

  const images: Record<VowelKey, any> = {
    A: require('../../assets/abeja.png'),
    E: require('../../assets/elefante.png'),
    I: require('../../assets/iglesia.png'),
    O: require('../../assets/oso.png'),
    U: require('../../assets/uva.png'),
  };

  const vowelNames: Record<VowelKey, string> = {
    A: 'Abeja',
    E: 'Elefante',
    I: 'Iglesia',
    O: 'Oso',
    U: 'Uva',
  };

  const vowels: VowelKey[] = ['A', 'E', 'I', 'O', 'U'];

  useEffect(() => {
    if (isGameActive) {
      Speech.speak(`Encuentra la vocal ${currentVowel}`);
    }
  }, [isGameActive, currentVowel]);

  const vowelChoices = () => {
    const choices = [currentVowel];
    while (choices.length < 4) {
      const randomVowel = vowels[Math.floor(Math.random() * vowels.length)];
      if (!choices.includes(randomVowel)) {
        choices.push(randomVowel);
      }
    }
    return choices.sort(() => Math.random() - 0.5);
  };

  const handleChoice = (vowel: VowelKey) => {
    if (vowel === currentVowel) {
      Speech.speak('Correcto');
      Speech.speak(`${vowelNames[vowel]}`);
      setShowImage(true);
      setIsGameActive(false);
    } else {
      Speech.speak('Incorrecto, vuelve a intentarlo');
    }
  };

  const handleNext = () => {
    if (progress < vowels.length - 1) {
      setCurrentVowel(vowels[progress + 1]);
      setSelectedVowel(null);
      setShowImage(false);
      setProgress(progress + 1);
      setIsGameActive(true);
    } else {
      Speech.speak('¡Felicidades! Has terminado el juego');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          progress={(progress + 1) / vowels.length}
          color="#2A6F97"
          style={styles.progressBar}
        />
      </View>
      <View style={styles.contentContainer}>
        {isGameActive ? (
          <>
            <View style={styles.cardContainer}>
              {vowelChoices().map((vowel) => (
                <TouchableOpacity key={vowel} style={styles.card} onPress={() => handleChoice(vowel)}>
                  <Text style={styles.cardText}>{vowel}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.nextButtonContainer}>
              <TouchableOpacity onPress={handleNext} disabled={!showImage} style={styles.nextButton}>
                <FontAwesome name="arrow-right" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : showImage ? (
          <View style={styles.imageContainer}>
            <Image source={images[currentVowel]} style={styles.image} />
            <Text style={styles.imageText}>{`${vowelNames[currentVowel]}`}</Text>
            <View style={styles.nextButtonContainer}>
              <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                <FontAwesome name="arrow-right" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'relative', // Agregado para que el progressBarContainer esté en relación con este contenedor
  },
  progressBarContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 1, // Asegura que la barra de progreso esté por encima de otros elementos
  },
  progressBar: {
    height: 12,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    width: '40%',
    height: 120,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: '#05517e',
  },
  cardText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButtonContainer: {
    backgroundColor: '#2A6F97',
    width: '95%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 280,
    height: 280,
  },
  imageText: {
    fontSize: 30,
    color: '#000',
    margin: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VocalGame;
