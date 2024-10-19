import { router } from "expo-router";
import { existToken, getToken, removeToken } from "@/utils/TokenUtils";
import { useEffect } from "react";
import { getUsuario } from "@/utils/UsuarioUtils";
import GrabarAudio from "@/components/GrabarAudio";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function Index() {
  useEffect(() => {
    redirect();
  });

  const redirect = async () => {
    console.log("Ingresando al index ", await existToken());
    if (await existToken()) {
      let respuesta = await validarEvaluacionInicial();
      console.log("Respuesta jeje", respuesta);
      if (respuesta === "completada") {
        console.log("Entro aqui XD");
        router.navigate("/home");
      } else {
        router.navigate("/grabarAudio");
      }
    } else {
      router.navigate("/bienvenida");
    }
  };

  const validarEvaluacionInicial = async () => {
    try {
      let token = await getToken();
      let usuario = await getUsuario();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_URL}/usuarios_lecciones/leccion-inicial-finalizada/${usuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Respuesta evaluacion inicial d ", data);
      return data.message;
    } catch (error) {
      console.log(
        "Ocurrio un error al validar si ya completo la evaluacion inicial"
      );
    }
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
