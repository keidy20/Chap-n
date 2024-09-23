import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeUsuario = async (usuario: any) => {
  try {
    await AsyncStorage.setItem("usuario", usuario);
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
  }
};

export const getUsuario = async () => {
  try {
    let usuario: any = await AsyncStorage.getItem("usuario");

    console.log("Obteniendo usuario ", usuario);
    return usuario;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
  }
};

export const existUsuario = async (): Promise<boolean> => {
  try {
    let usuario: any = await AsyncStorage.getItem("usuario");

    console.log("Obteniendo usuario ", usuario);
    return usuario != null && usuario != "" ? true : false;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return false;
  }
};

export const removeUsuario = async () => {
  try {
    await AsyncStorage.removeItem("usuario");
    console.log("usuario eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
};
