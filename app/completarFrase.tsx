import CompletaLaFrase from '../components/CompletaLaFrase'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <CompletaLaFrase></CompletaLaFrase>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
