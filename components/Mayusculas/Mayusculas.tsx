import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el componente de iconos

const { width } = Dimensions.get('window');

// Define las letras, imágenes y nombres de objetos
const alphabetData = [
  { letter: 'A', image: require('../../assets/abeja.png'), name: 'Abeja' },
  { letter: 'B', image: require('../../assets/botas.png'), name: 'Bota' },
  { letter: 'C', image: require('../../assets/casa.png'), name: 'Casa' },
  { letter: 'D', image: require('../../assets/dado.png'), name: 'Dado' },
  { letter: 'E', image: require('../../assets/elefante.png'), name: 'Elefante' },
  { letter: 'F', image: require('../../assets/fresa.png'), name: 'Fresa' },
  { letter: 'G', image: require('../../assets/gato.png'), name: 'Gato' },
  { letter: 'H', image: require('../../assets/hongo.png'), name: 'Hongo' },
  { letter: 'I', image: require('../../assets/iglesia.png'), name: 'Iglesia' },
  { letter: 'J', image: require('../../assets/jirafas.png'), name: 'Jirafa' },
  { letter: 'K', image: require('../../assets/koalas.png'), name: 'Koala' },
  { letter: 'L', image: require('../../assets/limon.png'), name: 'Limón' },
  { letter: 'M', image: require('../../assets/mariposa.png'), name: 'Mariposa' },
  { letter: 'N', image: require('../../assets/niña.png'), name: 'Niña' },
  { letter: 'Ñ', image: require('../../assets/ñoño.png'), name: 'Ñoño' },
  { letter: 'O', image: require('../../assets/oso.png'), name: 'Oso' },
  { letter: 'P', image: require('../../assets/pastel.png'), name: 'Pastel' },
  { letter: 'Q', image: require('../../assets/queso.png'), name: 'Queso' },
  { letter: 'R', image: require('../../assets/rosa.png'), name: 'Rosa' },
  { letter: 'S', image: require('../../assets/sandia.png'), name: 'Sandía' },
  { letter: 'T', image: require('../../assets/tomate.png'), name: 'Tomate' },
  { letter: 'U', image: require('../../assets/uva.png'), name: 'Uva' },
  { letter: 'V', image: require('../../assets/vaca.png'), name: 'Vaca' },
  { letter: 'W', image: require('../../assets/whatsapp.png'), name: 'WhatsApp' },
  { letter: 'X', image: require('../../assets/xilofono.png'), name: 'Xilófono' },
  { letter: 'Y', image: require('../../assets/yoyo.png'), name: 'Yoyo' },
  { letter: 'Z', image: require('../../assets/zorro.png'), name: 'Zorro' },
];

const CapitalLettersIntro: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1)); // Animación de escala
  const [buttonAnim] = useState(new Animated.Value(1)); // Animación del botón
  const [animationStarted, setAnimationStarted] = useState(false); // Controla cuándo iniciar la animación

  const { letter, image, name } = alphabetData[currentIndex];

  // Función para reproducir la pronunciación de la letra y nombre
  const speakLetter = () => {
    Speech.speak(`Esta es la letra ${letter} de ${name}`, {
      language: 'es',
      onDone: () => setAnimationStarted(true), // Activa la animación después de que termine el audio
    });
  };

  useEffect(() => {
    speakLetter(); // Reproduce la pronunciación al cargar el componente
  }, [currentIndex]);

  useEffect(() => {
    if (animationStarted) {
      startAnimations(); // Inicia las animaciones después de que se ha activado
    }
  }, [animationStarted]);

  const startAnimations = () => {
    // Animación de zoom para la letra
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animación de pulso para los botones después de la animación de la letra
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const nextLetter = () => {
    if (currentIndex < alphabetData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnimationStarted(false); // Desactiva la animación para la próxima letra
    }
  };

  const previousLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnimationStarted(false); // Desactiva la animación para la próxima letra
    }
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Animated.View
        style={[
          styles.letterContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={previousLetter} disabled={currentIndex === 0}>
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{ scale: buttonAnim }],
                opacity: currentIndex === 0 ? 0.5 : 1,
              },
            ]}
          >
            <Icon name="arrow-left" size={45} color="#2A6F97" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextLetter} disabled={currentIndex === alphabetData.length - 1}>
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{ scale: buttonAnim }],
                opacity: currentIndex === alphabetData.length - 1 ? 0.5 : 1,
              },
            ]}
          >
            <Icon name="arrow-right" size={45} color="#2A6F97" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 2,
  },
  letterContainer: {
    marginTop: 15,
  },
  letter: {
    fontSize: 250,
    fontWeight: 'bold',
    color: '#053f61',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 95,
  },
  button: {
    width: 50,
    height: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CapitalLettersIntro;
