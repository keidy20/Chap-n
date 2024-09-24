import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturasNuevo from '../components/MenuLecturasBasico'


export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturasNuevo/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
