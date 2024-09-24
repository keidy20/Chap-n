import React from 'react'
import { View, StyleSheet } from 'react-native'
import Dislexia from '../components/Dislexia'
import QuizLecciones from '../components/QuizLecciones'
import QuizPrimeraLeccion from '../components/QuizPrimeraLeccion'
import CompletaLaFrase from '../components/CompletaLaFrase'
import DetalleLecturas from '../components/DetalleLecturas'
import MenuLecturasNuevo from '../components/MenuLecturasNuevo'
import MenuLecciones from '@/components/MenuLecciones'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecciones/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
