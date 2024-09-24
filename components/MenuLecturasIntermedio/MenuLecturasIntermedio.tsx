import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { existToken, getToken } from "@/utils/TokenUtils";

interface Seccion {
  id: string;
  text: string;
  audioTexto: string;
}

interface AudioItem {
  id: string;
  url: string;
}

interface Book {
  id: string;
  contenido: {
    title: string;
    nivel: string;
    Secciones: Seccion[];
    audios: AudioItem[];
    imagenes: { url: string }[];
  };
}

const BooksMenu = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const baseUrl: string = process.env.EXPO_PUBLIC_URL || ""; // Asegúrate de que esto esté definido correctamente

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchBooks = async () => {
      let token = null;
      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate("/home");
      }
      try {
        const response = await fetch(`${baseUrl}/lecciones/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }

        const data = await response.json();

        // Asegúrate de que el filtrado se aplica a la estructura correcta
        const filteredBooks = data.filter((d: any) => d.tipoLeccion === "LI");
        console.log("Libros filtrados:", filteredBooks); // Verifica los libros filtrados

        setBooks(filteredBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

  }, []);



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={24} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
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
          data={books} // Usar el estado de libros
          keyExtractor={(item: Book) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/detalleLecturaIntermedio",
                  params: {
                    id: item.id,
                    titulo: JSON.stringify(item.contenido.title),
                    sections: JSON.stringify(item.contenido.Secciones),
                    imageUri: encodeURIComponent(
                      item.contenido.imagenes[0]?.url
                    ),
                    audios: encodeURIComponent(JSON.stringify(item.contenido.audios))
                  },
                });
                
              }}
            >
              <View style={styles.bookItem}>
                <Image
                  source={{ uri: item.contenido.imagenes[0]?.url }}
                  style={styles.bookImage}
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{item.contenido.title}</Text>
                  <Text style={styles.bookAuthor}>{item.contenido.nivel}</Text>
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
    backgroundColor: "#FAF3EF",
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  header: {
    height: 280,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  tituloCard: {
    paddingHorizontal: 16,
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#2A6F97",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 16,
  },
  disabledButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButtonText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },
  bookItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFF",
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  bookInfo: {
    justifyContent: "center",
    flex: 1,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#888",
    marginVertical: 4,
  },
});

export default BooksMenu;
