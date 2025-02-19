import {Field, ErrorMessage } from 'formik';

export const DatosPersonales = () => {
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
                    <label>DNI:</label>
                    <Field type="number" name="dni" placeholder="DNI" className="form-control" />
                    <ErrorMessage name="dni" component="div" className="error" />
                </div>
                <div className="form-group">
                    <label>CUIL:</label>
                    <Field type="text" name="cuil" placeholder="CUIL" className="form-control" />
                    <ErrorMessage name="cuil" component="div" className="error" />
                </div>
                <div className="form-group">
                    <label>Fecha Nacimiento:</label>
                    <Field type="date" name="fechaNacimiento" className="form-control" />
                    <ErrorMessage name="fechaNacimiento" component="div" className="error" />
                </div>
            </div>                     
    
    </>
    );
                    
}