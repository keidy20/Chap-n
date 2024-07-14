import Bienvenida from "@/components/Bienvenida";
import Opciones from "@/components/Opciones";
import Login from "@/components/Login";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={style.container}>
      <Login></Login>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
})
