import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const App = () => {
  const lecturas = [
    {
      name: "Nivel Básico",
      lecturas: "Lecturas 3",
      route: "/menuLecturaBasico",
      image: require("../../assets/Basico.jpeg"), // Imagen para Nivel Básico
    },
    {
      name: "Nivel Intermedio",
      lecturas: "Lecturas 3",
      route: "/menuLecturaIntermedio",
      image: require("../../assets/Intermedio.jpeg"), // Imagen para Nivel Intermedio
    },
    {
      name: "Nivel Avanzado",
      lecturas: "Lecturas 3",
      route: "/menuLecturaAvanzado",
      image: require("../../assets/Avanzado.jpeg"), // Imagen para Nivel Avanzado
    },
  ];

  const goBack = () => {
    router.back();
  };

  const redirectTo = (route: any) => {
    router.navigate(route);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={40} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
        <Text style={styles.headerText}>Lecturas</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Lecturas Para Ti</Text>
        <ScrollView contentContainerStyle={styles.lecturaList}>
          {lecturas.map((lectura, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => redirectTo(lectura.route)} // Asocia la redirección a la opción
            >
              <View style={styles.lecturaCard}>
                <View style={styles.cardContent}>
                  <Image
                    source={lectura.image} // Muestra la imagen de cada nivel
                    style={styles.lecturaImage}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.lecturaName}>{lectura.name}</Text>
                    <Text style={styles.lecturaAddress}>{lectura.lecturas}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  header: {
    height: 280,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
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
  },
  lecturaList: {
    padding: 20,
    marginTop: 10,
  },
  lecturaCard: {
    padding: 22,
    borderRadius: 10,
    marginBottom: 20,
    height: 130,
    backgroundColor: "#FFF", // Fondo blanco sin degradado
    flexDirection: "row-reverse", // Texto a la derecha de la imagen
    alignItems: "center",
    marginLeft: -25
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  lecturaImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  lecturaName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c506e",
    textAlign: "left", // Alineación del texto a la izquierda dentro del contenedor
  },
  lecturaAddress: {
    fontSize: 18,
    color: "#777",
    textAlign: "left", // Alineación del texto a la izquierda
  },
});

export default App;
