import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { existToken, getToken } from "@/utils/TokenUtils";
import { getUsuario } from "@/utils/UsuarioUtils";

const baseUrl: any = process.env.EXPO_PUBLIC_URL;

const App = () => {

  const [ ejercicios, setEjercicios ] = useState<any[]>([])

  useEffect(() => {
    const fetchMenuEjercicios = async () => {
      let token = null;
      let usuario = await getUsuario()
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
        console.log('Usuario ', usuario)
      } else {
        router.navigate('/home')
      }
      try {
        const response = await fetch(`${baseUrl}/ejercicios/menu-ejercicios/${usuario}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data: any[] = await response.json();
        console.log('Menu ', data)
        setEjercicios(data)
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el menu de lecciones');
      }
    };

    fetchMenuEjercicios();
  }, [])

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
        source={require("../../assets/Ejercicios.png")} // Ruta de la imagen
        style={styles.header}
        resizeMode="cover"
      ></ImageBackground>

      {/* Título debajo de la imagen */}
      <Text style={styles.title}>Ejercicios</Text>

      {/* Tarjetas */}
      <ScrollView contentContainerStyle={styles.lecturaList}>
        {ejercicios.map((ejercicio, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => redirectTo(ejercicio.route)} // Asocia la redirección a la opción
          >
            <LinearGradient
              colors={ejercicio.completado ? ["#4CAF50", "#81C784"] : ["#2A6F97", "#539ec9"]}
              style={[
                styles.lecturaCard,
                ejercicio.completado && styles.completadoCard // Aplicar estilo extra si está completado
              ]}
            >
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.lecturaName}>{ejercicio.nombre}</Text>
                  <Text style={styles.lecturaAddress}>{ejercicio.titulo}</Text>
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
    height: 300, // Ajusta la altura si es necesario
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 40,
    marginTop: 120,
  },
  headerTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20, // Ajusta el margen para separar el título de la imagen
    color: "#1c506e",
  },
  lecturaList: {
    padding: 20,
    marginTop: 10, // Separación entre el título y las tarjetas
  },
  lecturaCard: {
    padding: 22,
    borderRadius: 10,
    marginBottom: 20,
    height: 90,
  },
  completadoCard: {
    opacity: 0.7, // Disminuye la opacidad si está completado
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
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
