import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const HomeScreen: React.FC = () => {

  const redirectReconocerLetra = () => {
    router.navigate('/opcionesSegundaLeccion');
  };

  const redirectLecturas = () => {
    router.navigate('/opcionesSegundaLeccion');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Image 
            source={require('../../assets/Letras.png')} 
            style={styles.welcomeImage} 
          />
          <View>
            <Text style={styles.welcomeTitle}>Bienvenido!</Text>
          </View>
        </View>

        {/* Ongoing Projects */}
        <View style={styles.projectsHeader}>
          <Text style={styles.projectsTitle}>Lecciones</Text>
        </View>

        {/* Project Cards Container */}
        <View style={styles.projectsContainer}>
          {/* Card 1 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectReconocerLetra}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <Text style={styles.projectTitle}>Reconocer Letras</Text>
              <Text style={styles.projectCategory}>2 Lecciones</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectLecturas}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <Text style={styles.projectTitle}>Lecturas</Text>
              <Text style={styles.projectCategory}>3 Niveles</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 3 */}
          <View style={styles.cardContainer}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <Text style={styles.projectTitle}>Ejercicios</Text>
              <Text style={styles.projectCategory}>3 Ejercicios</Text>
            </LinearGradient>
          </View>

          {/* Card 4 */}
          <View style={styles.cardContainer}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <Text style={styles.projectTitle}>Juegos</Text>
              <Text style={styles.projectCategory}>3 Juegos</Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={30} color="#2A6F97" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="settings" size={30} color="#2A6F97" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginTop: 100,
  },
  screenTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  welcomeSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 2,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#2A6F97',
    borderWidth: 2,
  },
  welcomeImage: {
    width: 250,
    height: 250,
    marginRight: 5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginEnd: 50
  },
  projectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 20,
  },
  projectCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  projectCategory: {
    fontSize: 18,
    marginBottom: 8,
    color: '#fff',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    marginTop: 25,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
    color: '#fff',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default HomeScreen;
