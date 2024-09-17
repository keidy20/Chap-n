import React from 'react'
import { View, StyleSheet } from 'react-native'
import Dislexia from '../components/Dislexia'
import QuizLecciones from '../components/QuizLecciones'
import QuizPrimeraLeccion from '../components/QuizPrimeraLeccion'
import CompletaLaFrase from '../components/CompletaLaFrase'
import LecturasContenido from '../components/LecturasContenido'

export default function CrearCuentaRoute(navigation) {
  return (
    <View style={style.container}>
      <LecturasContenido navigation={navigation} />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
