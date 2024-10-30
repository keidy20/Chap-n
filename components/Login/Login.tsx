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
import { storeToken, getToken, existToken } from "../../utils/TokenUtils";
import { styles } from "./Styles";
import { getUsuario, storeUsuario } from "@/utils/UsuarioUtils";
import { validarCampos, validarPassword, validarUsuario } from "@/utils/StringUtils";

const Login: React.FC = () => {
  const baseUrl: any = process.env.EXPO_PUBLIC_URL;

  const [usuario, setUsuario] = useState({
    username: '',
    password: ''
  })

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [token, setToken] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    console.log("ingresando al login");


    const callGetToken = async () => {
      if(await existToken()) {
        setToken(await getToken());
        router.navigate("/home");
      } 
      
    };
    callGetToken();

  }, []);

  useEffect(() => {

    if (validarCampos(usuario) && validarPassword(usuario.password) && validarUsuario(usuario.username)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [usuario]);

  const handleLogin = () => {
    console.log("Username:", usuario.username);
    console.log("Password:", usuario.password);
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
        body: JSON.stringify(usuario),
      });

      console.log('Result ', res)

      if (!res.ok) {
        console.log('Error ', res.status)
        if (res.status == 401) {
          Alert.alert(
            'Credenciales Incorrectas',
            'El nombre de usuario o la contraseña son incorrectos. Por favor, inténtelo de nuevo.',
            [{ text: 'OK' }])
        } else {
          Alert.alert(
            'Error en el servidor',
            'Ocurrio un error al intentar comunicarse con el servidor. Intenta mas tarde.',
            [{ text: 'OK' }])
        }
        console.log('Credenciales invalidas', 'El usuario o la contraseña no son correctos')
        throw new Error("Network response was not ok " + res.json());
      }
      const data = await res.json();
      console.log("Respuesta del servidor ", data.token);
      storeToken(data.token);
      storeUsuario(usuario.username)
      console.log('Usuario ', await getUsuario())
      const token = await getToken();
      console.log("Token guardado ", token);

      router.navigate("/");
    

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
              value={usuario.username}
              onChangeText={text => setUsuario({ ...usuario, username: text })}
            />
            
          </View>
          {(!validarUsuario(usuario.username) && usuario.username.length > 0) && (
              <Text style={styles.nota}>El usuario no debe contener caracteres especiales, debe contar con un minimo de 3 caracteres
                y un maximo de 10, no debe de contar con espacios en blanco y no debe iniciar con un número.    
              </Text>
            )}
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
              value={usuario.password}
              onChangeText={text => setUsuario({ ...usuario, password: text })}
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
          {(!validarPassword(usuario.password) && usuario.password.length > 0) && (
              <Text style={styles.nota}>La contraseña debe contar como mínimo con 8 caracteres incluidos caracteres
                especiales, números y letras. La contraseña no debe incluir espacios en blanco.
              </Text>
            )}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={redirectRecoveryPassword}
          >
            <Text style={styles.forgotPasswordText}>
              Has olvidado tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: disabled ? '#ccc' : '#2A6F97' }]} onPress={getLogin} disabled={disabled}>
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
