// LessonMenuRL.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Dislexia from '../Dislexia/Dislexia';

const LessonMenuRL: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const router = useRouter(); // Cambiado a useRouter

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchLessons = async () => {
      const url = `${baseUrl}/lecciones/all`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }

        const data = await res.json();
        // Filtra las lecciones por tipo 'RL'
        console.log('Data chetos ', data.filter((d: any) => d.tipoLeccion === 'RL'))
        const filteredLessons = data.filter((d: any) => d.tipoLeccion === 'RL');
        setLessons(filteredLessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  const goToLessonDetail = (id: string) => {
    router.push(`/Dislexia/${encodeURIComponent(id)}`); // Pasar título en la URL
  };

  const renderLessonList = () => {
    if (lessons.length === 0) {
      return <Text style={styles.emptyText}>Cargando lecciones...</Text>;
    }

    return lessons.map((lesson, index) => (
      <TouchableOpacity key={index} style={styles.cardContainer} onPress={() => goToLessonDetail(lesson.id)}>
        <LinearGradient colors={['#2A6F97', '#539ec9']} style={styles.projectCard}>
          <View style={styles.lessonContent}>
            <Text style={styles.lessonTitle}>{lesson.titulo}</Text>
            <Ionicons name="chevron-forward" size={24} color="#007bff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
          <Icon name="arrow-back" size={30} color="#2A6F97" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecciones RL</Text>
      </View>
      <ScrollView style={styles.lessonList}>
        {renderLessonList()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A6F97',
  },
  lessonList: {
    marginTop: 10,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  projectCard: {
    flex: 1,
    borderRadius: 12,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default LessonMenuRL;
