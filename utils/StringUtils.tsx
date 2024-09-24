export const validarCampos = (objeto: object) => {
  const values = Object.values(objeto);

  return values.every(
    (value) => value !== null && value !== undefined && value !== ""
  );
};

export const validarPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};
