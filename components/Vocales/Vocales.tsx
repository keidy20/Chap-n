import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import VocalGame from '@/components/VocalGame/VocalGame';
import { FontAwesome } from '@expo/vector-icons';

const Vocales: React.FC = () => {
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [showLowercase, setShowLowercase] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vowelStage, setVowelStage] = useState<'uppercase' | 'lowercase'>('uppercase');

  const animateVowels = (vowels: string[], isLowercase: boolean) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= vowels.length) {
        clearInterval(interval);
        if (isLowercase) {
          Speech.speak(
            'Felicidades ya conoces las vocales, ahora vamos a poner a prueba tus conocimientos para poder identificar las vocales que se te presentaron, presta atención para poder continuar con el juego',
            {
              onDone: () => setShowGame(true),
            }
          );
        }
        return;
      }
      const vowel = vowels[index];
      setActiveVowel(vowel);
      Speech.speak(vowel, { language: 'es' });
      // Dividir el progreso entre las dos etapas
      setProgress(((index + 1) / vowels.length) * 50 + (isLowercase ? 50 : 0));
      index++;
    }, 2000);
  };

  useEffect(() => {
    Speech.speak('A continuación conocerás las vocales en mayúsculas', {
      onDone: () => {
        animateVowels(['A', 'E', 'I', 'O', 'U'], false);
      },
    });
  }, []);

  useEffect(() => {
    if (showLowercase) {
      animateVowels(['a', 'e', 'i', 'o', 'u'], true);
    }
  }, [showLowercase]);

  if (showGame) {
    return <VocalGame />;
  }

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%` },
          ]}
        />
      </View>

      {/* Contenido de las vocales */}
      <View style={styles.content}>
        <View style={styles.row}>
          {vowelStage === 'uppercase' && (
            <>
              <VowelImage
                source={require('../../assets/A.png')}
                activeVowel={activeVowel}
                vowel="A"
              />
              <VowelImage
                source={require('../../assets/E.png')}
                activeVowel={activeVowel}
                vowel="E"
              />
              <VowelImage
                source={require('../../assets/I.png')}
                activeVowel={activeVowel}
                vowel="I"
              />
            </>
          )}
          {vowelStage === 'lowercase' && (
            <>
              <VowelImage
                source={require('../../assets/a M.png')}
                activeVowel={activeVowel}
                vowel="a"
              />
              <VowelImage
                source={require('../../assets/e M.png')}
                activeVowel={activeVowel}
                vowel="e"
              />
              <VowelImage
                source={require('../../assets/i M.png')}
                activeVowel={activeVowel}
                vowel="i"
              />
            </>
          )}
        </View>
        <View style={styles.row}>
          {vowelStage === 'uppercase' && (
            <>
              <VowelImage
                source={require('../../assets/O.png')}
                activeVowel={activeVowel}
                vowel="O"
              />
              <VowelImage
                source={require('../../assets/U.png')}
                activeVowel={activeVowel}
                vowel="U"
              />
            </>
          )}
          {vowelStage === 'lowercase' && (
            <>
              <VowelImage
                source={require('../../assets/o M.png')}
                activeVowel={activeVowel}
                vowel="o"
              />
              <VowelImage
                source={require('../../assets/u M.png')}
                activeVowel={activeVowel}
                vowel="u"
              />
            </>
          )}
        </View>
      </View>

      {/* Botón de siguiente */}
      <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (vowelStage === 'uppercase') {
              Speech.speak('Ahora conocerás las vocales minúsculas', {
                onDone: () => {
                  setVowelStage('lowercase');
                  setShowLowercase(true);
                },
              });
            } else {
              setShowGame(true);
            }
          }}
        >
        <Text style={styles.nextButtonText}>Siguiente  <FontAwesome name="arrow-right" size={22} color="white" /></Text>
      </TouchableOpacity>
    </View>
  );
};

const VowelImage: React.FC<{
  source: any;
  activeVowel: string | null;
  vowel: string;
}> = ({ source, activeVowel, vowel }) => {
  return (
    <View style={styles.corner}>
      <Image
        source={source}
        style={[
          styles.image,
          { opacity: activeVowel === vowel ? 1 : 1 }, // Eliminar la opacidad
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    width: '95%',
    height: 12,
    backgroundColor: '#cccccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 60,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 12,
    borderRadius: 5,
    backgroundColor: '#2A6F97',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  corner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: '#2A6F97',
    width: '95%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Vocales;
