import EvaluacionInicialCompletada from '@/components/EvaluacionInicialCompletada'
import GrabarAudio from '@/components/GrabarAudio'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
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
  
