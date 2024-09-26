import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { existToken, getToken, removeToken } from "@/utils/TokenUtils";
import { getUsuario } from "@/utils/UsuarioUtils";

const baseUrl: any = process.env.EXPO_PUBLIC_URL;

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
        <Icon name="arrow-back" size={40} color="#FAF3EF" />
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
                  <Text style={styles.lecturaName}>{ejercicio.nombre}</Text>
                  <Text style={styles.lecturaAddress}>{ejercicio.titulo}</Text>
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
    color: '#333',
  },
  lecturaAddress: {
    fontSize: 18,
    color: "#999",
  },
});

export default App;
