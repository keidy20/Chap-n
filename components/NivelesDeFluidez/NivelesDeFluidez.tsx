import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const App = () => {
  const doctors = [
    { name: 'Básico', lecciones: 'Lecturas 5' },
    { name: 'Intermedio', lecciones: 'Lecturas 5' },
    { name: 'Avanzado', lecciones: 'Lecturas 5' },
  ];

  const handleGoBack = () => {
    router.back(); // Esto asume que estás utilizando React Navigation para gestionar la navegación
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={require('../../assets/Libros.png')} // Ruta de la imagen
          style={styles.header}
          resizeMode="cover"
        >
          <View style={styles.headerTop}>
            <Text style={styles.languageText}>Niveles de Lecturas</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Content */}
      <ScrollView style={styles.doctorList}>
        {doctors.map((doctor, index) => (
          <LinearGradient
            key={index}
            colors={['#2A6F97', '#539ec9']} // Aplicar gradiente aquí
            style={styles.doctorCard}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorAddress}>{doctor.lecciones}</Text>
              </View>
              <Text>
                <Icon name="arrow-right" size={30} color="#e6eefc" />
              </Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Botón de regresar */}
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <View style={styles.goBackCircle}>
          <Ionicons name="arrow-back" size={24} color="#2A6F97" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  headerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: -70
  },
  header: {
    width: '100%',  // Reducir el ancho del header para centrar la imagen
    height: '70%',  // Reducir la altura del header para hacer la imagen más pequeña
    alignItems: 'center',
  },
  headerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    marginTop: 270,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  doctorList: {
    marginTop: -210, // Ajustar para levantar las tarjetas más cerca del header
    padding: 20,
  },
  doctorCard: {
    padding: 22,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#e6eefc',
  },
  doctorAddress: {
    fontSize: 18,
    color: '#e6eefc',
  },
  goBackButton: {
    position: 'absolute',
    bottom: 20,
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

export default App;
