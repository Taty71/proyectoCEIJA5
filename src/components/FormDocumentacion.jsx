import Documentacion from './Documentacion';
import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import '../estilos/estilosFormDocumentacion.css';

const FormDocumentacion = ({ previews, handleFileChange, setFieldValue, onClose }) => {
    const handleRadioChange = (e) => {
        console.log("Opción de título seleccionada:", e.target.value);
        setFieldValue('titulo', e.target.value);
       
    };

    return (
        <>
            <div className="form-documentacion">
            <button className="modal-close" onClick={onClose}>✖</button>
                <div className="form-h3">
                    <h3>
                        Documentación a presentar <br />
                        <span>Recuerda que debes presentarla al momento de la inscripción presencial</span>
                    </h3>
                </div>
                <div className="form-doc">
                    <Documentacion
                        label="Foto"
                        name="fotoFile"
                        preview={previews.foto}
                        onFileChange={(e) => handleFileChange(e, 'foto')}
                    />
                    <Documentacion
                        label="DNI"
                        name="dniFile"
                        preview={previews.dni}
                        onFileChange={(e) => handleFileChange(e, 'dni')}
                    />
                    <Documentacion
                        label="CUIL"
                        name="cuilFile"
                        preview={previews.cuil}
                        onFileChange={(e) => handleFileChange(e, 'cuil')}
                    />
                    <Documentacion
                        label="Partida de Nacimiento"
                        name="partidaNacimiento"
                        preview={previews.partidaNacimiento}
                        onFileChange={(e) => handleFileChange(e, 'partidaNacimiento')}
                    />
                    <Documentacion
                        label="Ficha Médica"
                        name="fichaMedica"
                        preview={previews.fichaMedica}
                        onFileChange={(e) => handleFileChange(e, 'fichaMedica')}
                    />
                    <div className="titulo">
                        <Documentacion
                            label="Archivo de Título"
                            name="tituloFile"
                            preview={previews.archivoTitulo}
                            onFileChange={(e) => handleFileChange(e, 'archivoTitulo')}
                            radioOptions={[
                                { value: 'NivelPrimario', label: 'Nivel Primario' },
                                { value: 'AnaliticoProvisorio', label: 'Analítico Provisorio (Pase)' },
                                { value: 'SolicitudPase', label: 'Solicitud de Pase' },
                            ]}
                            onRadioChange={handleRadioChange}
                        />
                        <ErrorMessage name="titulo" component="div" className="error" />
                    </div>
                </div>
            </div>
        </>
    );
};
// Definir los propTypes
FormDocumentacion.propTypes = {
    previews: PropTypes.shape({
        foto: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        dni: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        cuil: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        partidaNacimiento: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        fichaMedica: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        archivoTitulo: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
    }).isRequired,
    
    handleFileChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default FormDocumentacion;

