import { router } from 'expo-router';
import { existToken} from '@/utils/TokenUtils';
import React, { useEffect} from "react";

export default function Index() {
    useEffect(() => {
        redirect()
      });
  
  
    const redirect = async () => {
      if (await existToken()) {
        router.navigate('/bienvenida')
      } else {
        router.navigate('/bienvenida')
      }
    }
}
  