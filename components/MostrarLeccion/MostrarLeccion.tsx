import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OpcionesReconocerLetras from '../OpcionesReconocerLetras/OpcionesReconocerLetras'; // Ajusta la ruta según sea necesario
import MenuLecciones from '../MenuLecciones/MenuLecciones'; // Ajusta la ruta según sea necesario

interface Lesson {
  tipoLeccion: string;
  titulo: string;
  contenido: {
    letra: string;
    silabas: string[][];
    palabra: string[];
    sentencia: string[];
  };
}

const MostrarLeccion: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    getLecciones();
  }, []);

  const getLecciones = async () => {
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
      // Filtrar las lecciones por tipo 'RL' y mapear el contenido
      const filteredLessons = data
        .filter((d: any) => d.tipoLeccion === 'RL')
        .map((d: any) => ({
          ...d,
          contenido: {
            letra: d.contenido.letra,
            silabas: d.contenido.silabas,
            palabra: d.contenido.palabra,
            sentencia: d.contenido.sentencia,
          }
        }));
      setLessons(filteredLessons);
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const handleSelectLesson = (index: number) => {
    setSelectedLesson(index);
  };

  return (
    <View style={styles.mainContainer}>
      {selectedLesson !== null && lessons[selectedLesson] ? (
        <OpcionesReconocerLetras lesson={lessons[selectedLesson].contenido} />
      ) : (
        <MenuLecciones lessons={lessons} onSelectLesson={handleSelectLesson} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E8F5FF',
  },
});

export default MostrarLeccion;
