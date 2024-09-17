import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function Page() {
  const { id } = useLocalSearchParams();

  return <Text>Id Enviado: {id}</Text>;
}