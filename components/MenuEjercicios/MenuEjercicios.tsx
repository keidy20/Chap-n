import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const App = () => {
  const lecturas = [
    { name: 'Completa la oración', lecturaes: 'Ejercicios 10', route: '/completarOracion' },
    { name: 'Completa la palabra', lecturaes: 'Ejercicios 10', route: '/completarFrase' },
    { name: 'Quiz', lecturaes: '', route: '/completarQuiz' },
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
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={require('../../assets/Ejercicios.png')} // Ruta de la imagen
          style={styles.header}
          resizeMode="cover"
        >
          <View style={styles.headerTop}>
            <Text style={styles.languageText}>Ejercicios</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Content */}
      <ScrollView style={styles.lecturaList}>
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
                <Text>
                  <Icon name="chevron-forward" size={30} color="#fff" />
                </Text>
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
    top: 20,
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
  lecturaList: {
    marginTop: -200, // Ajustar para levantar las tarjetas más cerca del header
    padding: 20,
  },
  lecturaCard: {
    padding: 22,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lecturaName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#e6eefc',
  },
  lecturaAddress: {
    fontSize: 18,
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
