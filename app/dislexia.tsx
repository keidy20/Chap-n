import React from 'react'
import { View, StyleSheet } from 'react-native'
import Dislexia from '../components/Dislexia'
import QuizLecciones from '../components/QuizLecciones'
import QuizPrimeraLeccion from '../components/QuizPrimeraLeccion'
import CompletaLaFrase from '../components/CompletaLaFrase'
import DetalleLecturas from '../components/DetalleLecturasBasico'
import MenuLecturasNuevo from '../components/MenuLecturasBasico'

export default function CrearCuentaRoute() {
  return (
    <View style={style.container}>
      <MenuLecturasNuevo/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
