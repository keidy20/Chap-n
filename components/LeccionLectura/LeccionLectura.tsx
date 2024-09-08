import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const lessons = [
  {
    oracion: 'El hombre come ___ revueltos en el desayuno.',
    oracionCompleta: 'El hombre come huevos revueltos en el desayuno.',
    opciones: ["Manzanas", "Huevos", "Batatas", "Tomates", "Zapallos"],
    opcionCorrecta: "Huevos"
  },
  {
    oracion: 'La mujer bebe jugo de ___ en la mañana.',
    oracionCompleta: 'La mujer bebe jugo de naranja en la mañana.',
    opciones: ["Naranja", "Leche", "Agua", "Café", "Té"],
    opcionCorrecta: "Naranja"
  },
  {
    oracion: 'El niño juega con sus amigos en el ___',
    oracionCompleta: 'El niño juega con sus amigos en el parque.',
    opciones: ["Perro", "Gato", "Niño", "Amigos", "Parque"],
    opcionCorrecta: "Parque"
  },
  {
    oracion: 'La familia cena ___ los domingos por la noche.',
    oracionCompleta: 'La familia cena pasta los domingos por la noche.',
    opciones: ["Desayuno", "Almuerzo", "Cena", "Merienda", "Pasta"],
    opcionCorrecta: "Pasta"
  },
  {
    oracion: 'En el verano, la gente va a la ___ para nadar.',
    oracionCompleta: 'En el verano, la gente va a la piscina para nadar.',
    opciones: ["Playa", "Montaña", "Piscina", "Ciudad", "Campo"],
    opcionCorrecta: "Piscina"
  }
];

const LeccionLectura = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLesson = lessons[currentLessonIndex];
  const words = currentLesson.oracion.split(' ');

  const handleStartReading = () => {
    setIsSpeaking(true);
    Speech.speak(currentLesson.oracionCompleta, {
      language: 'es',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const goBack = () => {
    router.back();
  };

  const handleopcioneselect = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(option === currentLesson.opcionCorrecta);

    if (option === currentLesson.opcionCorrecta) {
      Speech.speak('¡Correcto! Continúa con la siguiente lección.', { language: 'es' });
    } else {
      Speech.speak('Incorrecto. Vuelve a intentarlo y presta atención a la lectura.', { language: 'es' });
      handleStartReading();
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    handleStartReading();
    return () => {
      Speech.stop(); // Detener cualquier audio al desmontar el componente
    };
  }, [currentLessonIndex]);

  return (
    <LinearGradient
      colors={['#e0eafc', '#f5f5f5']}
      style={styles.container}
    >
      <LinearGradient
        colors={['#f5f5f5', '#e0eafc']}
        style={styles.topGradient}
      />
      <View style={styles.header}>
        <Text style={styles.lessonNumber}>Lección {currentLessonIndex + 1}</Text>
        <Image
          style={styles.flagIcon}
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg' }}
        />
      </View>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <View style={styles.goBackCircle}>
          <Ionicons name="arrow-back" size={24} color="#2A6F97" />
        </View>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Elije la palabra correcta que hace falta para completar la oración</Text>
      <View style={styles.lessonContainer}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentence}>
            {words.map((word, index) => (
              <Text key={index} style={styles.word}>
                {word === '___' ? (
                  selectedOption === currentLesson.opcionCorrecta ? (
                    <Text style={styles.highlightedWord}>{currentLesson.opcionCorrecta.toLowerCase()} </Text>
                  ) : (
                    <Text style={styles.placeholderOval}>_____ </Text>
                  )
                ) : (
                  `${word} `
                )}
              </Text>
            ))}
          </Text>
          <TouchableOpacity onPress={handleStartReading} style={styles.speakerButton}>
            <FontAwesome name="volume-up" size={24} color={isSpeaking ? '#1e90ff' : 'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.opcionesContainer}>
          {currentLesson.opciones.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOptionButton,
              ]}
              onPress={() => handleopcioneselect(option)}
            >
              <Text style={styles.optionoracion}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.progressContainer}>
        {lessons.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              currentLessonIndex === index && styles.currentProgressDot,
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.pageIndicator}>{currentLessonIndex + 1} / {lessons.length}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
          <Text style={styles.nextButtonoracion}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 45,
    zIndex: 2,
  },
  lessonNumber: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  flagIcon: {
    width: 30,
    height: 20,
  },
  subtitle: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 100,
    zIndex: 2,
  },
  lessonContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    marginTop: -50,
    borderWidth: 1,
    borderColor: '#e0eafc',
    paddingVertical: 30,
    paddingHorizontal: 30,
    zIndex: 2,
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    height: 180,
    position: 'relative',
  },
  sentence: {
    fontSize: 30,
    textAlign: 'center',
    flex: 1,
  },
  word: {
    fontSize: 30,
    color: '#000',
  },
  highlightedWord: {
    fontSize: 30,
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  placeholderOval: {
    fontSize: 30,
    color: '#1e90ff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1e90ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: 80, // Adjust width as needed
    marginRight: 5, // Add some spacing if needed
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 3,
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#e0eafc',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    borderWidth: 2,
    borderColor: '#2A6F97',
  },
  selectedOptionButton: {
    backgroundColor: '#1e90ff',
  },
  optionoracion: {
    fontSize: 18,
    color: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0eafc',
    margin: 3,
  },
  currentProgressDot: {
    backgroundColor: '#2A6F97',
  },
  footer: {
    alignItems: 'center',
  },
  pageIndicator: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  nextButton: {
    top: 20,
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonoracion: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  goBackButton: {
    position: 'absolute',
    top: 55, // Asegúrate de que no esté cubierto por la barra de estado
    left: -22,
    width: 90,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A6F97',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1, // Asegura que el botón esté encima de otros elementos
  },
  goBackCircle: {
    width: 40,
    height: 40,
    left: 19,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeccionLectura;
