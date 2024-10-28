import React, { useState,  useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { getUsuario } from "@/utils/UsuarioUtils";

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {

  // Estado para habilitar/deshabilitar el botón de Evaluación Final
  const [isFinalEvaluationEnabled, setIsFinalEvaluationEnabled] = useState(false);
  const [isEvaluacionIntermediaHabilitada, setIsEvaluacionIntermediaHabilitada] = useState(false);
  
  useEffect(() => {
    checkCompletionStatus()
    checkCompletIntermedioionStatus()
  }, []);
  
  const redirectEvaluacionIntermedia = () => {
    router.push("/evaluacionIntermedia");
  };
  
  const redirectReconocerLetra = () => {
    router.push("/reconocerLetras");
  };

  const redirectLecturas = () => {
    router.push("/menuLecturas");
  };

  const redirectEjercicios = () => {
    router.push("/menuEjercicios");
  };

  const cerrarSesion = () => {
    router.push('/cerrarSesion');
  };

  async function checkCompletionStatus() {
    try {
      const usuario = await getUsuario();
      const leccionesResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/usuarios_lecciones/leccion-final-habilitada/${usuario}`);

      const leccionesData = await leccionesResponse.json();

      console.log('EL CHACHO NO ME CREE:', leccionesData);

      if (leccionesData === true) {
        // Si todo está completado, habilitar la evaluación final
        setIsFinalEvaluationEnabled(true);
      }else {
        setIsFinalEvaluationEnabled(false); // En caso de que no esté habilitada
      }
    } catch (error) {
      console.error('Error al obtener el estado de la evaluación final::', error);
    }
  }

// Llama a las dos APIs y verifica si se han completado todos los ejercicios y lecciones
async function checkCompletIntermedioionStatus() {
  try {
    const usuario = await getUsuario();
    const leccionesResponseRL = await fetch(`${process.env.EXPO_PUBLIC_URL}/lecciones/all/${usuario}`);

    const leccionesData = await leccionesResponseRL.json();

    console.log('Datos de lecciones recibidos:', leccionesData);

    // Filtrar las lecciones que son del tipo RL
    const leccionesRLCompletadas = leccionesData.filter((leccion: any) => leccion.tipoLeccion === 'RL' && leccion.completado === false);

    console.log('Lecciones RL completadas:', leccionesRLCompletadas);

    if (leccionesRLCompletadas.length > 0) {
      // Si todas las lecciones RL están completadas, habilitar la evaluación intermedia
      setIsEvaluacionIntermediaHabilitada(false);
    } else {
      setIsEvaluacionIntermediaHabilitada(true); // En caso de que no esté habilitada
    }
  } catch (error) {
    console.error('Error al obtener el estado de la evaluación intermedia:', error);
  }
}


  return (
    <View style={styles.container}>
      {/* Sección de bienvenida */}
      <View style={styles.welcomeSection}>
        <Image
          source={require("../../assets/Letras.png")}
          style={styles.welcomeImage}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        </View>
      </View>

      {/* Header de Proyectos */}
      <View style={styles.projectsHeader}>
        <Text style={styles.projectsTitle}>Lecciones</Text>
      </View>
      <View style={styles.cardsWrapper}>
        {/* Contenedor de las tarjetas con scroll */}
        <ScrollView contentContainerStyle={styles.projectsContainer}>
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
            <TouchableOpacity
              style={[styles.cardContainer, !isEvaluacionIntermediaHabilitada && { opacity: 0.5 }]}
              onPress={isEvaluacionIntermediaHabilitada ? redirectEvaluacionIntermedia : undefined}
              disabled={!isEvaluacionIntermediaHabilitada}
            >
              <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
                <View style={styles.cardContent}>
                  <Text style={styles.projectTitle}>Evaluación Intermedia</Text>
                  {/* Cambia el icono dependiendo del estado */}
                  <Icon
                    name={isEvaluacionIntermediaHabilitada ? "chevron-forward" : "lock-closed"}
                    size={30}
                    color="#fff"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tarjeta 3 */}
            <TouchableOpacity style={styles.cardContainer} onPress={redirectLecturas}>
              <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
                <View style={styles.cardContent}>
                  <Text style={styles.projectTitle}>Acelerador de Lectura</Text>
                  <Icon name="chevron-forward" size={30} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tarjeta 4 */}
            <TouchableOpacity style={styles.cardContainer} onPress={redirectEjercicios}>
              <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.projectCard}>
                <View style={styles.cardContent}>
                  <Text style={styles.projectTitle}>Ejercicios</Text>
                  <Icon name="chevron-forward" size={30} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tarjeta 5 (Evaluación Final) */}
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
      </View>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={30} color="#2A6F97" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={cerrarSesion}>
          <Icon name="settings" size={30} color="#2A6F97" />
        </TouchableOpacity>
      </View>
    </View>
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
    cardsContainer: {
    padding: 16,
    paddingBottom: 50, // Espacio adicional al final para el scroll
  },
  cardsWrapper: {
    flex: 1, // Ocupa todo el espacio restante
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
