import CrearCuenta from '@/components/CrearCuenta'
import Juegos from '@/components/Juegos'
import LeccionLectura from '@/components/LeccionLectura'
import LetrasCombinadas from '@/components/LetrasCombinadas'
import Mayusculas from '@/components/Mayusculas'
import Minuscula from '@/components/Minuscula'
import Nivel1 from '@/components/Nivel1'
import PalabrasDiarias from '@/components/PalabrasDiarias'
import Quiz1 from '@/components/Quiz1'
import ReconocerLetra from '@/components/ReconocerLetra'
import Vocales from '@/components/Vocales'
import VocalGame from '@/components/VocalGame/VocalGame'
import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function VocalesRoute() {
  return (
    <View style={style.container}>
      <Vocales/>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  
