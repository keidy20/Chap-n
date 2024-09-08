
import NivelesDeFluidez from '@/components/NivelesDeFluidez'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <NivelesDeFluidez/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
