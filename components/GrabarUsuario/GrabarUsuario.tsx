// SpeechRecognitionComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { AudioTexto } from './AudioTexto';

const SpeechRecognitionComponent: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [targetLetter, setTargetLetter] = useState<string>('A');

  useEffect(() => {
    // Speak the target letter when the component mounts
    Speech.speak(`Repite después de mí la siguiente letra: ${targetLetter}`);
  }, [targetLetter]);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setRecordedUri(uri);

    console.log('Recording stopped and stored at', uri);
  };

  const handleAudioToText = async () => {
    if (recordedUri) {
      const recognizedText = await AudioTexto(recordedUri);
      setRecognizedText(recognizedText);
    }
  };

  const validateText = () => {
    if (recognizedText.toLowerCase() === targetLetter.toLowerCase()) {
      alert('¡Correcto!');
    } else {
      alert('Inténtalo de nuevo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDENTIFICAR</Text>
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        <View style={styles.microphoneButton}>
          <Text style={styles.buttonText}>{recording ? 'Detener' : 'Hablar'}</Text>
        </View>
      </TouchableOpacity>
      {recordedUri && (
        <Button title="Convertir Audio a Texto" onPress={handleAudioToText} />
      )}
      {recognizedText && (
        <View>
          <Text>Texto Reconocido: {recognizedText}</Text>
          <Button title="Validar" onPress={validateText} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  microphoneButton: {
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default SpeechRecognitionComponent;
