import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './Styles';
import CryptoJS from 'crypto-js';
import { Link, router } from 'expo-router';
import { validarCampos } from '@/utils/StringUtils';
import { crearUsuario } from '@/services/UsuarioServices';

const CrearCuenta = () => {

  const secretKey: any = process.env.EXPO_PUBLIC_SECRET_KEY
  const baseUrl: any = process.env.EXPO_PUBLIC_URL

  const [ disabled, setDisabled ] = useState(true)

  const [ usuario, setUsuario ] = useState({
    nombre: '',
    edad: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    
    if (validarCampos(usuario)) {
      console.log('usuario lleno')
      setDisabled(false)
    } else {
      setDisabled(true)
    }

    if (!validarPassword(usuario.password)) {
      console.log('La contraseña debe tener como minimo 8 caracteres, una letra mayuscula y un caracter especial')
      setDisabled(true)
    }
  }, [usuario])

  const validarPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    console.log('Contraseña correcta ', regex.test(password))
    return regex.test(password)
  }


  const encrypt = (txt: string) => {
    return CryptoJS.AES.encrypt(txt, secretKey).toString()
  }

  const crearCuenta = async () => {
    
    let usuarioTemp: any = {...usuario, password: encrypt(usuario.password)}
    console.log('Usuario ', usuario)
    console.log('Usuario temp', {...usuario, password: encrypt(usuario.password)})
    console.log('URL ', baseUrl)

    const url = `${baseUrl}/usuarios`
    console.log('URL a consumir: ', url)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        },
        body: JSON.stringify(usuarioTemp)
      })

      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
    } catch(error) {
      console.log('Error ', error)
    }
    
    
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
        keyboardType='numeric'
        maxLength={2}
        onChangeText={text => setUsuario({...usuario, edad: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#aaa"
        value={usuario.email}
        onChangeText={text => setUsuario({...usuario, email: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={usuario.password}
        onChangeText={text => setUsuario({...usuario, password: text})}
      />
      <TouchableOpacity style={styles.button} onPress={crearCuenta} disabled={disabled}>
        <LinearGradient
          colors={disabled ? ['#808080', '#FFF'] : ['#F59200', '#A07535']}
          style={styles.gradient}
          
        >
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.button} onPress={gotToLecciones}>
        <LinearGradient
          colors={['#ff6600', '#F49726']}
          style={styles.gradient}
          
        >
          <Text style={styles.buttonText}>Ir a lecciones</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View>
        <Link href="/lecciones">Lecciones</Link>
      </View> */}
    </LinearGradient>
  );
};


export default CrearCuenta;


