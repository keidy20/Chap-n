import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  async function loadAndPlaySound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/Correcto.mp3'),
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);
    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    loadAndPlaySound();

    const interval = setInterval(async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        console.log('Playback Status:', status);
        if (status.didJustFinish) {
          console.log('Audio finishedd!');
          setIsPlaying(false);
          clearInterval(interval);
        }
      }
    }, 1000); // Verifica el estado cada segundo

    return () => {
      clearInterval(interval);
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <View>
      {/* No necesitas un botón aquí ya que el audio se reproduce automáticamente */}
    </View>
  );
}
