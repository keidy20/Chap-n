import CrearCuenta from '@/components/CrearCuenta'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <CrearCuenta></CrearCuenta>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
