import NuevaPassword from '@/components/NuevaPassword'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function NuevaPasswordRoute() {
  return (
    <View style={style.container}>
      <NuevaPassword></NuevaPassword>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
