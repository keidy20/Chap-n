import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons'; // Asegúrate de tener instalado el paquete @expo/vector-icons

type VocabularyData = {
  [key: string]: string[];
};

const vocabularyData: {
  vowels: VocabularyData;
  consonants: VocabularyData;
  combinations: VocabularyData;
} = {
  vowels: {
    A: ['Abeja', 'Árbol', 'Amo'],
    E: ['Elefante', 'Escuela', 'Espejo'],
    I: ['Iglesia', 'Isla', 'Insecto'],
    O: ['Oso', 'Ojo', 'Ostra'],
    U: ['Uva', 'Urraca', 'Uniforme'],
  },
  consonants: {
    B: ['Bicicleta', 'Bote', 'Búho'],
    C: ['Cámara', 'Cebra', 'Coche'],
    D: ['Dado', 'Dinero', 'Dedo'],
    F: ['Flor', 'Fresa', 'Faro'],
    // Agrega más consonantes y palabras según sea necesario
  },
  combinations: {
    CH: ['Chico', 'Chicle', 'Chaqueta'],
    SH: ['Shampoo', 'Shirt', 'Shakira'], // Algunos términos en español tienen influencia de otros idiomas
    TH: ['Thanos', 'Thermo', 'Thrift'], // Ejemplo de palabras no puramente en español, ajustar según sea necesario
    // Agrega más combinaciones y palabras según sea necesario
  },
};

const Vocabulario: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'vowels' | 'consonants' | 'combinations' | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleCategorySelect = (category: 'vowels' | 'consonants' | 'combinations') => {
    setSelectedCategory(category);
    setSelectedLetter(null);
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    const words = vocabularyData[selectedCategory as keyof typeof vocabularyData][letter];
    Speech.speak(words.join(', '), { language: 'es' });
  };

  const handleGoBack = () => {
    if (selectedLetter) {
      setSelectedLetter(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const renderVocabulary = () => {
    if (selectedCategory && selectedLetter) {
      const words = vocabularyData[selectedCategory as keyof typeof vocabularyData][selectedLetter];
      return (
        <View style={styles.wordsContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          {words.map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderCategories = () => {
    if (selectedCategory) {
      const letters = Object.keys(vocabularyData[selectedCategory as keyof typeof vocabularyData]);
      return (
        <ScrollView contentContainerStyle={styles.lettersContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <FontAwesome name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          {letters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.letterButton}
              onPress={() => handleLetterSelect(letter)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    return (
      <View style={styles.categoriesContainer}>
        {Object.keys(vocabularyData).map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category as 'vowels' | 'consonants' | 'combinations')}
          >
            <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {selectedLetter ? renderVocabulary() : selectedCategory ? renderCategories() : (
        <View style={styles.categoriesContainer}>
          {Object.keys(vocabularyData).map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => handleCategorySelect(category as 'vowels' | 'consonants' | 'combinations')}
            >
              <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  categoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  lettersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterButton: {
    backgroundColor: '#ddd',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 24,
  },
  wordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordItem: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 24,
  },
  goBackButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});

export default Vocabulario;
