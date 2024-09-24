import React from 'react'
import { View, StyleSheet } from 'react-native'
import GrabarAudio from '../components/GrabarAudio'
import OpcionesSegundaLeccion from '../components/OpcionesSegundaLeccion/OpcionesSegundaLeccion'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <OpcionesSegundaLeccion/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
