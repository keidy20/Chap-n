import React from 'react';
import { View, StyleSheet } from 'react-native';
import IntroduccionSeccion from '@/components/IntroduccionSeccion';

interface RouteParams {
  params: {
    letter: string;
  };
}

interface LessonScreenProps {
  route: RouteParams;
}

const PantallaLeccion: React.FC<LessonScreenProps> = ({ route }) => {
  const { letter } = route.params;

  return (
    <View style={styles.container}>
      <IntroduccionSeccion letter={letter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PantallaLeccion;
