import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";

const App = () => {
  const lecturas = [
    {
      name: "Nivel Básico",
      lecturas: "Lecturas 5",
      route: "/completarOracion",
    },
    {
      name: "Nivel Intermedio",
      lecturas: "Lecturas 5",
      route: "/completarFrase",
    },
    {
      name: "Nivel Avanzado",
      lecturas: "Lecturas 5",
      route: "/completarQuiz",
    },
  ];

  // Función para regresar y detener todos los audios
  const goBack = () => {
    router.back();
  };

  const redirectTo = (route: any) => {
    router.navigate(route);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con imagen de fondo */}
      <ImageBackground
        source={require("../../assets/Libros1.png")} // Ruta de la imagen
        style={styles.header}
        resizeMode="cover"
      ></ImageBackground>

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
              colors={["#2A6F97", "#539ec9"]} // Aplicar gradiente aquí
              style={styles.lecturaCard}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.lecturaName}>{lectura.name}</Text>
                  <Text style={styles.lecturaAddress}>{lectura.lecturas}</Text>
                </View>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botón de regresar */}
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#2A6F97" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  header: {
    width: "90%",
    height: "70%", // Ajusta la altura si es necesario
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginTop: -15,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -220, // Ajusta el margen para separar el título de la imagen
    color: "#1c506e",
  },
  lecturaList: {
    padding: 20,
    marginTop: 10, // Separación entre el título y las tarjetas
  },
  lecturaCard: {
    padding: 15, // Ajusta el padding si es necesario
    borderRadius: 10,
    marginBottom: 20, // Mayor espacio entre tarjetas
    height: 90, // Ajusta la altura de las tarjetas
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%", // Asegura que el contenido de la tarjeta ocupe el 100% de la altura
  },
  lecturaName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#e6eefc",
  },
  lecturaAddress: {
    fontSize: 20,
    color: "#e6eefc",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 6,
    padding: 10,
  },
});

export default App;
