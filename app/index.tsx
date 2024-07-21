import { StyleSheet, View } from "react-native";
import Splash from "@/components/Splash";

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
