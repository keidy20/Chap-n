import Splash from '@/components/Splash'
import Bienvenida from '../components/Bienvenida'
import { router } from 'expo-router';
import { existToken, removeToken } from '@/utils/TokenUtils';
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from 'react-native'

export default function Index() {
    useEffect(() => {
        redirect()
      });
  
  
    const redirect = async () => {
      if (await existToken()) {
        router.navigate('/home')
      } else {
        router.navigate('/bienvenida')
      }
    }
}
  