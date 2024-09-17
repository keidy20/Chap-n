import React from 'react'
import { View, StyleSheet } from 'react-native'
import LecturasContenido from '../components/LecturasContenido'

export default function CompletarOracionRoute(navigation) {
  return (
    <View style={style.container}>
      <LecturasContenido navigation={navigation} />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
