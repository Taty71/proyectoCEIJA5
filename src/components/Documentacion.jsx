import React, { useRef } from 'react';
import './estilosDocumentacion.css';

const Documentacion = ({ label, name, preview, onFileChange, radioOptions, onRadioChange }) => {
    const fileInputRef = useRef(null);

    return (
        <div className="form-group">
            <label>{label}:</label>

            {radioOptions && (
                <div className="radio-group">
                    {radioOptions.map((option) => (
                        <div key={option.value}>
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                id={`${name}-${option.value}`}
                                onChange={onRadioChange}
                                required
                            />
                            <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
                        </div>
                    ))}
                </div>
            )}
            <div className="upload-preview-container">
            <button type="button" onClick={() => fileInputRef.current.click()} className="small-button">
                Adjuntar {/*{label}*/}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onFileChange}
                accept=".pdf, .jpg, .png"
            />
            {preview && (
                <div className="preview-container">
                    {preview.type === 'application/pdf' ? (
                        <object
                            data={preview.url}
                            type="application/pdf"
                            width="100" height="150"
                            
                        >
                            <p>
                                Vista previa no disponible.{' '}
                                <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                    Abrir PDF
                                </a>
                            </p>
                        </object>
                    ) : (
                        <img
                            src={preview.url}
                            alt="Vista previa"
                            className="  .image-preview "
                        />
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

export default Documentacion;
