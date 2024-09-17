import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuEjercicios from '../components/MenuEjercicios'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuEjercicios></MenuEjercicios>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
