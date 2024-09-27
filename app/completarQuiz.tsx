import React from 'react'
import { View, StyleSheet } from 'react-native'
import Cuestionario from '../components/Cuestionario'

export default function CompletarOracionRoute(navigation: any) {
  return (
    <View style={style.container}>
      <Cuestionario navigation={navigation} />
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
