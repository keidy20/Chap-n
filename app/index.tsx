import { router } from 'expo-router';
import { existToken, getToken, removeToken} from '@/utils/TokenUtils';
import { useEffect} from "react";
import { getUsuario } from '@/utils/UsuarioUtils';
import GrabarAudio from '@/components/GrabarAudio';
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function Index() {
  return (
    <View style={style.container}>
      <GrabarAudio/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })