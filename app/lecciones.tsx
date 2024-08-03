import IntroduccionSeccion from '@/components/IntroduccionSeccion';
import React from 'react'
import { View, StyleSheet } from 'react-native';

export default function Lecciones() {
  return (
    <View style={styles.container}>
      <IntroduccionSeccion></IntroduccionSeccion>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });