import React from 'react'
import { View, StyleSheet } from 'react-native'
import CompletaLaOracion from '../components/CompletaLaOracion'

export default function CompletarOracionRoute() {
  return (
    <View style={style.container}>
      <CompletaLaOracion></CompletaLaOracion>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
