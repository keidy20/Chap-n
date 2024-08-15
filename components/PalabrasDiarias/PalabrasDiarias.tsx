import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Animated } from 'react-native';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

// Datos de palabras e imágenes
const wordImageData = [
  { id: '1', word: 'Abeja', image: require('../../assets/abeja.png') },
  { id: '2', word: 'Botas', image: require('../../assets/botas.png') },
  { id: '3', word: 'Fresa', image: require('../../assets/fresa.png') },
  // Añadir más palabras e imágenes aquí
];

const WordImageMatchingGame: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  const speakWord = (word: string) => {
    Speech.speak(word, { language: 'es' });
  };

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    speakWord(word);
  };

  const handleImagePress = (imageWord: string) => {
    setSelectedImage(imageWord);
    if (selectedWord === imageWord) {
      setFeedbackMessage('¡Correcto!');
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      Speech.speak('¡Correcto!', { language: 'es' });
    } else {
      setFeedbackMessage('Inténtalo de nuevo');
      Speech.speak('Inténtalo de nuevo', { language: 'es' });
    }
  };

  const renderWordItem = ({ item }: { item: { id: string; word: string } }) => (
    <TouchableOpacity
      style={[styles.item, selectedWord === item.word && styles.selectedItem]}
      onPress={() => handleWordPress(item.word)}
    >
      <Text style={styles.itemText}>{item.word}</Text>
    </TouchableOpacity>
  );

  const renderImageItem = ({ item }: { item: { id: string; word: string; image: any } }) => (
    <TouchableOpacity
      style={[styles.imageContainer, selectedImage === item.word && styles.selectedImage]}
      onPress={() => handleImagePress(item.word)}
    >
      <Image source={item.image} style={styles.image} />
    </TouchableOpacity>
  );

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empareja las palabras con las imágenes</Text>
      <View style={styles.wordsContainer}>
        {wordImageData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, selectedWord === item.word && styles.selectedItem]}
            onPress={() => handleWordPress(item.word)}
          >
            <Text style={styles.itemText}>{item.word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={wordImageData}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.imagesContainer}
      />
      {feedbackMessage && (
        <Animated.View style={[styles.feedbackContainer, animatedStyle]}>
          <Text style={styles.feedback}>{feedbackMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: 100,
    alignItems: 'center',
    elevation: 3, // Añade sombra en Android
    shadowColor: '#000', // Añade sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectedItem: {
    backgroundColor: '#0056b3',
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    margin: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#007bff',
    borderWidth: 2,
  },
  selectedImage: {
    borderColor: '#0056b3',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  feedbackContainer: {
    marginTop: 20,
  },
  feedback: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});

export default WordImageMatchingGame;
