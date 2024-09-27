import React from 'react'
import { View, StyleSheet } from 'react-native';
import LecturasContenido from '../components/Cuestionario';
import Login from '../components/Login/Login';

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