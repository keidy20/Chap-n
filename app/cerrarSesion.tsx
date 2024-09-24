import CompletaLaFrase from '../components/CompletaLaFrase'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import CerrarSesion from '../components/CerrarSesion'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <CerrarSesion></CerrarSesion>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
