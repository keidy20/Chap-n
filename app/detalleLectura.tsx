import CompletaLaFrase from '../components/CompletaLaFrase'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import DetalleLecturas from '../components/DetalleLecturas'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <DetalleLecturas></DetalleLecturas>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
