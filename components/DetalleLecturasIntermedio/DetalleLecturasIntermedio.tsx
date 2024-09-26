import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { getUsuario } from "@/utils/UsuarioUtils";
import { existToken, getToken } from "@/utils/TokenUtils";

const BookDetails = () => {
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const { id, titulo, sections, imageUri, audios } = useLocalSearchParams();
  const parsedBook = typeof titulo === "string" ? JSON.parse(titulo) : null;
  const parseAudios = Array.isArray(audios)
    ? audios
    : JSON.parse(audios || "[]");
  console.log("CHACHIN", parseAudios);

  const readingSections = Array.isArray(sections)
    ? sections
    : JSON.parse(sections || "[]");
  const validImageUri = typeof imageUri === "string" ? imageUri : null;

  const [sound, setSound] = useState<Audio.Sound | null>(null); // Estado para el sonido

  const [currentSection, setCurrentSection] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Función para reproducir sonido
  const playSound = async (audioUrl: string) => {
    if (sound) {
      await sound.unloadAsync(); // Detener cualquier audio que esté sonando
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });

    setSound(newSound);
    await newSound.playAsync();

    // Configura el callback para cuando cambia el estado de reproducción
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        if (status.didJustFinish) {
          console.log("Reproducción completada");
          setIsPlaying(false); // Puedes usar este estado para manejar la UI
          // Aquí puedes manejar lo que pasa después de que se termine la reproducción
        }
      } else if (status.error) {
        console.log(`Error en la reproducción: ${status.error}`);
      }
    });
  };

  useEffect(() => {
    console.log("Entro aqui jajajaja ", parseAudios[0].url);
    playSound(parseAudios[0].url);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Limpiar el sonido al desmontar el componente
      }
    };
  }, [sound]);

  const handleReadNow = () => {
    setIsReading(true);
    setIsPlaying(true);
    setCurrentSection(1); // Comenzar desde la segunda sección
  };

  // Agregar useEffect para reproducir el audio cuando currentSection cambie
  useEffect(() => {
    if (parseAudios.length > 0 && currentSection >= 0) {
      console.log("Current section", currentSection);
      playSound(parseAudios[currentSection]?.url); // Reproducir el audio correspondiente
    }
  }, [currentSection]); // Escuchar cambios en currentSection

  useEffect(() => {
    console.log("Se esta reproduciendo ", isPlaying);
  }, [isPlaying]);

  const handleContinue = () => {
    console.log("Current seccion ", currentSection);
    if (currentSection < readingSections.length - 1) {
      setIsPlaying(true);
      setCurrentSection(currentSection + 1);
    } else {
      completarLeccion()
      if (sound) {
        sound.unloadAsync(); // Limpiar el sonido al desmontar el componente
      }
      //alert("Has completado la lectura.");
      router.push('/dislexia')
    }
  };

  const completarLeccion = async () => {
    let token = null;
    let usuario = await getUsuario();
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
            puntuacion: 10,
          }),
        }
      );
    } catch (error) {
      console.log('Ocurrio un error ', error)
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {isReading ? (
        <View style={styles.fullScreen}>
          {/* Mostrar la imagen solo en la primera sección de lectura */}
          {currentSection === 0 && validImageUri && (
            <Image
              source={{ uri: validImageUri }}
              style={styles.bookImage}
              onError={(error) =>
                console.log("Error loading image:", error.nativeEvent.error)
              }
            />
          )}
          <Text
            style={[
              styles.bookDescription,
              currentSection >= 1 && styles.additionalMargin,
            ]}
          >
            {readingSections[currentSection]?.text || ""}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={isPlaying}
              style={[styles.button, isPlaying && styles.disabledButton]}
              onPress={handleContinue}
            >
              <Text
                style={[
                  styles.buttonText,
                  isPlaying && styles.disabledButtonText,
                ]}
              >
                {currentSection < readingSections.length - 1
                  ? "Continuar"
                  : "Finalizar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <LinearGradient colors={["#2A6F97", "#539ec9"]} style={styles.header}>
            <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
              <Icon name="arrow-back" size={40} color="#FAF3EF" />
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.card}>
            {validImageUri && (
              <>
                <Image
                  source={{ uri: validImageUri }}
                  style={styles.bookImage}
                  onError={(error) =>
                    console.log("Error loading image:", error.nativeEvent.error)
                  }
                />
                <Text style={styles.bookTitle}>{parsedBook}</Text>
                <Text style={styles.bookDescription}>
                  {readingSections[0]?.text || ""}{" "}
                  {/* Mostrar la primera parte como descripción */}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    disabled={isPlaying}
                    style={[styles.button, isPlaying && styles.disabledButton]}
                    onPress={handleReadNow}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isPlaying && styles.disabledButtonText,
                      ]}
                    >
                      Leer Ahora
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3EF",
  },
  fullScreen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  bookImage: {
    width: 250,
    height: 330,
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 16,
    marginTop: -100,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
  header: {
    height: 300,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 16,
    marginTop: 16,
  },
  bookDescription: {
    fontSize: 22,
    textAlign: "left",
    color: "#555",
    marginBottom: 16,
  },
  additionalMargin: {
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#2A6F97",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc", // Cambia el color del botón cuando está deshabilitado
  },
  disabledButtonText: {
    color: "#666", // Cambia el color del texto cuando el botón está deshabilitado
  },
});

export default BookDetails;
