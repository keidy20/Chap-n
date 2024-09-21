import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const App = () => {
  const lecturas = [
    { name: 'Completa la oración', lecturaes: 'Ejercicios 10', route: '/completarOracion' },
    { name: 'Completa la palabra', lecturaes: 'Ejercicios 10', route: '/completarFrase' },
    { name: 'Cuestionario', lecturaes: '', route: '/completarQuiz' },
  ];

  // Función para regresar y detener todos los audios
  const goBack = () => {
    router.back();
  };

  const redirectTo = (route: string) => {
    router.navigate(route);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con imagen de fondo */}
      <ImageBackground
        source={require('../../assets/Ejercicios.png')} // Ruta de la imagen
        style={styles.header}
        resizeMode="cover"
      >
      </ImageBackground>

      {/* Título debajo de la imagen */}
      <Text style={styles.title}>Ejercicios</Text>

      {/* Tarjetas */}
      <ScrollView contentContainerStyle={styles.lecturaList}>
        {lecturas.map((lectura, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => redirectTo(lectura.route)} // Asocia la redirección a la opción
          >
            <LinearGradient
              colors={['#2A6F97', '#539ec9']} // Aplicar gradiente aquí
              style={styles.lecturaCard}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.lecturaName}>{lectura.name}</Text>
                  <Text style={styles.lecturaAddress}>{lectura.lecturaes}</Text>
                </View>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botón de regresar */}
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#2A6F97" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    width: '90%',
    height: 300, // Ajusta la altura si es necesario
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginTop: 120,
  },
  headerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20, // Ajusta el margen para separar el título de la imagen
    color: '#1c506e',
  },
  lecturaList: {
    padding: 20,
    marginTop: 10, // Separación entre el título y las tarjetas
  },
  lecturaCard: {
    padding: 22,
    borderRadius: 10,
    marginBottom: 20,
    height: 90,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  lecturaName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#e6eefc',
  },
  lecturaAddress: {
    fontSize: 20,
    color: '#e6eefc',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 6,
    padding: 10,
  },
});

export default App;
