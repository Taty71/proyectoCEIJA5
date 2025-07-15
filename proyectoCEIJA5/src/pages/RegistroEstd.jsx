import { Form } from 'formik';
import { useState } from 'react';
import ModalidadSelection from '../components/ModalidadSelection';
import FormDocumentacion from '../components/FormDocumentacion';
import { DatosPersonales } from '../components/DatosPersonales';
import { Domicilio } from '../components/Domicilio';
import AlertaMens from '../components/AlertaMens';
import PropTypes from 'prop-types';
import '../estilos/estilosInscripcion.css';
import EstadoInscripcion from '../components/EstadoInscripcion';
import BotonCargando from '../components/BotonCargando';

const RegistroEstd = ({
    previews,
    handleFileChange,
    handleChange,
    alert,
    isSubmitting,
    accion,
    resetForm,
    handleReset,
    values,
    setFieldValue,
    isAdmin
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const showMateriasList = values.planAnio !== '' && values.modalidad !== '';
    // handleChange is passed as a prop, no need to redeclare it here

    return (
        <Form encType="multipart/form-data">
            <div className="formd">
                <DatosPersonales />
                <Domicilio />
                <div className="form-eleccion">
                    <ModalidadSelection
                        modalidad={values.modalidad}
                        modalidadId={values.modalidadId}
                        setFieldValue={setFieldValue}
                        values={values}
                        showMateriasList={showMateriasList}
                        handleChange={handleChange}
                       
                    />
            </div>
            <div className="left-container">
                        <button type="button" className="buttonD" onClick={() => setIsModalOpen(true)}>
                            Adjuntar Documentación
                        </button>
                        {isAdmin && (
                            <EstadoInscripcion
                                value={values.idEstadoInscripcion}
                                handleChange={e => setFieldValue('idEstadoInscripcion', e.target.value)}
                            />
                        )}
            </div>
            <div className="right-container">
                        {isSubmitting ? (
                            <BotonCargando loading={true}>{accion || "Registrando..."}</BotonCargando>
                        ) : (
                            <>
                                <button type="submit" className="buttonF">{accion || "Registrar"}</button>
                                <button
                                    type="button"
                                    className="buttonF"
                                    onClick={() => {
                                        handleReset(); // tu función personalizada
                                        resetForm();   // resetea los campos de Formik
                                    }}
                                >
                                    Limpiar
                                </button>
                            </>
                        )}
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
        </Form>
    );
};

RegistroEstd.propTypes = {
   
    previews: PropTypes.object.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    handleReset: PropTypes.func,
    accion: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export default RegistroEstd;