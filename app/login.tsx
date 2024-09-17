import React from 'react'
import { View, StyleSheet } from 'react-native';
import LecturasContenido from '../components/LecturasContenido';
import Login from '../components/Login/Login';
import SopaDeLetras from '../components/SopaDeLetras';

export default function LoginRoute() {
  return (
    <View style={styles.container}>
      <Login/>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });