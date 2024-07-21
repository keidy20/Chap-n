import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './Styles';
import CryptoJS from 'crypto-js';
import { Link, router } from 'expo-router';

const Login = () => {

  //const secretKey: any = process.env.EXPO_PUBLIC_SECRET_KEY
  const secretKey: string = 'test'

  const [ nombre, setNombre ] = useState('')
  const [ edad, setEdad ] = useState('')
  const [ correo, setCorreo ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ usuario, setUsuario ] = useState({
    nombre: '',
    edad: '',
    correo: '',
    password: ''
  })

  const encrypt = (txt: string) => {
    return CryptoJS.AES.encrypt(txt, secretKey).toString()
  }

  const crearCuenta = () => {
    
    setUsuario({...usuario, password: encrypt(usuario.password)})
    console.log('Usuario ', usuario)
  }

  const gotToLecciones = () => {
    router.navigate('/lecciones')
  }
  return (
    <LinearGradient
      colors={['#56BBE1', '#285769']}
      style={styles.container}
    >
      <Icon name="user" size={100} color="#fff" style={styles.icon} />
      <Text style={styles.title}>EDÚCATE CHAPÍN</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={usuario.nombre}
        onChangeText={text => setUsuario({...usuario, nombre: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        placeholderTextColor="#aaa"
        value={usuario.edad}
        onChangeText={text => setUsuario({...usuario, edad: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={usuario.correo}
        onChangeText={text => setUsuario({...usuario, correo: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={usuario.password}
        onChangeText={text => setUsuario({...usuario, password: text})}
      />
      <TouchableOpacity style={styles.button} onPress={crearCuenta}>
        <LinearGradient
          colors={['#ff6600', '#F49726']}
          style={styles.gradient}
          
        >
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={gotToLecciones}>
        <LinearGradient
          colors={['#ff6600', '#F49726']}
          style={styles.gradient}
          
        >
          <Text style={styles.buttonText}>Ir a lecciones</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View>
        <Link href="/lecciones">Lecciones</Link>
      </View>
    </LinearGradient>
  );
};


export default Login;


