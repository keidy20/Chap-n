import Bienvenida from '../components/Bienvenida'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function Index() {
  return (
    <View style={style.container}>
        <Bienvenida/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  