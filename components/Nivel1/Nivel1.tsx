import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Datos de las lecciones
const lessonsData = [
  { id: '1', image: require('../../assets/Mayuscula.png'), label: 'Mayúsculas' },
  { id: '2', image: require('../../assets/Minuscula.png'), label: 'Minúsculas' },
  { id: '3', image: require('../../assets/Combinadas.png'), label: 'Combinadas' }, // Añadir lección combinadas
];

const Level1Screen: React.FC = () => {
  const router = useRouter(); // Inicializar useRouter
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Animación de desvanecimiento

  const handleSelectLesson = (lessonId: string) => {
    const selectedLesson = lessonsData.find((lesson) => lesson.id === lessonId);
    if (selectedLesson) {
      // Navegar a la pantalla del componente correspondiente
      router.push(`/lesson/${selectedLesson.label === 'Mayúsculas' ? 'capital' : selectedLesson.label === 'Minúsculas' ? 'small' : 'combined'}`);
    }
  };

  const animateButtons = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    animateButtons(); // Inicia la animación cuando se monta el componente
  }, []);

  const renderLessonItem = ({ id, image, label }: { id: string; image: any; label: string }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => handleSelectLesson(id)}
    >
      <Animated.Image source={image} style={[styles.lessonImage, { opacity: fadeAnim }]} />
      <Text style={styles.lessonLabel}>{label}</Text>
      <Icon name="arrow-right" size={30} color="#fff" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nivel 1</Text>
        <Text style={styles.subHeader}>Elige una lección</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {lessonsData.map(renderLessonItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 30,
    backgroundColor: '#e3f2fd', // Mismo color de fondo para que no se note el cambio de scroll
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#053f61',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    color: '#053f61',
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lessonCard: {
    width: width - 40,
    height: width * 0.6,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#2A6F97',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lessonImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  lessonLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default Level1Screen;
