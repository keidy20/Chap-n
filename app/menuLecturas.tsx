import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturas from '../components/MenuLecturas'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturas></MenuLecturas>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
