import EvaluacionIntermedia from '@/components/EvaluacionIntermedia'
import EvaluacionIntermediaCompletada from '@/components/EvaluacionIntermediaCompletado'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <EvaluacionIntermediaCompletada/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
