import React from 'react'
import { View, StyleSheet } from 'react-native'
import DetalleLecturasAvanzado from '@/components/DetalleLecturasAvanzado'
import MenuLecturasAvanzado from '@/components/MenuLecturasAvanzado'
import DetalleLecturasBasico from '@/components/DetalleLecturasBasico'
import DetalleLecturasIntermedio from '@/components/DetalleLecturasIntermedio'

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
  
