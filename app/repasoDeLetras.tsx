import React from 'react'
import { View, StyleSheet } from 'react-native'
import RepasoDeLetras from '@/components/RepasoDeLetras'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <RepasoDeLetras/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
