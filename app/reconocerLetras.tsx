import MenuLecciones from '@/components/MenuLecciones'
import Bienvenida from '../components/Bienvenida'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function BienvenidaRoute() {
  return (
    <View style={style.container}>
      <MenuLecciones/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  