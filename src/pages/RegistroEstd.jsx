import { Formik, Form } from 'formik';
import { useState, useRef } from 'react';
import { formularioInscripcionSchema } from '../validaciones/ValidacionSchemaYup';
import ModalidadSelection from '../components/ModalidadSelection';
import FormDocumentacion from '../components/FormDocumentacion';
import { DatosPersonales } from '../components/DatosPersonales';
import { Domicilio } from '../components/Domicilio';
import AlertaMens from '../components/AlertaMens';
import PropTypes from 'prop-types';
import '../estilos/estilosInscripcion.css'; // Importa el archivo CSS

const RegistroEstd = ({ modalidad, previews, handleFileChange, alert, accion, handleSubmit, handleReset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formikRef = useRef(null);
   
    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };
 

    return (
        <Formik
            initialValues={{  nombre: '',
                apellido: '',
                dni: '',
                cuil: '',
                fechaNacimiento: '',
                calle: '',
                nro: '',
                barrio: '',
                localidad: '',
                pcia: '',
                modalidad,
                planAnio: '',
                titulo: '', }}
            validationSchema={formularioInscripcionSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
            
        >
            {({ values, handleChange, setFieldValue, resetForm }) => {
                 const showMateriasList = values.planAnio !== '' && values.modalidad !== ''
               return(
               <Form  encType="multipart/form-data">
                    <div className="formd">
                        <DatosPersonales />
                        <Domicilio />
                        <div className="form-eleccion">
                            <ModalidadSelection modalidad={modalidad} handleChange={handleChange} setFieldValue={setFieldValue} values={values} showMateriasList={showMateriasList} />
                            <button type="button" className="buttonD" onClick={() => setIsModalOpen(true)}>
                                Adjuntar Documentación
                            </button>
                        </div>
                        {isModalOpen && (
                            <FormDocumentacion
                                onClose={closeModal}
                                previews={previews}
                                handleFileChange={(e, field) => handleFileChange(e, field, setFieldValue)}
                                setFieldValue={setFieldValue}
                            />
                        )}
                    </div>
                    {alert.text && <AlertaMens text={alert.text} variant={alert.variant} />}
                    <button type="submit" className="buttonF">{accion}</button>
                    <button type="button" className="buttonF" onClick={() => { handleReset(); resetForm(); }}>Reset</button>
                </Form>
            )}}
        </Formik>
    );
}    


RegistroEstd.propTypes = {
    modalidad: PropTypes.string.isRequired,
    previews: PropTypes.object.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    accion: PropTypes.string,
};

export default RegistroEstd;