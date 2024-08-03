import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';

const Opciones: React.FC = () => {
  const router = useRouter();
  const [isBouncing, setIsBouncing] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([false, false, false, false, false, false]); // Cambia según el número de lecciones
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    // Texto de bienvenida
    const welcomeText = "A continuación, haremos un recorrido para saber el nivel de aprendizaje con el que cuentas. Para ello, iniciaremos con las vocales. Presiona la opción que se te resalta para poder continuar.";

    // Reproducir el texto de bienvenida y comenzar la animación cuando termine
    Speech.speak(welcomeText, {
      language: 'es',
      onDone: () => setIsBouncing(true),
    });
  }, []);

  // Función para manejar la selección de la tarjeta
  const handleCardPress = (index: number) => {
    if (index === 0 || completedLessons[0]) { // Asegurarse de que la primera lección esté completada o sea la primera tarjeta
      setSelectedCard(index);
      // Aquí puedes redirigir a la lección correspondiente
          router.navigate('/lecciones');
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
          <View
            key={index}
            style={[
              styles.card,
              (selectedCard === index || (index === 0 && completedLessons[0])) && styles.highlightedCard,
            ]}
          >
            <TouchableOpacity onPress={() => handleCardPress(index)}>
              <Text style={styles.cardTitle}>{title}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSubtitle}>5 lecturas</Text>
                <Icon name="arrow-right" size={20} color="#05517e" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
    justifyContent: 'center', // Cambiado a 'center'
    alignItems: 'center',
  },
  languageText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    marginLeft: 10, // Agregado para dar espacio entre el texto y el icono
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center', // Centrado el subtítulo
  },
  cardContainer: {
    marginTop: -40,
    paddingHorizontal: 20,
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
    borderColor: '#05517e',
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

export default Opciones;
