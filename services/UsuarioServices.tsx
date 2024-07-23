const baseUrl: any = process.env.EXPO_PUBLIC_URL

export const crearUsuario = (usuario: any) => {
    
    const url = `${baseUrl}/usuarios`
    console.log('URL a consumir: ', url)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        },
        body: usuario
    })
    .then(response => console.log(response))
    .catch(err => console.log(err))
    
}