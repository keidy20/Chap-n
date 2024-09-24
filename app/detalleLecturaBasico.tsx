import React from 'react'
import { View, StyleSheet } from 'react-native'
import MenuLecturasBasico from '@/components/MenuLecturasBasico'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturasBasico></MenuLecturasBasico>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
