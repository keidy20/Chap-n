import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const HomeScreen: React.FC = () => {

  const redirectReconocerLetra = () => {
    router.navigate('/dislexia');
  };

  const redirectLecturas = () => {
    router.navigate('/nivelesDeFluidez');
  };

  const redirectEjercicios = () => {
    router.navigate('/menuEjercicios');
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
            <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
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
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Reconocer Letras</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectLecturas}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Acelerador de Lectura</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectEjercicios}>
            <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Ejercicios</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
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
    marginBottom: 30,
    marginTop: 20,
  },
  projectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  projectCard: {
    flex: 1,
    borderRadius: 12,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row', // Alinea el contenido en una fila
    justifyContent: 'space-between', // Coloca el texto a la izquierda y la flecha a la derecha
    alignItems: 'center', // Centra el contenido verticalmente
    width: '100%', // Para que el contenido ocupe todo el ancho
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
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
