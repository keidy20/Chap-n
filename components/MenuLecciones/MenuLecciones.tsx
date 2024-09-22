import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { existToken, getToken } from '@/utils/TokenUtils';

const LessonMenuRL: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const router = useRouter();

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchLessons = async () => {
      const url = `${baseUrl}/lecciones/all`;
      let token = null;
      if (await existToken()) {
        token = await getToken()
        console.log('Token en lecciones ', token)
      } else {
        router.navigate('/home')
      }
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          }
        });

        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }

        const data = await res.json();
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Leciones.png')} // Imagen de encabezado
        style={styles.header}
        resizeMode="cover"
      >
        {/* Aquí está la imagen de fondo */}
      </ImageBackground>

      {/* Título debajo de la imagen */}
      <Text style={styles.headerTitle}>Lecciones RL</Text>

      <ScrollView style={styles.lessonList}>
        {lessons.length === 0 ? (
          <Text style={styles.emptyText}></Text>
        ) : (
          lessons.map((lesson, index) => (
            <TouchableOpacity key={index} style={styles.cardContainer} onPress={() => goToLessonDetail(lesson.id)}>
              <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle}>{lesson.titulo}</Text>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botón de regresar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="#2A6F97" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    width: '90%',
    height: 300, // Ajusta la altura si es necesario
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginTop: 60,
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#1c506e',
    textAlign: 'center',
    marginTop: 5,  // Margen para separarlo de la imagen
  },
  lessonList: {
    padding: 20,
    marginTop: 20, // Espacio entre el título y las tarjetas
  },
  cardContainer: {
    width: '100%',
    marginBottom: 10,
  },
  projectCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20, 
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    marginBottom: 10, 
  },
  lessonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e6eefc',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 6,
    padding: 10,
  },
});

export default LessonMenuRL;
