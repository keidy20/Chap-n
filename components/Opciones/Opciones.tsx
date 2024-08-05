import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Opciones: React.FC = () => {
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState([false, false, false, false, false, false]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  useEffect(() => {
    const fetchLessonProgress = async () => {
      try {
        const storedLessons = await AsyncStorage.getItem('completedLessons');
        const parsedLessons = storedLessons ? JSON.parse(storedLessons) : [false, false, false, false, false, false];
        setCompletedLessons(parsedLessons);
      } catch (error) {
        console.error('Error fetching lesson progress', error);
      }
    };

    fetchLessonProgress();

    const welcomeText = "A continuación, haremos un recorrido para saber el nivel de aprendizaje con el que cuentas. Para ello, iniciaremos con las vocales. Presiona la opción que se te resalta para poder continuar.";
    Speech.speak(welcomeText, {
      language: 'es',
      onDone: () => {
        setIsOverlayVisible(false);
        startPulseAnimation();
      },
    });
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleCardPress = (index: number) => {
    if (index === 0 || completedLessons[index - 1]) {
      setSelectedCard(index);
      if (index === 1) { // Si es la segunda lección
        router.navigate('/memoria'); // Redirige a MemoryGame
      } else {
        router.navigate('/lecciones'); // Redirige a otras lecciones
      }
    }
  };

  const lessonTitles = [
    "Abecedario",
    "Reconocimiento de sonido y letras",
    "Sílabas y combinaciones de letras",
    "Palabras simples",
    "Frases simples",
    "Comprensión Lectora"
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2A6F97', '#539ec9']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.languageText}>INICIO</Text>
        </View>
        <Text style={styles.subtitle}>2 Lecciones</Text>
      </LinearGradient>
      <View style={styles.cardContainer}>
        {lessonTitles.map((title, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card,
              (selectedCard === index || (index === 0 && completedLessons[0])) && styles.highlightedCard,
              !completedLessons[index] && !((index === 0) || completedLessons[index - 1]) && styles.disabledCard,
              (selectedCard === index || (index === 0 && completedLessons[0])) && {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity 
              onPress={() => handleCardPress(index)}
              disabled={isOverlayVisible || !completedLessons[index] && !(index === 0 || completedLessons[index - 1])}
            >
              <Text style={styles.cardTitle}>{title}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSubtitle}>5 lecturas</Text>
                {completedLessons[index] ? (
                  <Icon name="check" size={20} color="#05517e" />
                ) : !((index === 0) || completedLessons[index - 1]) ? (
                  <Icon name="lock" size={20} color="#888" />
                ) : (
                  <Icon name="arrow-right" size={20} color="#05517e" />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
        {isOverlayVisible && (
          <View style={styles.overlay}>
            <Image
              source={require('../../assets/Ondas.gif')} // Reemplaza con la ruta de tu GIF
              style={styles.soundWave}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: '30%',
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
    position: 'relative',
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
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#7e051f',
  },
  disabledCard: {
    opacity: 0.5,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  soundWave: {
    width: 400,
    height: 300,
  },
});

export default Opciones;
