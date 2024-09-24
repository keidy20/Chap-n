import Quiz from '../components/QuizPrimeraLeccion/QuizPrimeraLeccion'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <Quiz/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
