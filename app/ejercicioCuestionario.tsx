import React from 'react'
import { View, StyleSheet } from 'react-native'
import EjercicioCuestionario from '@/components/EjercicioCuestionario'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <EjercicioCuestionario/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  