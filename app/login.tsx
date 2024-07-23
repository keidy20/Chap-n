import Login from '@/components/Login';
import React from 'react'
import { View, StyleSheet } from 'react-native';

export default function LoginRoute() {
    const handleLogin = () => {}
  return (
    <View style={styles.container}>
      <Login onLogin={handleLogin}/>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });