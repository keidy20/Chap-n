import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer: React.FC = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);

  const playSound = async () => {
    try {
      // Cargar el archivo de audio
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/Bienvenida.mp3') // Reemplaza con tu archivo de audio
      );
      setSound(sound);

      // Reproducir el audio
      await sound.playAsync();
      setIsPlaying(true);

      // Escuchar el estado del audio
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setAudioEnded(true);
            setIsPlaying(false);
            console.log('El audio ha terminado.');
            Alert.alert('Audio terminado', 'El audio ha terminado de reproducirse.');
          }
        } else {
          console.log('Audio no cargado correctamente.');
        }
      });
    } catch (error) {
      console.error('Error al cargar o reproducir el audio:', error);
    }
  };

  // Reproducir el audio automáticamente cuando el componente se monta
  useEffect(() => {
    playSound();

    // Limpiar el audio cuando el componente se desmonte
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (audioEnded) {
      console.log("Se ha alcanzado el final del audio.");
    }
  }, [audioEnded]);

  return (
    <View>
      <Text>{isPlaying ? 'Reproduciendo audio...' : 'Audio detenido o terminado.'}</Text>
    </View>
  );
};

export default AudioPlayer;
