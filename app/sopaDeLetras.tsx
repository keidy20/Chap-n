import SopaDeLetras from '@/components/SopaDeLetras'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <SopaDeLetras/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
