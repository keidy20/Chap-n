import EjercicioCompletado from '@/components/EjercicioCompletado'
import Bienvenida from '../components/Bienvenida'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <EjercicioCompletado/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  