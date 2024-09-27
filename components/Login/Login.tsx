import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { storeToken, getToken } from "../../utils/TokenUtils";
import { styles } from "./Styles";
import { storeUsuario } from "@/utils/UsuarioUtils";

const Login: React.FC = () => {
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    console.log("ingresando al login");

    const callGetToken = async () => {
      setToken(await getToken());
    };
    callGetToken();

    if (token != null && token != "") {
      router.navigate("/home");
    }
  }, []);

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
  };

  const goBack = () => {
    router.back();
  };

  const getLogin = async () => {
    const url = `${baseUrl}/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        console.log('Error ', res.status)
        console.log('Credenciales invalidas', 'El usuario o la contraseña no son correctos')
        throw new Error("Network response was not ok " + res.json());
      }
      const data = await res.json();
      console.log("Respuesta del servidor ", data.token);
      storeToken(data.token);
      storeUsuario(username)
      const token = await getToken();
      console.log("Token guardado ", token);

      // Verificar si ha completado la lección de tipo EI
      const leccionUrl = `${baseUrl}/usuarios_lecciones/leccion-inicial-finalizada/${username}`;
          
      const leccionRes = await fetch(leccionUrl, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!leccionRes.ok) {
        console.log("Error al verificar si completó la lección");
        throw new Error("Error checking exercise completion");
      }

      const leccionData = await leccionRes.json();

      // Si el ejercicio está completado, redirigir a home
      if (leccionData.completado) {
        router.navigate("/home");
      } else {
        // Si no ha completado la lección, redirigir a GrabarAudio
        router.navigate("/grabarAudio");
      }

      } catch (error) {
      console.log("Error ", error);
      }
  };

  const redirectRecoveryPassword = () => {
    router.navigate("/recuperarPassword");
  };

  const redirectCreateAccount = () => {
    router.navigate("/crear_cuenta");
  };

  return (
    <LinearGradient colors={["#2A6F97", "#FFFFFF"]} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <View style={styles.goBackCircle}>
            <Ionicons name="arrow-back" size={24} color="#2A6F97" />
          </View>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2A6F97" />
          </View>
          <Text style={styles.title}>BIENVENIDO!</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={30}
              color="#242424"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#242424"
              keyboardType="email-address"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color="#242424"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#242424"
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <Ionicons
                name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                size={30}
                color="#242424"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={redirectRecoveryPassword}
          >
            <Text style={styles.forgotPasswordText}>
              Has olvidado tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={getLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>No tienes una cuenta?</Text>
            <TouchableOpacity onPress={redirectCreateAccount}>
              <Text style={styles.registerLink}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
