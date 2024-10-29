import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { existToken, getToken, removeToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LessonMenuRL: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchData = async () => {
      const username = await getUsuario();
      const lessonsUrl = `${baseUrl}/lecciones/all/${username}`;
      const imagesUrl = `${baseUrl}/lecciones/all`;
      let token = null;

      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate('/home');
        return;
      }

      try {
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
        const filteredImages = imagesData.filter((d: any) => d.tipoLeccion === 'RL');
        const lessonImages = filteredImages.map((image: any) => image.contenido.imagenes[0]?.url);
        setImages(lessonImages);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToLessonDetail = (id: string) => {
    router.push(`/Dislexia/${encodeURIComponent(id)}`);
  };

  const goBack = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Icon name="arrow-back" size={48} color="#FAF3EF" />
      </TouchableOpacity>
      <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
        <Text style={styles.headerText}>Lecciones</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Identificación De Letras</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2A6F97" style={styles.loadingIndicator} />
        ) : (
          <ScrollView style={styles.lessonList}>
            {lessons.map((lesson, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cardContainer, lesson.completado ? styles.completedCard : null]}
                onPress={() => goToLessonDetail(lesson.id)}
              >
                <View style={styles.lessonCard}>
                  {images[index] ? (
                    <Image
                      source={{ uri: images[index] }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <Image
                      source={{ uri: "https://example.com/default-image.jpg" }}
                      style={styles.cardImage}
                    />
                  )}
                  <View style={styles.lessonContent}>
                    <Text style={styles.lessonTitle}>{lesson.titulo}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
    top: height * 0.06,
    left: width * 0.03,
    padding: width * 0.02,
    zIndex: 10,
  },
  header: {
    height: height * 0.35,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#FFF",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -height * 0.05,
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.04,
  },
  tituloCard: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#000",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    marginLeft: 20,
  },
  lessonList: {
    padding: width * 0.05,
    marginTop: height * 0.01,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 10,
  },
  completedCard: {
    opacity: 0.6,
  },
  lessonCard: {
    padding: width * 0.05,
    borderRadius: width * 0.02,
    marginBottom: height * 0.03,
    height: height * 0.18,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: width * 0.23,
    height: height * 0.18,
    marginRight: width * 0.04,
    borderRadius: width * 0.02,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#1c506e",
    textAlign: "left",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default LessonMenuRL;
