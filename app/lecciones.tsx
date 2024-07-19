import LeccionLectura from '@/components/LeccionLectura';
import React from 'react'
import { View, StyleSheet } from 'react-native';

export default function Lecciones() {
  return (
    <View style={styles.container}>
      <LeccionLectura></LeccionLectura>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });