import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import * as Animatable from 'react-native-animatable';

const Opciones: React.FC = () => {
  const router = useRouter();
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    // Texto de bienvenida
    const welcomeText = "A continuación, haremos un recorrido para saber el nivel de aprendizaje con el que cuentas. Para ello, iniciaremos con las vocales. Presiona la opción que se te resalta para poder continuar.";

    // Reproducir el texto de bienvenida y comenzar la animación cuando termine
    Speech.speak(welcomeText, {
      language: 'es',
      onDone: () => setIsBouncing(true),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.languageText}>Recorrido</Text>
          <View style={styles.iconContainer}>
            <Icon name="volume-up" size={20} color="#fff" />
          </View>
        </View>
        <Text style={styles.subtitle}>2 Lecciones</Text>
      </View>
      <View style={styles.cardContainer}>
        <Animatable.View 
          animation={isBouncing ? "bounce" : undefined}
          iterationCount="infinite"
          direction="alternate"
          style={[styles.card, isBouncing && styles.highlightedCard]}
        >
          <TouchableOpacity onPress={() => router.push('/recorrido-vocales')}>
            <Text style={styles.cardTitle}>Recorrido de Vocales</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardSubtitle}>5 lecturas</Text>
              <Icon name="check-circle" size={20} color="#ff6347" />
            </View>
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => router.push('/recorrido-consonantes')}>
            <Text style={styles.cardTitle}>Recorrido de Consonantes</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardSubtitle}>5 lecturas</Text>
              <Icon name="play-circle" size={20} color="#ff6347" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    width: '100%',
    height: '30%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  progress: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  cardContainer: {
    marginTop: -40, // Para superponer las opciones encima del fondo azul
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

export default Opciones;

