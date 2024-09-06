

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// Lista de palabras
const palabras = [
  { palabra: 'casa', opciones: ['carpeta', 'carro', 'casa'] },
  { palabra: 'lapiz', opciones: ['pluma', 'lapiz', 'cuaderno'] },
  { palabra: 'agua', opciones: ['leche', 'jugo', 'agua'] },
  { palabra: 'sol', opciones: ['luna', 'sol', 'estrella'] },
  { palabra: 'manzana', opciones: ['pera', 'banana', 'manzana'] },
  { palabra: 'libro', opciones: ['revista', 'cuaderno', 'libro'] },
  { palabra: 'ratón', opciones: ['perro', 'gato', 'ratón'] },
  { palabra: 'silla', opciones: ['mesa', 'silla', 'sofá'] },
  { palabra: 'pelota', opciones: ['bola', 'pelota', 'lámpara'] },
  { palabra: 'árbol', opciones: ['árbol', 'planta', 'flor'] },
  { palabra: 'zapato', opciones: ['zapato', 'botín', 'sandalia'] },
  { palabra: 'flor', opciones: ['hoja', 'flor', 'rama'] },
  { palabra: 'perro', opciones: ['conejo', 'gato', 'perro'] },
  { palabra: 'pastel', opciones: ['tarta', 'pastel', 'pan'] },
  { palabra: 'plato', opciones: ['vaso', 'taza', 'plato'] },
  { palabra: 'ventana', opciones: ['puerta', 'ventana', 'pared'] },
  { palabra: 'teléfono', opciones: ['televisor', 'computadora', 'teléfono'] },
  { palabra: 'camisa', opciones: ['chaqueta', 'pantalón', 'camisa'] },
  { palabra: 'luna', opciones: ['sol', 'estrella', 'luna'] },
  { palabra: 'pájaro', opciones: ['pájaro', 'murciélago', 'insecto'] },
  { palabra: 'coche', opciones: ['moto', 'coche', 'bicicleta'] },
  { palabra: 'cuadro', opciones: ['póster', 'fotografía', 'cuadro'] },
  { palabra: 'computadora', opciones: ['tablet', 'teléfono', 'computadora'] },
  { palabra: 'espejo', opciones: ['puerta', 'ventana', 'espejo'] },
  { palabra: 'sopa', opciones: ['sopa', 'ensalada', 'comida'] },
  { palabra: 'pan', opciones: ['pan', 'pastel', 'bocadillo'] },
  { palabra: 'camión', opciones: ['camión', 'automóvil', 'bicicleta'] },
  { palabra: 'cuchara', opciones: ['cuchara', 'tenedor', 'cuchillo'] },
  { palabra: 'lámpara', opciones: ['lámpara', 'vela', 'bombilla'] },
  { palabra: 'ventilador', opciones: ['ventilador', 'aire acondicionado', 'calefactor'] },
  { palabra: 'pantalón', opciones: ['pantalón', 'falda', 'shorts'] },
  { palabra: 'globo', opciones: ['globo', 'burbuja', 'esfera'] },
  { palabra: 'escuela', opciones: ['escuela', 'universidad', 'colegio'] },
  { palabra: 'guitarra', opciones: ['guitarra', 'piano', 'violín'] },
  { palabra: 'chaqueta', opciones: ['chaqueta', 'abrigo', 'bufanda'] },
  { palabra: 'ciudad', opciones: ['ciudad', 'pueblo', 'aldea'] },
  { palabra: 'película', opciones: ['película', 'documental', 'serie'] },
  { palabra: 'bicicleta', opciones: ['bicicleta', 'moto', 'patinete'] },
  { palabra: 'sombrero', opciones: ['sombrero', 'gorra', 'bufanda'] },
  { palabra: 'mariposa', opciones: ['mariposa', 'abeja', 'libélula'] },
  { palabra: 'televisor', opciones: ['televisor', 'radio', 'computadora'] },
  { palabra: 'refrigerador', opciones: ['refrigerador', 'horno', 'microondas'] },
  { palabra: 'mochila', opciones: ['mochila', 'bolso', 'maleta'] },
  { palabra: 'nube', opciones: ['nube', 'sol', 'lluvia'] },
  { palabra: 'corbata', opciones: ['corbata', 'bufanda', 'pañuelo'] },
  { palabra: 'vacaciones', opciones: ['vacaciones', 'trabajo', 'estudio'] },
  { palabra: 'peluche', opciones: ['peluche', 'muñeca', 'juguete'] },
  { palabra: 'café', opciones: ['café', 'té', 'chocolate'] },
  { palabra: 'puerta', opciones: ['puerta', 'ventana', 'pared'] },
  { palabra: 'número', opciones: ['número', 'letra', 'símbolo'] },
  { palabra: 'carro', opciones: ['carro', 'camión', 'bicicleta'] },
  { palabra: 'cerca', opciones: ['cerca', 'muralla', 'pared'] },
  { palabra: 'piedra', opciones: ['piedra', 'roca', 'arena'] },
  { palabra: 'juguete', opciones: ['juguete', 'juego', 'peluche'] },
  { palabra: 'lámpara', opciones: ['lámpara', 'luz', 'vela'] },
  { palabra: 'gato', opciones: ['gato', 'perro', 'pájaro'] },
  { palabra: 'bolsa', opciones: ['bolsa', 'mochila', 'cartera'] },
  { palabra: 'aeropuerto', opciones: ['aeropuerto', 'estación', 'puerto'] },
  { palabra: 'cuna', opciones: ['cuna', 'cama', 'sofá'] },
];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizEvaluacion: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [words, setWords] = useState(palabras);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [instructionsGiven, setInstructionsGiven] = useState(false);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [highlightButton, setHighlightButton] = useState(false);

  useEffect(() => {
    if (!instructionsGiven) {
      // Reproducir instrucciones de audio antes de iniciar la evaluación
      const instrucciones = "A continuación, escucharás una palabra y tendrás que seleccionar la opción correcta entre tres opciones. Si seleccionas correctamente, pasarás a la siguiente palabra. El quiz durará un minuto. Por favor, presiona el botón de Iniciar Evaluación para comenzar.";
      Speech.speak(instrucciones, { language: 'es-ES', onDone: () => {
        setInstructionsGiven(true);
        setHighlightButton(true); // Resaltar el botón una vez que las instrucciones se hayan dado
      }});
    }
  }, [instructionsGiven]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEvaluating && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsEvaluating(false);
      // Muestra el resultado final
      alert(`Tiempo terminado. Respuestas correctas: ${correctAnswers}`);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isEvaluating]);

  const startEvaluation = () => {
    const shuffledWords = shuffleArray([...palabras]);
    setWords(shuffledWords); // Actualiza las palabras a las mezcladas
    setIsEvaluating(true);
    setTimeLeft(60);
    setCorrectAnswers(0);
    setCurrentWordIndex(0);
    setSelectedOption(null);
    setCorrectOption(null);
    setHighlightButton(false); // Quitar el resaltado del botón una vez que se haya iniciado la evaluación
  };

  const handleOptionSelect = (option: string) => {
    if (option === words[currentWordIndex].palabra) {
      setCorrectAnswers(correctAnswers + 1);
      setCorrectOption(option);
    } else {
      setCorrectOption(words[currentWordIndex].palabra);
    }
    setSelectedOption(option);
    // Pasar a la siguiente palabra después de un corto retraso para que el usuario pueda ver la opción resaltada
    setTimeout(() => {
      const nextWordIndex = currentWordIndex + 1;
      if (nextWordIndex < words.length) {
        setCurrentWordIndex(nextWordIndex);
        setSelectedOption(null);
        setCorrectOption(null);
      } else {
        // Finalizar evaluación si se completaron todas las palabras
        setIsEvaluating(false);
        alert(`Evaluación finalizada. Respuestas correctas: ${correctAnswers}`);
      }
    }, 1000);
  };

  const playAudio = () => {
    Speech.speak(words[currentWordIndex].palabra, { language: 'es-ES' });
  };

  useEffect(() => {
    if (isEvaluating) {
      playAudio();
    }
  }, [currentWordIndex, isEvaluating]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz de Evaluación</Text>
      {!isEvaluating ? (
        <TouchableOpacity 
          style={[
            styles.button, 
            highlightButton && styles.highlightButton
          ]}
          onPress={startEvaluation}
        >
          <Text style={styles.buttonText}>Iniciar Evaluación</Text>
        </TouchableOpacity>
      ) : (
        <>
          <AnimatedCircularProgress
            size={200}
            width={10}
            fill={100 - (timeLeft / 60) * 100}
            tintColor="#4CAF50"
            backgroundColor="#e0e0e0"
          >
            {() => <Text style={styles.timerText}>{timeLeft}</Text>}
          </AnimatedCircularProgress>
          <Text style={styles.word}>¿Qué palabra escuchaste?</Text>
          <View style={styles.optionsContainer}>
            {words[currentWordIndex].opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedOption === opcion && {
                    borderColor: opcion === words[currentWordIndex].palabra ? '#4CAF50' : '#F44336',
                    borderWidth: 3,
                    backgroundColor: opcion === words[currentWordIndex].palabra ? '#e8f5e9' : '#ffebee',
                  },
                ]}
                onPress={() => handleOptionSelect(opcion)}
                disabled={selectedOption !== null} // Deshabilitar las opciones después de seleccionar una
              >
                <Text style={[
                  styles.optionText,
                  selectedOption === opcion && {
                    color: opcion === words[currentWordIndex].palabra ? '#4CAF50' : '#F44336',
                  }
                ]}>{opcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  word: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 24,
    color: '#a30f0f',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highlightButton: {
    borderColor: '#FFD54F',
    borderWidth: 3,
    backgroundColor: '#A5D6A7',
  }
});

export default QuizEvaluacion;
