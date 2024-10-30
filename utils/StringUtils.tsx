export const validarCampos = (objeto: object) => {
  const values = Object.values(objeto);

  return values.every(
    (value) => value !== null && value !== undefined && value !== ""
  );
};

export const validarPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*[\W_])\S{8,16}$/;
  return regex.test(password);
};

export const validarUsuario = (usuario: string): boolean => {
  const regex = /^[a-zA-Z][a-zA-Z0-9]{2,9}$/;
  return regex.test(usuario);
};

export const validarNombre = (nombre: string): boolean => {
  const regex = /^[a-zA-Z\s]{1,30}$/;
  return regex.test(nombre);
};