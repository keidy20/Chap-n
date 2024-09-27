import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  // Estado para habilitar/deshabilitar el botón de Evaluación Final
  const [isFinalEvaluationEnabled, setIsFinalEvaluationEnabled] = useState(false);

  const redirectReconocerLetra = () => {
    router.navigate("/reconocerLetras");
  };

  const redirectLecturas = () => {
    router.navigate("/menuLecturas");
  };

  const redirectEjercicios = () => {
    router.navigate("/menuEjercicios");
  };

  const cerrarSesion = () => {
    router.navigate('/cerrarSesion');
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Sección de bienvenida */}
        <View style={styles.welcomeSection}>
          <Image
            source={require("../../assets/Letras.png")}
            style={styles.welcomeImage}
            resizeMode="contain" // Ajusta la imagen para que se vea bien en diferentes tamaños
          />
          <View>
            <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          </View>
        </View>

        {/* Header de Proyectos */}
        <View style={styles.projectsHeader}>
          <Text style={styles.projectsTitle}>Lecciones</Text>
        </View>

        {/* Contenedor de tarjetas */}
        <View style={styles.projectsContainer}>
          {/* Tarjeta 1 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectReconocerLetra}>
            <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Reconocer Letras</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tarjeta 2 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectLecturas}>
            <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Acelerador de Lectura</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tarjeta 3 */}
          <TouchableOpacity style={styles.cardContainer} onPress={redirectEjercicios}>
            <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Ejercicios</Text>
                <Icon name="chevron-forward" size={30} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Tarjeta 4 (Evaluación Final) */}
          <TouchableOpacity
            style={[styles.cardContainer, !isFinalEvaluationEnabled && { opacity: 0.5 }]}
            onPress={isFinalEvaluationEnabled ? redirectEjercicios : undefined}
            disabled={!isFinalEvaluationEnabled}
          >
            <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
              <View style={styles.cardContent}>
                <Text style={styles.projectTitle}>Evaluación Final</Text>
                {/* Cambia el icono dependiendo del estado */}
                <Icon
                  name={isFinalEvaluationEnabled ? "chevron-forward" : "lock-closed"}
                  size={30}
                  color="#fff"
                />
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
        <TouchableOpacity style={styles.navButton} onPress={cerrarSesion}>
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
    backgroundColor: "#F5F5F5",
    paddingTop: height * 0.1, // Ajuste relativo al tamaño de la pantalla
  },
  screenTitleContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  welcomeSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    marginBottom: height * 0.02,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#2A6F97",
    borderWidth: 2,
  },
  welcomeImage: {
    width: width * 0.6, // Ajuste en base al ancho de la pantalla
    height: height * 0.25, // Ajuste en base a la altura de la pantalla
    marginRight: 5,
  },
  welcomeTitle: {
    fontSize: width * 0.06, // Ajuste relativo al ancho
    fontWeight: "bold",
    marginEnd: 50,
  },
  projectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
    marginTop: height * 0.02,
  },
  projectsTitle: {
    fontSize: width * 0.05, // Ajuste relativo al ancho
    fontWeight: "bold",
  },
  projectsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    marginBottom: height * 0.03,
  },
  projectCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: height * 0.03, // Ajuste en base a la altura de la pantalla
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  projectTitle: {
    fontSize: width * 0.06, // Ajuste relativo al ancho
    fontWeight: "bold",
    color: "#fff",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: height * 0.08, // Ajuste en base a la altura de la pantalla
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default HomeScreen;
