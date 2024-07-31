import HistoriasLeccion from '@/components/HistoriasLeccion';
import React from 'react'
import { View, StyleSheet } from 'react-native';

export default function HistoriasLeccionRouter() {
  return (
    <View style={styles.container}>
      <HistoriasLeccion></HistoriasLeccion>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });