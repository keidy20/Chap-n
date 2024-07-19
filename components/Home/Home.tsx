import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';

const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const Home: React.FC = () => {
  const router = useRouter();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  useEffect(() => {
    // Texto de bienvenida
    const welcomeText =
      "A continuación, haremos un recorrido para saber el nivel de aprendizaje con el que cuentas. Para ello, iniciaremos con las vocales. Presiona la opción que se te resalta para poder continuar.";

    // Reproducir el texto de bienvenida
    Speech.speak(welcomeText, { language: 'es' });

    // Iniciar con la primera lección activa
    setActiveLessonIndex(0);
  }, []);

  const handleLessonPress = (index: number) => {
    if (index === activeLessonIndex) {
      router.push(`/recorrido-letra/${alphabet[index]}`);
    }
  };

  return (
    <LinearGradient
      colors={['#3faed6', '#1e5799']} // Colores del degradado
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.languageText}>Lecciones</Text>
          <View style={styles.iconContainer}>
            <Icon name="volume-up" size={20} color="#fff" />
          </View>
        </View>
        <Text style={styles.subtitle}>28 Lecciones</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {alphabet.map((letter, index) => (
          <TouchableOpacity
            key={letter}
            onPress={() => handleLessonPress(index)}
            activeOpacity={index === activeLessonIndex ? 0.7 : 1}
          >
            <View style={[styles.card, index === activeLessonIndex && styles.highlightedCard]}>
              <Text style={styles.cardTitle}>Letra {letter}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSubtitle}>5 lecturas</Text>
                <Icon name="play-circle" size={20} color="#ff6347" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  languageText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // Asegura que el contenido no esté pegado al borde inferior
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  highlightedCard: {
    borderColor: '#ff6347',
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Home;
