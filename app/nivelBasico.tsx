import LeccionLectura from '@/components/LeccionLectura'
import LecturasContenido from '@/components/LecturasContenido'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <LeccionLectura/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
