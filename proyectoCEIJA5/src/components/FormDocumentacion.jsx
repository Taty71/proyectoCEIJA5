import { useMemo } from 'react';
import PropTypes from 'prop-types';
import '../estilos/estilosFormDocumentacion.css';
import '../estilos/estilosCheckboxDoc.css';
import CloseButton from '../components/CloseButton'; // Importa el componente CloseButton

const FormDocumentacion = ({ previews, handleFileChange, onClose }) => {
    const faltaDocumento = useMemo(() => {
        return !["SolicitudPase", "AnaliticoParcial", "CertfNivelPrimario"].some(
            (doc) => previews?.[doc]?.url
        );
    }, [previews]);

    return (
        <>
            <div className="form-documentacion">
                {/* Botón "Cerrar" arriba a la derecha */}
                <CloseButton onClose={onClose} />
                <div className="form-h3">
                    <h3>
                        Documentación a presentar <br />
                        <span>Recuerda que debes presentarla al momento de la inscripción presencial</span>
                    </h3>
                </div>
                {faltaDocumento && (
                    <div style={{ color: '#4e53e6', marginBottom: 10 }}>
                        Recordar Documento faltante: Solicitud de Pase, Analítico Parcial/Pase ó Certificado Nivel Primario.
                    </div>
                )}
                <div className="form-doc-table">
                    <div className="doc-table-header">
                        <span>Entregado</span>
                        <span>Documento</span>
                        <span>Adjuntar Archivo</span>
                        <span>Vista Previa</span>
                    </div>
                    {[
                        { label: "Foto", name: "foto" },
                        { label: "DNI", name: "dni" },
                        { label: "CUIL", name: "cuil" },
                        { label: "Partida de Nacimiento", name: "partidaNacimiento" },
                        { label: "Ficha Médica", name: "fichaMedica" },
                        { label: "Solicitud Pase", name: "SolicitudPase" },
                        { label: "Analítico Parcial/Pase", name: "AnaliticoParcial" },
                        { label: "Certificado Nivel Primario", name: "CertfNivelPrimario" },
                    ].map(({ label, name }) => (
                        <div className="doc-table-row" key={name}>
                            {/* Checkbox entregado/faltante */}
                            <input
                                type="checkbox"
                                checked={!!previews[name]?.url}
                                readOnly
                                disabled
                                className={previews[name]?.url ? 'archivo-adjunto' : ''}
                                title={previews[name]?.url ? "Entregado" : "Faltante"}
                            />

                            {/* Nombre del documento */}
                            <span>{label}</span>
                            {/* Adjuntar archivo */}
                            <div className="input-container-doc">
                                <input
                                    type="file"
                                    name={name} // <-- agrega esto
                                    className="small-select"
                                    onChange={e => handleFileChange(e, name)}
                                    accept="image/*,application/pdf"
                                />
                            </div>
                            {/* Vista previa */}
                            <div className="preview-container">
                                {previews[name]?.url ? (
                                    <>
                                        {previews[name].type?.startsWith('image/') ? (
                                            <img src={previews[name].url} alt={`Vista previa de ${label}`} className="image-preview" />
                                        ) : previews[name].type === 'application/pdf' ? (
                                            <embed src={previews[name].url} type="application/pdf" className="pdf-preview" />
                                        ) : (
                                            <span className="archivo-desconocido">Archivo cargado</span>
                                        )}
                                        <a
                                            href={previews[name].url}
                                            download={label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-descargar"
                                        >
                                            Descargar
                                        </a>
                                    </>
                                ) : (
                                    <span className="sin-archivo">Sin archivo</span>
                                )}
                            </div>

                        </div>
                    ))}
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
        SolicitudPase: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        AnaliticoParcial: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
        CertfNivelPrimario: PropTypes.shape({
            url: PropTypes.string,
            type: PropTypes.string,
        }),
    }),

    handleFileChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FormDocumentacion;

