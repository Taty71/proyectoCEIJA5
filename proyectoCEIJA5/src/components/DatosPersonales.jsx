import {Field, ErrorMessage, useFormikContext } from 'formik';
import { useEffect, memo } from 'react';

export const DatosPersonales = memo(() => {
    const { values, setFieldValue } = useFormikContext();

    // Función para calcular el dígito verificador del CUIL
    const calcularDigitoVerificador = (prefijo, dni) => {
        const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        const cuilSinDigito = prefijo + dni;
        
        let suma = 0;
        for (let i = 0; i < 10; i++) {
            suma += parseInt(cuilSinDigito[i]) * multiplicadores[i];
        }
        
        const resto = suma % 11;
        if (resto < 2) {
            return resto;
        } else {
            return 11 - resto;
        }
    };

    // Función para auto-completar CUIL basado en DNI (solo para documentos argentinos)
    useEffect(() => {
        if (values.tipoDocumento === 'DNI' && values.dni && values.dni.toString().length === 8) {
            const dni = values.dni.toString();
            
            // Si el CUIL está vacío o solo tiene formato parcial, lo completamos
            if (!values.cuil || values.cuil.length < 11) {
                const prefijo = "20";
                const digitoVerificador = calcularDigitoVerificador(prefijo, dni);
                const cuilCompleto = `${prefijo}-${dni}-${digitoVerificador}`;
                
                setFieldValue('cuil', cuilCompleto);
            }
        } else if (values.tipoDocumento !== 'DNI') {
            // Si no es DNI argentino, limpiar el CUIL
            if (values.cuil) {
                setFieldValue('cuil', '');
            }
        }
    }, [values.dni, values.tipoDocumento, setFieldValue, values.cuil]);

    return (
    <>
            <div className="form-datos">
                <h3>Datos Personales</h3>
                <div className="form-group">
                     <label>Nombre:</label>
                     <Field type="text" name="nombre" placeholder="Nombre" className="form-control" />
                     <ErrorMessage name="nombre" component="div" className="error" />
                </div>
                <div className="form-group">
                    <label>Apellido:</label>
                    <Field type="text" name="apellido" placeholder="Apellido" className="form-control" />
                    <ErrorMessage name="apellido" component="div" className="error" />
                </div>
                
                <div className="form-group">
                    <label>Tipo de Documento:</label>
                    <Field as="select" name="tipoDocumento" className="form-control">
                        <option value="">Seleccione tipo de documento</option>
                        <option value="DNI">DNI Argentino</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="CEDULA">Cédula de Identidad</option>
                        <option value="OTRO">Otro Documento</option>
                    </Field>
                    <ErrorMessage name="tipoDocumento" component="div" className="error" />
                </div>

                <div className="form-group">
                    <label>
                        {values.tipoDocumento === 'DNI' ? 'DNI:' : 
                         values.tipoDocumento === 'PASAPORTE' ? 'Número de Pasaporte:' :
                         values.tipoDocumento === 'CEDULA' ? 'Número de Cédula:' :
                         'Número de Documento:'}
                    </label>
                    <Field 
                        type="text" 
                        name="dni" 
                        placeholder={
                            values.tipoDocumento === 'DNI' ? 'DNI (8 dígitos)' : 
                            values.tipoDocumento === 'PASAPORTE' ? 'Número de pasaporte' :
                            values.tipoDocumento === 'CEDULA' ? 'Número de cédula' :
                            'Número de documento'
                        }
                        className="form-control" 
                        maxLength={values.tipoDocumento === 'DNI' ? "8" : "20"}
                    />
                    <ErrorMessage name="dni" component="div" className="error" />
                </div>

                {values.tipoDocumento !== 'DNI' && values.tipoDocumento && (
                    <div className="form-group">
                        <label>País de Emisión:</label>
                        <Field type="text" name="paisEmision" placeholder="País que emitió el documento" className="form-control" />
                        <ErrorMessage name="paisEmision" component="div" className="error" />
                    </div>
                )}

                {values.tipoDocumento === 'DNI' && (
                    <div className="form-group">
                        <label>CUIL:</label>
                        <Field type="text" name="cuil" placeholder="CUIL" className="form-control" />
                        <ErrorMessage name="cuil" component="div" className="error" />
                        <small className="form-text text-muted">
                            Se completa automáticamente con el DNI. Prefijo: 20 (masculino), 27 (femenino), 23 (empresa)
                        </small>
                    </div>
                )}

                <div className="form-group">
                    <label>Fecha Nacimiento:</label>
                    <Field type="date" name="fechaNacimiento" className="form-control" />
                    <ErrorMessage name="fechaNacimiento" component="div" className="error" />
                    {/*<small>Debug: <Field name="fechaNacimiento">{({ field }) => field.value}</Field></small>*/}
                </div>
            </div>                     
    
    </>
    );
});

// Agregar displayName para React DevTools
DatosPersonales.displayName = 'DatosPersonales';