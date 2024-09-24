import OpcionesReconocerLetras from '../components/OpcionesReconocerLetras'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import MostrarLeccion from '../components/MostrarLeccion'
import QuizLecciones from '../components/QuizLecciones'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <QuizLecciones/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
