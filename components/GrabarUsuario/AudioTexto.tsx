import * as FileSystem from 'expo-file-system';

export const AudioTexto = async (uri: string): Promise<string> => {
  const file = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch('YOUR_SPEECH_TO_TEXT_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`,
    },
    body: JSON.stringify({
      audio: {
        content: file,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    }),
  });

  const json = await response.json();
  return json.results[0].alternatives[0].transcript;
};
