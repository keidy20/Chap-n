import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { existToken, getToken, removeToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LessonMenuRL: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]); // Nuevo estado para almacenar las imágenes
  const router = useRouter();

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchData = async () => {
      const username = await getUsuario();
      const lessonsUrl = `${baseUrl}/lecciones/all/${username}`;
      const imagesUrl = `${baseUrl}/lecciones/all`; // URL de la segunda API para obtener las imágenes
      let token = null;

      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate('/home');
        return;
      }

      try {
        // Primero se llama a la API de lecciones
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
        const filteredLessons = lessonsData.filter((d: any) => d.tipoLeccion === 'RL');
        setLessons(filteredLessons);

        // Ahora que tenemos las lecciones, hacemos la segunda llamada a la API de imágenes
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

      // Cambia esta parte de tu código en el useEffect
      const imagesData = await imagesResponse.json();
      const filteredImages = imagesData.filter((d: any) => d.tipoLeccion === 'RL');

      // Cambia el formato de la variable para almacenar imágenes
      const lessonImages = filteredImages.map((image: any) => image.contenido.imagenes[0]?.url);

      // Luego, asigna esta nueva variable a tu estado de imágenes
      setImages(lessonImages); // Guardar las imágenes obtenidas


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const goToLessonDetail = (id: string) => {
    router.push(`/Dislexia/${encodeURIComponent(id)}`);
  };

  const goBack = () => {
    router.back();
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
        <Text style={styles.tituloCard}>Identificación De Letras</Text>
        <ScrollView style={styles.lessonList}>
        {lessons.length === 0 ? (
          <Text style={styles.emptyText}></Text>
        ) : (
          lessons.map((lesson, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.cardContainer, lesson.completado ? styles.completedCard : null]}
              onPress={() => goToLessonDetail(lesson.id)}
            >
              <View style={styles.lessonCard}>
                {/* Aquí puedes usar las imágenes obtenidas de la segunda API */}
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
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle}>{lesson.titulo}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

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
  goBackButton: {
    position: "absolute",
    top: height * 0.06, // Ajustado al 6% de la altura de la pantalla
    left: width * 0.03, // Ajustado al 3% del ancho de la pantalla
    padding: width * 0.02, // Ajustado al 2% del ancho de la pantalla
    zIndex: 10,
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
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -height * 0.05, // Subir 5% de la altura de la pantalla
    borderTopLeftRadius: width * 0.1, // 10% del ancho de la pantalla
    borderTopRightRadius: width * 0.1, // 10% del ancho de la pantalla
    paddingVertical: height * 0.03, // 3% de la altura de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
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
  lessonList: {
    padding: width * 0.05, // 5% del ancho de la pantalla
    marginTop: height * 0.01, // 1% de la altura de la pantalla
  },
  cardContainer: {
    width: '100%',
    marginBottom: 10,
  },
  completedCard: {
    opacity: 0.6,
  },
  lessonCard: {
    padding: width * 0.05, // 5% del ancho de la pantalla
    borderRadius: width * 0.02, // 2% del ancho de la pantalla
    marginBottom: height * 0.03, // 3% de la altura de la pantalla
    height: height * 0.18, // 18% de la altura de la pantalla
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: width * 0.230, // 20% del ancho de la pantalla
    height: height * 0.18, // Ajustado al 18% de la altura de la pantalla
    marginRight: width * 0.04, // 4% del ancho de la pantalla
    borderRadius: width * 0.02, // 2% del ancho de la pantalla
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: width * 0.05, // 5% del ancho de la pantalla
    fontWeight: "bold",
    color: "#1c506e",
    textAlign: "left",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: '#888',
    marginTop: 20,
  },
});

export default LessonMenuRL;
