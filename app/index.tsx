import { StyleSheet, View } from "react-native";
import Splash from "@/components/Splash";
import LeccionConsonantes from "@/components/LeccionConsonantes";

export default function Index() {
  return (
    <View style={style.container}>
      <Splash></Splash>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
})
