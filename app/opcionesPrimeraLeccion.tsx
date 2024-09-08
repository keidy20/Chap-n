import React from 'react'
import { View, StyleSheet } from 'react-native'
import OpcionesPrimeraLeccion from '@/components/OpcionesPrimeraLeccion'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <OpcionesPrimeraLeccion/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
