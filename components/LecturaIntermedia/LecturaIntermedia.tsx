import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';

const sections = [
  {
    title: "¿Qué es el estrés?",
    content: "El estrés es una respuesta natural del cuerpo ante situaciones que percibimos como amenazantes o desafiantes. Es una reacción que nos prepara para enfrentar un peligro, aumentando nuestra alerta y energía. Sin embargo, cuando el estrés se vuelve crónico, puede afectar nuestra salud física y mental.",
  },
  {
    title: "Causas del Estrés",
    content: "El estrés puede ser causado por una variedad de factores, desde problemas laborales y relaciones personales hasta preocupaciones financieras o cambios importantes en la vida. Incluso situaciones cotidianas, como el tráfico o las tareas diarias, pueden contribuir al estrés.",
  },
  {
    title: "Efectos del Estrés en el Cuerpo",
    content: "El estrés prolongado puede tener efectos negativos en el cuerpo, como dolores de cabeza, problemas digestivos, insomnio y un sistema inmunológico debilitado. También puede contribuir al desarrollo de enfermedades como la hipertensión y enfermedades cardíacas.",
  },
  {
    title: "Cómo Manejar el Estrés",
    content: "Existen diversas técnicas para manejar el estrés, como la meditación, el ejercicio regular, una alimentación saludable y el establecimiento de límites claros en el trabajo y la vida personal. Aprender a identificar y gestionar las fuentes de estrés es clave para mantener un equilibrio saludable.",
  }
];

export default function IntermediateReadingComponent() {
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    readAloud(sections[sectionIndex].content);
  }, [sectionIndex]);

  const goToPreviousSection = () => {
    setSectionIndex((prevIndex) => (prevIndex === 0 ? sections.length - 1 : prevIndex - 1));
  };

  const goToNextSection = () => {
    setSectionIndex((prevIndex) => (prevIndex === sections.length - 1 ? 0 : prevIndex + 1));
  };

  const readAloud = (text) => {
    Speech.speak(text, {
      language: 'es',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{sections[sectionIndex].title}</Text>
        <Text style={styles.content}>{sections[sectionIndex].content}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.speechButton} onPress={() => readAloud(sections[sectionIndex].content)}>
        <FontAwesome name="volume-up" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToPreviousSection}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNextSection}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 30,
  },
  content: {
    fontSize: 22,
    color: '#333',
    lineHeight: 28,
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2A6F97',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  speechButton: {
    position: 'absolute',
    top: 60, // Modificado para que esté un poco más abajo
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});
