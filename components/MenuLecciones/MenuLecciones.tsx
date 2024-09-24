import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { existToken, getToken, removeToken } from '@/utils/TokenUtils';
import { getUsuario } from '@/utils/UsuarioUtils';
import { LinearGradient } from "expo-linear-gradient";

const LessonMenuRL: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const router = useRouter();

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    console.log('Entrando a dislexia');
    const fetchLessons = async () => {
      const username = await getUsuario();
      const url = `${baseUrl}/lecciones/all/${username}`;
      let token = null;
      if (await existToken()) {
        token = await getToken();
        console.log('Token en lecciones ', token);
      } else {
        router.navigate('/home');
      }
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          },
        });

        if (!res.ok) {
          console.log('Error al consumir ', res.status);
          if (res.status == 403) {
            removeToken();
            router.navigate('/login');
          }
          throw new Error('Network response was not ok ' + res.statusText);
        }

        const data = await res.json();
        console.log('Resultado de lecciones por usuario ', data);
        const filteredLessons = data.filter((d: any) => d.tipoLeccion === 'RL');
        setLessons(filteredLessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
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
        <Icon name="arrow-back" size={24} color="#FAF3EF" />
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
                  <Image
                    source={{ uri: "https://firebasestorage.googleapis.com/v0/b/indigo-cider-432618-r6.appspot.com/o/lecciones%2FLI_32%2Fimagenes%2FMiedo.jpeg?alt=media" }} // Cambia la URL por la imagen que desees
                    style={styles.cardImage}
                  />
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
    backgroundColor: '#FFF', // Fondo blanco sin degradado
    borderRadius: 0, // Sin bordes
    padding: 15,
    paddingTop: 3
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
  icon: {
    marginLeft: 'auto', // Empuja el ícono hacia la derecha
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default LessonMenuRL;
