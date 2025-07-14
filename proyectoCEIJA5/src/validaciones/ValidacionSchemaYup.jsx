
import * as yup from 'yup';

export const formularioInscripcionSchema = yup.object().shape({
    nombre: yup.string().required('Nombre es requerido'),
    apellido: yup.string().required('Apellido es requerido'),
    dni: yup.string().required('DNI es requerido, sin espacios y puntos'),
    cuil: yup
        .string()
        .required('CUIL es requerido')
        .matches(/^\d{2}-\d{7,8}-\d$/, 'CUIL debe tener el formato 00-12345678-0'),
   fechaNacimiento: yup
        .date()
        .required('Fecha de nacimiento es requerida')
        .typeError('Fecha inválida'),
    calle: yup.string().required('Calle es requerida'),
            numero: yup
            .number()
            .typeError('Número es requerido')
            .required('Número es requerido'),
    barrio: yup.string().required('Barrio es requerido'),
    localidad: yup.string().required('Localidad es requerida'),
    pcia: yup.string().required('Provincia es requerida'),
     modalidad: yup.string().required('Modalidad es requerida'),
     planAnio: yup
        .number()
        .typeError('Plan/Año es requerido')
        .required('Plan/Año es requerido'),
    modulos: yup
        .number()
        .typeError('Módulo es requerido')
        .required('Módulo es requerido'),
    idEstadoInscripcion: yup
        .number()
        .typeError('Estado de inscripción es requerido')
        .required('Estado de inscripción es requerido'),
});
export const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email("Ingresa un email válido")
        .required("El campo email es obligatorio"),
    password: yup
        .string()
        .trim()
        .required("El campo contraseña es obligatorio"),
});
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
