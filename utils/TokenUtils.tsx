
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: any) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  };

export const getToken = async () => {
    try {
      let token: any = await AsyncStorage.getItem('userToken');

      console.log('Obteniendo token ', token)
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  };

export const existToken = async ():Promise<boolean> => {
    try {
        let token: any = await AsyncStorage.getItem('userToken');
  
        console.log('Obteniendo token ', token)
        return (token != null && token != '') ? true : false;
      } catch (error) {
        console.error('Error al obtener el token:', error);
        return false;
      }
}

export const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Token eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el token:', error);
    }
  };