import React from 'react'; 
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';  
import { router } from 'expo-router';

// Interfaz para el tipo Book
interface Book {
  id: string;
  title: string;
  nivel: string;
  image: any; // Cambiado a "any" para permitir imágenes locales con require()
}

// Libros con imágenes locales
const books: Book[] = [
  {
    id: '1',
    title: 'Descubriendo Mi Pasión',
    nivel: 'Básico',
    image: require('../../assets/Pasion.jpeg'),
  },
  {
    id: '2',
    title: 'La Importancia Del Autocuidado',
    nivel: 'Básico',
    image: require('../../assets/Cuidado.jpeg'),
  },
  {
    id: '3',
    title: 'El Valor de la Gratitud',
    nivel: 'Básico',
    image: require('../../assets/Gratitud.jpeg'),
  },
];

const goBack = () => {
  router.back();
};

const BooksMenu = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={24} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.header}>
        <Text style={styles.headerText}>Lecturas</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Lecturas Básicas Para Ti</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Básico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>Intermedio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>Avanzado</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={books}
          keyExtractor={(item: Book) => item.id} 
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({ pathname: '/detalleLectura', params: { book: JSON.stringify(item) } })}>
              <View style={styles.bookItem}>
                <Image source={item.image} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text style={styles.bookAuthor}>{item.nivel}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3EF',
  },
  goBackButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  header: {
    height: 280,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tituloCard: {
    paddingHorizontal: 16,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#2A6F97',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 16,
  },
  disabledButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  bookInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#888',
    marginVertical: 4,
  },
  bookRating: {
    fontSize: 12,
    color: '#555',
  },
});

export default BooksMenu;
