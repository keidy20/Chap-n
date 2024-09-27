import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { existToken, getToken } from "@/utils/TokenUtils";

const { width, height } = Dimensions.get("window");

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

  const Intermedio = () => {
    router.navigate('/menuLecturaIntermedio');
  };

  const Basico = () => {
    router.navigate('/menuLecturaBasico');
  };

  const Avanzado = () => {
    router.navigate('/menuLecturaAvanzado');
  };

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
        const filteredBooks = data.filter((d: any) => d.tipoLeccion === "LA");
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
        <Icon name="arrow-back" size={48} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
        <Text style={styles.headerText}>Lecturas</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Lecturas Básicas Para Ti</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.disabledButton}>
            <Text style={styles.disabledButtonText} numberOfLines={1} adjustsFontSizeToFit onPress={Basico}>Básico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.disabledButton}>
            <Text style={styles.disabledButtonText} numberOfLines={1} adjustsFontSizeToFit onPress={Intermedio}>Intermedio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit onPress={Avanzado}>Avanzado</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={books} // Usar el estado de libros
          keyExtractor={(item: Book) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/detalleLecturaAvanzado",
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
    top: height * 0.05, // Adaptado a la altura del dispositivo
    left: width * 0.03, // Adaptado al ancho del dispositivo
    padding: 10,
    zIndex: 10,
  },
  header: {
    height: height * 0.3, // Adaptado a la altura de la pantalla
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: width * 0.07, // Adaptado a la pantalla
    fontWeight: "bold",
    color: "#FFF",
  },
  tituloCard: {
    paddingHorizontal: width * 0.05, // Adaptado al ancho de la pantalla
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#000",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: height * -0.05, // Adaptado a la altura de la pantalla
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  button: {
    flex: 1,
    marginHorizontal: width * 0.02,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    backgroundColor: "#2A6F97",
    borderRadius: width * 0.06,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  disabledButton: {
    flex: 1,
    marginHorizontal: width * 0.02,
    padding: height * 0.015,
    backgroundColor: "#ccc",
    borderRadius: width * 0.06,
    alignItems: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: width * 0.045,
    textAlign: "center", // Asegura que el texto esté centrado
    flexShrink: 1, // El texto se ajusta dentro del contenedor sin desbordar
  },
  disabledButtonText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: width * 0.045,
    textAlign: "center",
    flexShrink: 1,
  },
  bookItem: {
    flexDirection: "row",
    marginBottom: height * 0.02,
    padding: height * 0.02,
    backgroundColor: "#FFF",
  },
  bookImage: {
    width: width * 0.2, // Adaptado al ancho de la pantalla
    height: height * 0.15, // Adaptado a la altura de la pantalla
    marginRight: width * 0.05,
    borderRadius: width * 0.02,
  },
  bookInfo: {
    justifyContent: "center",
    flex: 1,
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: width * 0.04,
    color: "#888",
    marginVertical: height * 0.005,
  },
});

export default BooksMenu;
