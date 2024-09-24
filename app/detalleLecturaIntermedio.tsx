import React from 'react'
import { View, StyleSheet } from 'react-native'
import DetalleLecturasIntermedio from '@/components/DetalleLecturasIntermedio'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <DetalleLecturasIntermedio></DetalleLecturasIntermedio>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
