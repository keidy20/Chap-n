import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturasIntermedio from '@/components/MenuLecturasIntermedio'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturasIntermedio></MenuLecturasIntermedio>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
