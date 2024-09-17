import MenuLecciones from '../components/MenuLecciones'
import React from 'react'
import { View, StyleSheet } from 'react-native'
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
  