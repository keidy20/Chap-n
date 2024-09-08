import LeccionLecturaIntermedio from '@/components/LeccionLecturaIntermedio'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <LeccionLecturaIntermedio/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
