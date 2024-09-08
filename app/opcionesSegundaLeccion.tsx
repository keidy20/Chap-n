import React from 'react'
import { View, StyleSheet } from 'react-native'
import OpcionesPrimeraLeccion from '@/components/OpcionesPrimeraLeccion'
import OpcionesSegundaLeccion from '@/components/OpcionesSegundaLeccion'
import GrabarAudio from '@/components/GrabarAudio'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <GrabarAudio/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
