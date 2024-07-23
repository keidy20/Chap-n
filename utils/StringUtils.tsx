export const validarCampos = (objeto: object) => {

    const values = Object.values(objeto)

    return values.every(value => value !== null && value !== undefined && value !== '')

  }