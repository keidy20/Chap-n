import LeccionesVocales from '@/components/LeccionesVocales'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <LeccionesVocales letter='A'/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
