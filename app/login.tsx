import GrabarAudio from '@/components/GrabarAudio';
import Login from '@/components/Login';
import React from 'react'
import { View, StyleSheet } from 'react-native';

export default function LoginRoute() {
    const handleLogin = () => {}
  return (
    <View style={styles.container}>
      <GrabarAudio/>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });