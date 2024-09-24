import React from 'react'
import { View, StyleSheet } from 'react-native'
import DetalleLecturasAvanzado from '@/components/DetalleLecturasAvanzado'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <DetalleLecturasAvanzado></DetalleLecturasAvanzado>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
