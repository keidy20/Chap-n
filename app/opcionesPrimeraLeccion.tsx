import React from 'react'
import { View, StyleSheet } from 'react-native'
import LeccionCompletada from '../components/LeccionCompletada/LeccionCompletada'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <LeccionCompletada/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
