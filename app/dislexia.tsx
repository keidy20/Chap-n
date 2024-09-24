import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturasNuevo from '../components/MenuLecturasBasico'
import MenuLecciones from '@/components/MenuLecciones'


export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      {/* <MenuLecturasNuevo/> */}
      <MenuLecciones />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
