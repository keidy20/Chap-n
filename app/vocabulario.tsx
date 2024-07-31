import Vocabulario from '@/components/Vocabulario'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocabularioRoute() {
  return (
    <View style={style.container}>
      <Vocabulario/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
