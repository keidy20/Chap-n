import { StyleSheet, View } from "react-native";
import Splash from "@/components/Splash";
import LeccionConsonantes from "@/components/LeccionConsonantes";
import Bienvenida from "@/components/Bienvenida";

export default function Index() {
  return (
    <View style={style.container}>
      <Bienvenida></Bienvenida>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
})
