import React from 'react'
import { View, StyleSheet } from 'react-native'
import Opciones from "@/components/Opciones";

export default function HomeRoute() {
  return (
    <View style={style.container}>
      <Opciones />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
})
