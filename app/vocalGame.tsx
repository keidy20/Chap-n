import VocalGame from '@/components/VocalGame/VocalGame'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <VocalGame/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
