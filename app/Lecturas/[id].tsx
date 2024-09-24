import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const BookDetails = ({ route, navigation }: any) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.bookImage} />
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookAuthor}>By {book.author}</Text>
      <Text style={styles.bookDescription}>
        {/* Añadir descripción aquí */}
        Smart, darkly funny, and life-affirming, {book.title} is the highly anticipated debut novel.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Leer Ahora')}>
          <Text style={styles.buttonText}>Leer Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF3EF',
  },
  bookImage: {
    width: 150,
    height: 230,
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  bookRating: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  bookDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#5DB075',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  reviewButton: {
    backgroundColor: '#F29E4C',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default BookDetails;
