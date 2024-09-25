import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { existToken, getToken } from "@/utils/TokenUtils";
import { getUsuario } from "@/utils/UsuarioUtils";

const baseUrl: any = process.env.EXPO_PUBLIC_URL;

const App = () => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenuEjercicios = async () => {
      let token = null;
      let usuario = await getUsuario();
      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate("/home");
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
        setEjercicios(data);
        console.log("CONTENIDO", data)
      } catch (error) {
        console.log("Error", "No se pudo obtener el menu de lecciones");
      }
    };

    fetchMenuEjercicios();
  }, []);

  const goBack = () => {
    router.back();
  };

  const redirectTo = (route: any) => {
    router.navigate(route);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={24} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
        <Text style={styles.headerText}>Ejercicios</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Ejercicios Para Ti</Text>
        <ScrollView contentContainerStyle={styles.lecturaList}>
          {ejercicios.map((ejercicio, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => redirectTo(ejercicio.route)}
              style={[styles.lecturaCard, ejercicio.completado && styles.completadoCard]}
            >
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: "https://firebasestorage.googleapis.com/v0/b/indigo-cider-432618-r6.appspot.com/o/lecciones%2FLI_32%2Fimagenes%2FMiedo.jpeg?alt=media"}} // Suponiendo que cada ejercicio tenga una URL de imagen asociada
                  style={styles.cardImage}
                />
                <View>
                  <Text style={styles.lecturaName}>{ejercicio.nombre}</Text>
                  <Text style={styles.lecturaAddress}>{ejercicio.titulo}</Text>
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
    backgroundColor: "#FAF3EF",
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
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  completadoCard: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    marginLeft: -28,
    borderRadius: 8,
  },
  lecturaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#1c506e",
  },
  lecturaAddress: {
    fontSize: 20,
    color: "#999",
  },
});

export default App;
