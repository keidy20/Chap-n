import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener instalado react-native-vector-icons

const LectureCard = () => {
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = [
    {
      id: 1,
      title: 'Pedro domedario',
      text: (
        <>
          <Text style={styles.highlight}>Pedro domedario</Text> no hace
          <Text style={styles.highlight}> drama</Text> cuando lo confunden
          <Text style={styles.highlight}> adrede</Text> con un camello. Guarda agua en su joroba y así no se deshidrata. Su
          <Text style={styles.highlight}> madre</Text> lo guía entre las
          <Text style={styles.highlight}> piedras</Text> del desierto en las
          <Text style={styles.highlight}> madrugadas</Text>.
        </>
      ),
      image: require('../../assets/zorro.png'), // Cambia la ruta según tu imagen
    },
    {
      id: 2,
      title: 'Pedro dromedario',
      text: (
        <>
          <Text style={styles.highlight}>Pedro domedario</Text> no hace
          <Text style={styles.highlight}> drama</Text> cuando lo confunden
          <Text style={styles.highlight}> adrede</Text> con un camello. Guarda agua en su joroba y así no se deshidrata. Su
          <Text style={styles.highlight}> madre</Text> lo guía entre las
          <Text style={styles.highlight}> piedras</Text> del desierto en las
          <Text style={styles.highlight}> madrugadas</Text>.
        </>
      ),
      image: require('../../assets/uva.png'),
    },
  ];

  const handleNextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const playAudio = () => {
    // Lógica para reproducir el audio
    console.log('Reproduciendo audio...');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Icono de bocina */}
        <TouchableOpacity style={styles.audioIcon} onPress={playAudio}>
          <Icon name="volume-up" size={30} color="#00AEEF" />
        </TouchableOpacity>

        {/* Imagen del dromedario */}
        <Image
          source={lessons[currentLesson].image}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.title}>{lessons[currentLesson].title}</Text>

        {/* Texto descriptivo */}
        <Text style={styles.text}>
          {lessons[currentLesson].text}
        </Text>
      </View>

      {/* Botón Siguiente */}
      {currentLesson < lessons.length - 1 && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F5FF',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 6,
    borderColor: '#2A6F97',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  audioIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2A6F97',
    marginBottom: 20,
  },
  text: {
    fontSize: 35,
    color: 'black',
    textAlign: 'center',
  },
  highlight: {
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LectureCard;
