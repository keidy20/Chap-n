import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

const LecturaComponent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleStartReading = () => {
    setIsSpeaking(true);
    Speech.speak('Hay cuatro estaciones en el año: primavera, verano, otoño e invierno. En primavera, las flores crecen y el clima es suave. En verano, hace calor y podemos nadar en la playa. En otoño, las hojas de los árboles cambian de color y caen al suelo. En invierno, hace frío y a veces nieva. Cada estación es especial y tiene cosas bonitas para disfrutar.', {
      language: 'es',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    handleStartReading();
    return () => {
      Speech.stop(); // Detener cualquier audio al desmontar el componente
    };
  }, []);

  return (
    <LinearGradient colors={['#e0eafc', '#f5f5f5']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.lessonTitle}>Las estaciones del año</Text>
          <Image
            style={styles.flagIcon}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg' }}
          />
        </View>
        <ScrollView style={styles.card}>
          <Text style={styles.lessonText}>
            Hay cuatro estaciones en el año: primavera, verano, otoño e invierno. En primavera, las flores crecen y el clima es suave. En verano, hace calor y podemos nadar en la playa. En otoño, las hojas de los árboles cambian de color y caen al suelo. En invierno, hace frío y a veces nieva. Cada estación es especial y tiene cosas bonitas para disfrutar.
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={handleStartReading} style={styles.speakerButton}>
          <Text style={styles.speakerButtonText}>{isSpeaking ? '🔊' : '🔈'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginRight: 10,
  },
  flagIcon: {
    width: 30,
    height: 20,
  },
  card: {
    width: width * 0.9,
    maxHeight: height * 0.6,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    top: 100,
  },
  lessonText: {
    fontSize: 28,
    color: '#242424',
  },
  speakerButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#2A6F97',
  },
  speakerButtonText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default LecturaComponent;
