import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

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
        <Icon name="arrow-back" size={48} color="#FAF3EF" />
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
    height: height * 0.35, // Ajustado al 35% de la altura de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    alignItems: "center",
    justifyContent: "center",
  },
  goBackButton: {
    position: "absolute",
    top: height * 0.06, // Ajustado al 6% de la altura de la pantalla
    left: width * 0.03, // Ajustado al 3% del ancho de la pantalla
    padding: width * 0.02, // Ajustado al 2% del ancho de la pantalla
    zIndex: 10,
  },
  headerText: {
    fontSize: width * 0.07, // Ajustado al 7% del ancho de la pantalla
    fontWeight: "bold",
    color: "#FFF",
  },
  tituloCard: {
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    fontSize: width * 0.06, // 6% del ancho de la pantalla
    fontWeight: "bold",
    color: "#000",
    marginTop: height * 0.02, // 2% de la altura de la pantalla
    marginBottom: height * 0.02, // 2% de la altura de la pantalla
    marginLeft: 20
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -height * 0.05, // Subir 5% de la altura de la pantalla
    borderTopLeftRadius: width * 0.1, // 10% del ancho de la pantalla
    borderTopRightRadius: width * 0.1, // 10% del ancho de la pantalla
    paddingVertical: height * 0.03, // 3% de la altura de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
  },
  lecturaList: {
    padding: width * 0.05, // 5% del ancho de la pantalla
    marginTop: height * 0.01, // 1% de la altura de la pantalla
  },
  lecturaCard: {
    padding: width * 0.05, // 5% del ancho de la pantalla
    borderRadius: width * 0.02, // 2% del ancho de la pantalla
    marginBottom: height * 0.03, // 3% de la altura de la pantalla
    height: height * 0.18, // 18% de la altura de la pantalla
    backgroundColor: "#FFF",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  lecturaImage: {
    width: width * 0.230, // 20% del ancho de la pantalla
    height: height * 0.18, // Ajustado al 18% de la altura de la pantalla
    marginRight: width * 0.04, // 4% del ancho de la pantalla
    borderRadius: width * 0.02, // 2% del ancho de la pantalla
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  lecturaName: {
    fontSize: width * 0.05, // 5% del ancho de la pantalla
    fontWeight: "bold",
    color: "#1c506e",
    textAlign: "left",
  },
  lecturaAddress: {
    fontSize: width * 0.045, // 4.5% del ancho de la pantalla
    color: "#777",
    textAlign: "left",
  },
});

export default App;
