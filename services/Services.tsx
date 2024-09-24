const baseUrl: any = process.env.EXPO_PUBLIC_URL

export const recoveryPassword = async (email: string) => {
    
    const url = `${baseUrl}/password-reset/request?email=${email}`
    console.log('URL a consumir: ', url)
    try {

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.text()
        console.log('Se recupero la contraseña')
        console.log('Respuesta ', data)
    } catch(e) {
        console.log('Ocurrio un error ', e)
    }
}

export const changePassword = async (token: string, newPassword: string) => {
    const url = `${baseUrl}/password-reset/reset`
    console.log('URL a consumir: ', url)
    try {

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            body: JSON.stringify({token: token, newPassword: newPassword})
        })

        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const data = await res.text()
        console.log('Se recupero la contraseña')
        console.log('Respuesta ', data)
    } catch(e) {
        console.log('Ocurrio un error ', e)
    }
}