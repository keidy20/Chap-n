import Login from '@/components/Login'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function LoginRoute() {
  return (
    <View style={style.container}>
      <Login></Login>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
