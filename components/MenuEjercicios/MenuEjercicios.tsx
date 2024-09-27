import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { existToken, getToken, removeToken } from "@/utils/TokenUtils";
import { getUsuario } from "@/utils/UsuarioUtils";

const baseUrl: any = process.env.EXPO_PUBLIC_URL;

const { width, height } = Dimensions.get("window");

const App = () => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usuario = await getUsuario();
      const lessonsUrl = `${baseUrl}/ejercicios/menu-ejercicios/${usuario}`;
      const imagesUrl = `${baseUrl}/ejercicios/all`; // URL de la segunda API para obtener las imágenes
      let token = null;
  
      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate('/home');
        return;
      }
  
      try {
        // Llamada a la API de lecciones
        const lessonsResponse = await fetch(lessonsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!lessonsResponse.ok) {
          if (lessonsResponse.status === 403) {
            removeToken();
            router.navigate('/login');
          }
          throw new Error('Error fetching lessons');
        }
  
        const lessonsData = await lessonsResponse.json();
        setEjercicios(lessonsData); // Asignar directamente las lecciones obtenidas
  
        // Llamada a la API de imágenes
        const imagesResponse = await fetch(imagesUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!imagesResponse.ok) {
          if (imagesResponse.status === 403) {
            removeToken();
            router.navigate('/login');
          }
          throw new Error('Error fetching images');
        }
  
        const imagesData = await imagesResponse.json();
        
        // Extraer las imágenes sin aplicar filtro de tipo de lección
        const lessonImages = imagesData.map((image: any) => image.contenido?.imagenes?.[0]?.url);
  
        setImages(lessonImages); // Guardar las imágenes obtenidas
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Llamamos a la función para obtener los datos
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
        <Icon name="arrow-back" size={48} color="#FAF3EF" />
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
                {images[index] ? (
                  <Image
                    source={{ uri: images[index] }} // Aquí solo necesitas el URL
                    style={styles.cardImage}
                  />
                ) : (
                  <Image
                    source={{ uri: "https://example.com/default-image.jpg" }} // Imagen por defecto
                    style={styles.cardImage}
                  />
                )}
                <View style={styles.textContainer}>
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
    backgroundColor: "#f0f4f7",
  },
  header: {
    height: height * 0.35, // Ajustado al 35% de la altura de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    alignItems: "center",
    justifyContent: "center",
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
  goBackButton: {
    position: "absolute",
    top: height * 0.06, // Ajustado al 6% de la altura de la pantalla
    left: width * 0.03, // Ajustado al 3% del ancho de la pantalla
    padding: width * 0.02, // Ajustado al 2% del ancho de la pantalla
    zIndex: 10,
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
    flexDirection: "row",
    alignItems: "center",
  },
  completadoCard: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardImage: {
    width: width * 0.230, // 20% del ancho de la pantalla
    height: height * 0.18, // Ajustado al 18% de la altura de la pantalla
    marginRight: width * 0.04, // 4% del ancho de la pantalla
    borderRadius: width * 0.02, // 2% del ancho de la pantalla
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
