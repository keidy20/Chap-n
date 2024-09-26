import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { existToken, getToken, removeToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';
import { LinearGradient } from "expo-linear-gradient";

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
        <Icon name="arrow-back" size={40} color="#FAF3EF" />
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
    backgroundColor: '#f0f4f7',
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
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
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  tituloCard: {
    paddingHorizontal: 16,
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 5,
  },
  lessonList: {
    padding: 20,
    marginTop: -5,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 10,
  },
  completedCard: {
    opacity: 0.6,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 0,
    padding: 15,
    paddingTop: 3,
  },
  cardImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    marginLeft: -16,
    borderRadius: 8,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#1c506e",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default LessonMenuRL;
