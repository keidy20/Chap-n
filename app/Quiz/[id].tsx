import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { existToken, getToken } from "@/utils/TokenUtils";
import { getUsuario } from "@/utils/UsuarioUtils";

interface Lesson {
  id: string;
  opciones: string[];
  respuestaCorrecta: string;
}

interface LessonData {
  id: number;
  titulo: string;
  contenido: {
    quizData: Lesson[];
    audios: { id: string; url: string }[];
  };
}

const QuizComponent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ completed, setCompleted ] = useState(false)

  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  useEffect(() => {
    const fetchLessonById = async () => {
      let token = null;
      if (await existToken()) {
        token = await getToken();
      } else {
        router.navigate("/home");
      }
      try {
        const response = await fetch(`${baseUrl}/lecciones/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data: LessonData = await response.json();
        console.log("PAPA ", data);

        if (data && data.contenido) {
          setLessons(data.contenido.quizData);
          setAudios(data.contenido.audios.map((elemento) => elemento.url));
        } else {
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (id) {
      fetchLessonById();
    }
  }, [id]);

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    const speakAndStartTimer = async () => {
      if (lessons.length === 0 || audios.length === 0) return;

      setIsSpeaking(true);
      const currentAudioUrl = audios[currentQuestionIndex];

      try {
        const { sound } = await Audio.Sound.createAsync({
          uri: currentAudioUrl,
        });
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            sound.unloadAsync(); // Libera el sonido cuando termine de reproducirse
            setIsSpeaking(false);
            setTimeLeft(5);
          }
        });
      } catch (error) {
        console.error("Error al reproducir el audio:", error);
        setIsSpeaking(false);
        setTimeLeft(5);
      }
    };

    speakAndStartTimer();

    return () => {
      setTimeLeft(5);
      setSelectedOption(null);
    };
  }, [currentQuestionIndex, audios]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0 && !isSpeaking) {
      if (timeLeft == 5) {
        timer = setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 50);
      } else {

        timer = setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
    } else if (timeLeft === 0 && !isSpeaking) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, isSpeaking]);

  const playSound = async (type: "correct" | "incorrect") => {
    const soundPath =
      type === "correct"
        ? require("../../assets/Correcto.mp3")
        : require("../../assets/incorrecto.mp3");

    const { sound } = await Audio.Sound.createAsync(soundPath);
    await sound.playAsync();
  };

  const handleOptionPress = async (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const currentQuestion = lessons[currentQuestionIndex];
    const isCorrect = option === currentQuestion.respuestaCorrecta;

    if (isCorrect) {
      setScore(score + 1);
      await playSound("correct");
    } else {
      await playSound("incorrect");
    }

    setTimeLeft(0);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < lessons.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(5);
    } else {
      await completarQuiz();
      setCompleted(!completed)
      setShowResult(true);
    }
  };

  const completarQuiz = async () => {
    let token = null;
    let usuario = await getUsuario()
    if (await existToken()) {
      token = await getToken();
    } else {
      router.navigate("/home");
    }
    try {
      const response = await fetch(
        `${baseUrl}/usuarios_lecciones/registrar_leccion_by_username`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usuario,
            idLeccion: id,
            completado: true,
            puntuacion: (score/lessons.length)
          })
        }
      );
      const data: LessonData = await response.json();
    } catch (error) {}
  };

  const restartQuiz = () => {
    if (score < 4) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setTimeLeft(5);
      setShowResult(false);
    } else {
      router.push('/dislexia')
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A6F97" />
        <Text>Cargando preguntas...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>{ score < 4 ? 'Parece que no lo has logrado' : '¡Has completado el quiz!'}</Text>
        <Text style={styles.scoreText}>
          Tu puntuación: {score}/{lessons.length}
        </Text>
        <TouchableOpacity  style={styles.restartButton} onPress={restartQuiz}>
          <Text style={styles.restartButtonText}>{ score < 4  ? 'Volver a intentar' : 'Regresar'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = lessons[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={180}
        width={12}
        fill={(timeLeft / 5) * 100}
        tintColor="#2A6F97"
        backgroundColor="#e0e0e0"
      >
        {() => <Text style={styles.timeText}>{timeLeft}</Text>}
      </AnimatedCircularProgress>

      {currentQuestion.opciones.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option &&
            option === currentQuestion.respuestaCorrecta
              ? styles.correctOption
              : selectedOption === option &&
                option !== currentQuestion.respuestaCorrecta
              ? styles.incorrectOption
              : styles.optionButton,
          ]}
          onPress={() => handleOptionPress(option)}
          disabled={!!selectedOption || isSpeaking}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 3,
    borderColor: "#d0d0d0",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 10,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  correctOption: {
    borderColor: "#28a745",
  },
  incorrectOption: {
    borderColor: "#dc3545",
  },
  optionText: {
    fontSize: 22,
    color: "#333",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  restartButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  timeText: {
    fontSize: 30,
    color: "#2A6F97",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QuizComponent;
