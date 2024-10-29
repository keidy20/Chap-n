import EvaluacionFinal from '@/components/EvaluacionFinal'
import EvaluacionFinalCompletada from '@/components/EvaluacionFinalCompletada'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <EvaluacionFinalCompletada/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  