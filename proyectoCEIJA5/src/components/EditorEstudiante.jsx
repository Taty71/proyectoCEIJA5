import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VolverButton from './VolverButton';
import CloseButton from './CloseButton';
import AlertaMens from './AlertaMens';
import '../estilos/editorEstudiante.css';
import '../estilos/estilosInscripcion.css'; // Para los estilos de modal-header-buttons

const EditorEstudiante = ({ estudiante, onClose, onVolver }) => {
    const [editMode, setEditMode] = useState({});
    const [formData, setFormData] = useState({});
    const [archivos, setArchivos] = useState({});
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');

    useEffect(() => {
        if (estudiante) {
            setFormData({
                nombre: estudiante.nombre || '',
                apellido: estudiante.apellido || '',
                dni: estudiante.dni || '',
                cuil: estudiante.cuil || '',
                fechaNacimiento: estudiante.fechaNacimiento ? estudiante.fechaNacimiento.split('T')[0] : '',
                tipoDocumento: estudiante.tipoDocumento || 'DNI',
                paisEmision: estudiante.paisEmision || 'Argentina',
                calle: estudiante.calle || '',
                numero: estudiante.numero || '',
                barrio: estudiante.barrio || '',
                localidad: estudiante.localidad || '',
                provincia: estudiante.pcia || '',
                modalidad: estudiante.modalidad || '',
                planAnio: estudiante.planAnio || '',
                modulo: estudiante.modulo || '',
                estadoInscripcion: estudiante.estadoInscripcion || '',
                fechaInscripcion: estudiante.fechaInscripcion ? estudiante.fechaInscripcion.split('T')[0] : ''
            });
        }
    }, [estudiante]);

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        try {
            return new Date(fecha).toLocaleDateString('es-AR');
        } catch {
            return 'Fecha inválida';
        }
    };

    // Función para generar CUIL automáticamente a partir del DNI
    const generarCuil = (dni) => {
        if (!dni || dni.length !== 8) return '';

        // Array de prefijos posibles (20 y 23 para masculino, 27 para femenino, 23 y 24 como alternativas)
        const prefijos = ['20', '23', '27', '24'];

        for (const prefijo of prefijos) {
            const numeroBase = prefijo + dni + '0'; // Agregamos dígito verificador temporal
            let suma = 0;
            const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

            // Calculamos la suma ponderada
            for (let i = 0; i < 10; i++) {
                suma += parseInt(numeroBase[i]) * multiplicadores[i];
            }

            const resto = suma % 11;
            let digitoVerificador;

            if (resto === 0) {
                digitoVerificador = 0;
            } else if (resto === 1) {
                // Si el resto es 1, probamos con otro prefijo
                continue;
            } else {
                digitoVerificador = 11 - resto;
            }

            return prefijo + dni + digitoVerificador;
        }

        // Si ningún prefijo funciona, devolvemos con prefijo 20 y dígito 0
        return '20' + dni + '0';
    };

    const toggleEditMode = (campo) => {
        setEditMode(prev => ({
            ...prev,
            [campo]: !prev[campo]
        }));
    };

    const handleInputChange = (campo, valor) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [campo]: valor
            };

            // Si se está cambiando el DNI, generar automáticamente el CUIL
            if (campo === 'dni' && valor.length === 8) {
                newData.cuil = generarCuil(valor);
            }

            return newData;
        });
    };

    const handleFileChange = (campo, file) => {
        setArchivos(prev => ({
            ...prev,
            [campo]: file
        }));
    };

    const handleGuardarCambios = async () => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();

            // Agregar datos del formulario básicos
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('apellido', formData.apellido);
            formDataToSend.append('dni', formData.dni);
            formDataToSend.append('cuil', formData.cuil);
            formDataToSend.append('fechaNacimiento', formData.fechaNacimiento);
            formDataToSend.append('tipoDocumento', formData.tipoDocumento);
            formDataToSend.append('paisEmision', formData.paisEmision);
            formDataToSend.append('calle', formData.calle);
            formDataToSend.append('numero', formData.numero);
            formDataToSend.append('barrio', formData.barrio);
            formDataToSend.append('localidad', formData.localidad);
            formDataToSend.append('provincia', formData.provincia);

            // Agregar campos académicos
            formDataToSend.append('modalidad', formData.modalidad);
            formDataToSend.append('planAnio', formData.planAnio);
            formDataToSend.append('modulo', formData.modulo);
            formDataToSend.append('estadoInscripcion', formData.estadoInscripcion);
            formDataToSend.append('fechaInscripcion', formData.fechaInscripcion);

            // Agregar IDs necesarios (estos vendrían de selects en un caso real)
            formDataToSend.append('modalidadId', '1'); // Temporal
            formDataToSend.append('planAnioId', '1'); // Temporal
            formDataToSend.append('modulosId', '1'); // Temporal
            formDataToSend.append('estadoInscripcionId', '1'); // Temporal

            // Agregar archivos
            Object.keys(archivos).forEach(key => {
                if (archivos[key]) {
                    formDataToSend.append(key, archivos[key]);
                }
            });

            // Agregar detalle de documentación - preservar archivos existentes
            const detalleDocumentacion = estudiante.documentacion?.map(doc => ({
                idDocumentaciones: doc.idDocumentaciones || 1,
                estadoDocumentacion: doc.estadoDocumentacion || 'entregado',
                fechaEntrega: doc.fechaEntrega || new Date().toISOString().split('T')[0],
                nombreArchivo: doc.nombreArchivo || doc.descripcionDocumentacion,
                // Solo incluir nuevos archivos, preservar existentes
                archivoExistente: doc.archivoDocumentacion // Mantener referencia al archivo existente
            })) || [];

            formDataToSend.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));

            // Debug: Mostrar estado completo del formData antes de enviar
            console.log('Estado actual del formData:', formData);
            console.log('FormData a enviar:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }
            console.log('DNI original para URL:', estudiante.dni);
            console.log('DNI nuevo a guardar:', formData.dni);

            const response = await fetch(`http://localhost:5000/api/modificar-estudiante/${estudiante.dni}`, {
                method: 'PUT',
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                setAlertMessage('Estudiante modificado exitosamente');
                setAlertVariant('success');
                setShowAlert(true);

                // Ocultar el alert después de 3 segundos y cerrar el editor
                setTimeout(() => {
                    setShowAlert(false);
                    onClose();
                }, 3000);
            } else {
                setAlertMessage('Error al modificar: ' + result.message);
                setAlertVariant('error');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Error al modificar estudiante');
            setAlertVariant('error');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 4000);
        } finally {
            setLoading(false);
        }
    };

    const renderCampoEditable = (label, campo, valor, tipo = 'text') => {
        const isEditing = editMode[campo];

        return (
            <div className="campo-editable">
                <div className="campo-contenido">
                    <label>{label}:</label>
                    {isEditing ? (
                        <input
                            type={tipo}
                            value={formData[campo] || ''}
                            onChange={(e) => handleInputChange(campo, e.target.value)}
                            className="input-edicion"
                        />
                    ) : (
                        <span>{formData[campo] || 'No disponible'}</span>
                    )}
                </div>
                <button
                    className="btn-editar"
                    onClick={() => toggleEditMode(campo)}
                    title={isEditing ? 'Guardar' : 'Editar'}
                >
                    {isEditing ? '✓' : '✏️'}
                </button>
            </div>
        );
    };

    const renderDocumentacion = () => {
        // Lista completa de documentos requeridos
        const documentosRequeridos = [
            { nombre: 'foto', descripcion: 'Foto' },
            { nombre: 'archivo_dni', descripcion: 'DNI' },
            { nombre: 'archivo_cuil', descripcion: 'CUIL' },
            { nombre: 'archivo_partidaNacimiento', descripcion: 'Partida de Nacimiento' },
            { nombre: 'archivo_fichaMedica', descripcion: 'Ficha Médica' },
            { nombre: 'archivo_certificadoNivelPrimario', descripcion: 'Certificado Nivel Primario' },
            { nombre: 'archivo_analiticoParcial', descripcion: 'Analítico Parcial' },
            { nombre: 'archivo_solicitudPase', descripcion: 'Solicitud de Pase' }
        ];

        // Obtener documentos existentes
        const documentosExistentes = estudiante.documentacion || [];
        
        // Debug: Verificar qué documentos vienen de la BD
        console.log('🔍 Debug - Documentos existentes desde BD:', documentosExistentes);
        console.log('🔍 Debug - Estructura estudiante completa:', estudiante);
        
        // Crear mapa de documentos existentes por descripción
        const mapDocumentosExistentes = {};
        documentosExistentes.forEach(doc => {
            console.log('🔍 Debug - Procesando documento:', doc.descripcionDocumentacion);
            mapDocumentosExistentes[doc.descripcionDocumentacion?.toLowerCase()] = doc;
        });

        return (
            <div className="documentacion-editable">
                {documentosRequeridos.map((docRequerido, index) => {
                    // Buscar si este documento ya existe con múltiples variantes de nombre
                    const docExistente = documentosExistentes.find(doc => {
                        const descripcion = doc.descripcionDocumentacion?.toLowerCase();
                        console.log(`🔍 Debug - Comparando "${descripcion}" con "${docRequerido.descripcion.toLowerCase()}"`);
                        
                        // Múltiples variantes de coincidencia
                        return (
                            descripcion === docRequerido.descripcion.toLowerCase() ||
                            descripcion === docRequerido.nombre.replace('archivo_', '').toLowerCase() ||
                            descripcion === docRequerido.nombre.toLowerCase() ||
                            // Coincidencias específicas para nombres comunes
                            (docRequerido.nombre === 'foto' && descripcion === 'foto') ||
                            (docRequerido.nombre === 'archivo_dni' && (descripcion === 'dni' || descripcion === 'archivo_dni')) ||
                            (docRequerido.nombre === 'archivo_cuil' && (descripcion === 'cuil' || descripcion === 'archivo_cuil')) ||
                            (docRequerido.nombre === 'archivo_partidaNacimiento' && (descripcion === 'partidanacimiento' || descripcion === 'partida nacimiento' || descripcion === 'partida_nacimiento')) ||
                            (docRequerido.nombre === 'archivo_fichaMedica' && (descripcion === 'fichamedica' || descripcion === 'ficha medica' || descripcion === 'ficha_medica')) ||
                            (docRequerido.nombre === 'archivo_certificadoNivelPrimario' && (descripcion === 'certificadonivelprimario' || descripcion === 'certificado nivel primario')) ||
                            (docRequerido.nombre === 'archivo_analiticoParcial' && (descripcion === 'analiticoparcial' || descripcion === 'analitico parcial' || descripcion === 'analitico_parcial')) ||
                            (docRequerido.nombre === 'archivo_solicitudPase' && (descripcion === 'solicitudpase' || descripcion === 'solicitud pase' || descripcion === 'solicitud_pase'))
                        );
                    });

                    console.log(`🔍 Debug - Documento "${docRequerido.descripcion}": ${docExistente ? 'ENCONTRADO' : 'FALTANTE'}`);
                    if (docExistente) {
                        console.log(`🔍 Debug - Archivo: ${docExistente.archivoDocumentacion}`);
                    }

                    if (docExistente) {
                        // Mostrar documento existente con opciones de ver y reemplazar
                        return (
                            <div key={index} className="documento-editable existente">
                                <div className="documento-info">
                                    <span
                                        className="documento-icono"
                                        data-estado={docExistente.estadoDocumentacion?.toLowerCase()}
                                    >
                                        ✓
                                    </span>
                                    <span className="documento-nombre">{docRequerido.descripcion}</span>
                                </div>

                                <div className="documento-acciones">
                                    {docExistente.archivoDocumentacion && (
                                        <a
                                            href={`http://localhost:5000${docExistente.archivoDocumentacion}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ver-archivo"
                                            title="Ver archivo actual"
                                        >
                                            👁️
                                        </a>
                                    )}

                                    <div className="subir-archivo">
                                        <input
                                            type="file"
                                            id={`file-${index}`}
                                            onChange={(e) => handleFileChange(docRequerido.nombre, e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor={`file-${index}`} className="btn-subir-archivo" title="Reemplazar archivo">
                                            📤
                                        </label>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        // Mostrar campo para cargar documento faltante
                        return (
                            <div key={index} className="documento-editable faltante">
                                <div className="documento-info">
                                    <span className="documento-icono faltante">
                                        ⚠️
                                    </span>
                                    <span className="documento-nombre">{docRequerido.descripcion}</span>
                                    <span className="documento-estado">Faltante</span>
                                </div>

                                <div className="documento-acciones">
                                    <div className="subir-archivo">
                                        <input
                                            type="file"
                                            id={`file-nuevo-${index}`}
                                            onChange={(e) => handleFileChange(docRequerido.nombre, e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor={`file-nuevo-${index}`} className="btn-cargar-archivo" title="Cargar archivo">
                                            ➕ Cargar
                                        </label>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    if (!estudiante) {
        return (
            <div className="editor-estudiante-container">
                <VolverButton onClick={onClose} />
                <div className="no-data">
                    <p>No hay datos del estudiante para mostrar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="editor-estudiante-container">
            {/* Contenedor de botones superior */}
            <div className="modal-header-buttons">
                {onVolver && (
                    <VolverButton onClick={onVolver} />
                )}
                {onClose && (
                    <CloseButton onClose={onClose} variant="modal" />
                )}
            </div>

            <div className="editor-header">
                <h2>Modificar Estudiante</h2>
            </div>

            <div className="editor-contenido">
                {/* Tarjeta 1: Datos Personales */}
                <div className="tarjeta-editor">
                    <h3>Datos Personales</h3>
                    <div className="tarjeta-contenido-editor">
                        {renderCampoEditable('Nombre', 'nombre', formData.nombre)}
                        {renderCampoEditable('Apellido', 'apellido', formData.apellido)}
                        {renderCampoEditable('DNI', 'dni', formData.dni, 'number')}
                        {renderCampoEditable('CUIL', 'cuil', formData.cuil)}
                        {renderCampoEditable('Fecha de Nacimiento', 'fechaNacimiento', formatearFecha(formData.fechaNacimiento), 'date')}
                        {renderCampoEditable('Tipo de Documento', 'tipoDocumento', formData.tipoDocumento)}
                        {renderCampoEditable('País de Emisión', 'paisEmision', formData.paisEmision)}
                    </div>
                </div>

                {/* Tarjeta 2: Domicilio */}
                <div className="tarjeta-editor">
                    <h3>Domicilio</h3>
                    <div className="tarjeta-contenido-editor">
                        {renderCampoEditable('Calle', 'calle', formData.calle)}
                        {renderCampoEditable('Número', 'numero', formData.numero)}
                        {renderCampoEditable('Barrio', 'barrio', formData.barrio)}
                        {renderCampoEditable('Localidad', 'localidad', formData.localidad)}
                        {renderCampoEditable('Provincia', 'provincia', formData.provincia)}
                    </div>
                </div>

                {/* Tarjeta 3: Información Académica */}
                <div className="tarjeta-editor">
                    <h3>Información Académica</h3>
                    <div className="tarjeta-contenido-editor">
                        {renderCampoEditable('Modalidad', 'modalidad', formData.modalidad)}

                        {/* Campos específicos según modalidad */}
                        {formData.modalidad?.toLowerCase() === 'presencial' ? (
                            renderCampoEditable('Curso', 'planAnio', formData.planAnio)
                        ) : (
                            <>
                                {renderCampoEditable('Plan', 'planAnio', formData.planAnio)}
                                {renderCampoEditable('Módulo', 'modulo', formData.modulo)}
                            </>
                        )}

                        {renderCampoEditable('Estado de Inscripción', 'estadoInscripcion', formData.estadoInscripcion)}
                        {renderCampoEditable('Fecha de Inscripción', 'fechaInscripcion', formatearFecha(formData.fechaInscripcion), 'date')}
                    </div>
                </div>

                {/* Tarjeta 4: Documentación */}
                <div className="tarjeta-editor">
                    <h3>Documentación Presentada</h3>
                    <div className="nota-preservacion">
                        <span className="icono-info">ℹ️</span>
                        <p>Los archivos existentes se preservarán automáticamente. Los documentos faltantes aparecen marcados en rojo para que puedas cargarlos. Solo reemplaza archivos existentes si es necesario.</p>
                    </div>
                    <div className="tarjeta-contenido-editor">
                        {renderDocumentacion()}
                    </div>
                </div>
            </div>

            <div className="editor-acciones">
                <button className="btn-volver" onClick={onClose}>
                    Cancelar
                </button>
                <button
                    className="btn-guardar"
                    onClick={handleGuardarCambios}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Alerta flotante */}
            {showAlert && (
                <AlertaMens
                    text={alertMessage}
                    variant={alertVariant}
                />
            )}
        </div>
    );
};

EditorEstudiante.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onVolver: PropTypes.func,
};

export default EditorEstudiante;
