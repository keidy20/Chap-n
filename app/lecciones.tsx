import React from 'react'
import { View, StyleSheet } from 'react-native';
import LecturasContenido from '../components/Cuestionario';

export default function Lecciones() {
  return (
    <View style={styles.container}>
      <LecturasContenido/>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });