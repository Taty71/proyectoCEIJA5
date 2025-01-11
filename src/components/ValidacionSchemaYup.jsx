
import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
    nombre: yup.string().trim().required("El campo nombre es obligatorio"),
    apellido: yup.string().trim().required("El campo apellido es obligatorio"),
    email: yup
        .string()
        .trim()
        .email("Ingresa un email válido")
        .required("El campo email es obligatorio"),
    password: yup.string().trim().required("El campo contraseña es obligatorio"),
    rol: yup.string().trim().required("El campo rol es obligatorio"),
});
