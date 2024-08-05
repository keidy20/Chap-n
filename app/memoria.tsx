import ReconocerLetra from '@/components/ReconocerLetra'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function MemoryGameRoute() {
  return (
    <View style={style.container}>
      <ReconocerLetra/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
})
  
