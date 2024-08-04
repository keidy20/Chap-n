import RecuperarPassword from '@/components/RecuperarPassword'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function RecuperarPasswordRoute() {
  return (
    <View style={style.container}>
      <RecuperarPassword></RecuperarPassword>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
