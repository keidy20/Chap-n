import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturasAvanzado from '@/components/MenuLecturasAvanzado'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturasAvanzado></MenuLecturasAvanzado>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
