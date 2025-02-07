import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    goBackButton: {
      position: 'absolute',
      bottom: 20,
      left: -22,
      width: 90,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#2A6F97',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    goBackCircle: {
      width: 40,
      height: 40,
      left: 19,
      borderRadius: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: width * 0.9,
      padding: 20,
      borderRadius: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#242424',
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      marginBottom: 15,
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: '#242424',
      fontSize: 16
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginRight: '10%',
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: '#242424',
      textDecorationLine: 'underline',
      fontSize: 16
    },
    button: {
      backgroundColor: '#2A6F97',
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 30,
      marginTop: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
    registerContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    registerText: {
      color: '#242424',
      fontSize: 16
    },
    registerLink: {
      color: '#2A6F97',
      marginLeft: 5,
      textDecorationLine: 'underline',
      fontSize: 16
    },
    nota: {
      fontSize: 10,
      marginBottom: 10,
      color: '#808080'
    }
  });