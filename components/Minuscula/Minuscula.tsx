import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el componente de iconos

const { width } = Dimensions.get('window');

// Define las letras, imágenes y nombres de objetos
const alphabetData = [
  { letter: 'a', image: require('../../assets/abeja.png'), name: 'abeja' },
  { letter: 'b', image: require('../../assets/botas.png'), name: 'bota' },
  { letter: 'c', image: require('../../assets/casa.png'), name: 'casa' },
  { letter: 'd', image: require('../../assets/dado.png'), name: 'dado' },
  { letter: 'e', image: require('../../assets/elefante.png'), name: 'elefante' },
  { letter: 'f', image: require('../../assets/fresa.png'), name: 'fresa' },
  { letter: 'g', image: require('../../assets/gato.png'), name: 'gato' },
  { letter: 'h', image: require('../../assets/hongo.png'), name: 'hongo' },
  { letter: 'i', image: require('../../assets/iglesia.png'), name: 'iglesia' },
  { letter: 'j', image: require('../../assets/jirafas.png'), name: 'jirafa' },
  { letter: 'k', image: require('../../assets/koalas.png'), name: 'koala' },
  { letter: 'l', image: require('../../assets/limon.png'), name: 'limón' },
  { letter: 'm', image: require('../../assets/mariposa.png'), name: 'mariposa' },
  { letter: 'n', image: require('../../assets/niña.png'), name: 'niña' },
  { letter: 'ñ', image: require('../../assets/ñoño.png'), name: 'ñoño' },
  { letter: 'o', image: require('../../assets/oso.png'), name: 'oso' },
  { letter: 'p', image: require('../../assets/pastel.png'), name: 'pastel' },
  { letter: 'q', image: require('../../assets/queso.png'), name: 'queso' },
  { letter: 'r', image: require('../../assets/rosa.png'), name: 'rosa' },
  { letter: 's', image: require('../../assets/sandia.png'), name: 'sandía' },
  { letter: 't', image: require('../../assets/tomate.png'), name: 'tomate' },
  { letter: 'u', image: require('../../assets/uva.png'), name: 'uva' },
  { letter: 'v', image: require('../../assets/vaca.png'), name: 'vaca' },
  { letter: 'w', image: require('../../assets/whatsapp.png'), name: 'whatsapp' },
  { letter: 'x', image: require('../../assets/xilofono.png'), name: 'xilófono' },
  { letter: 'y', image: require('../../assets/yoyo.png'), name: 'yoyo' },
  { letter: 'z', image: require('../../assets/zorro.png'), name: 'zorro' },
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
            <Icon name="arrow-left" size={30} color="#053f61" />
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
            <Icon name="arrow-right" size={30} color="#053f61" />
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
    marginBottom: 20,
  },
  letterContainer: {
    marginTop: 20,
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
    marginTop: 20,
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
