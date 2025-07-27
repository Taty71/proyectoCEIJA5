import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Importar los componentes de botón correctamente
import VolverButton from './VolverButton.jsx';
import CloseButton from './CloseButton.jsx';
import serviceObtenerAcad from '../services/serviceObtenerAcad';
import { DocumentacionDescripcionToName } from '../utils/DocumentacionMap.jsx';

const VisorEstudiante = ({ estudiante, onClose, onModificar, onVolver, isConsulta = false, isEliminacion = false }) => {
    const [editMode, setEditMode] = useState({
        personales: false,
        domicilio: false,
        academica: false,
        documentacion: false
    });
    const [formData, setFormData] = useState({
        ...estudiante,
        modalidadId: Number(estudiante.modalidadId) ||
            (estudiante.modalidad === 'Presencial' ? 1 :
             estudiante.modalidad === 'Semipresencial' ? 2 : ''),
        planAnioId: estudiante.planAnioId ? Number(estudiante.planAnioId) : '',
        modulosId: estudiante.modulosId ? Number(estudiante.modulosId) : '',
        estadoInscripcionId: estudiante.estadoInscripcionId ? Number(estudiante.estadoInscripcionId) : '',
    });
    const [estadosInscripcion, setEstadosInscripcion] = useState([]);
    const [modulos, setModulos] = useState([]); // <-- Agregado para manejar módulos

    // Cargar módulos cuando cambie el plan
    useEffect(() => {
        if (formData.planAnioId && editMode.academica && formData.modalidad && formData.modalidad.toLowerCase() === 'semipresencial') {
            const cargarModulos = async () => {
                try {
                    const response = await serviceObtenerAcad.getModulos(formData.planAnioId);
                    setModulos(response || []);
                } catch (error) {
                    setModulos([]);
                    console.error('Error al cargar módulos:', error);
                }
            };
            cargarModulos();
        } else {
            setModulos([]);
        }
    }, [formData.planAnioId, editMode.academica, formData.modalidad]);

    // Cargar estados de inscripción
    useEffect(() => {
        if (editMode.academica) {
            const cargarEstados = async () => {
                try {
                    const response = await serviceObtenerAcad.getEstadosInscripcion();
                    // El backend devuelve un array directamente
                    if (Array.isArray(response)) {
                        setEstadosInscripcion(response);
                    } else {
                        setEstadosInscripcion([]);
                    }
                } catch (error) {
                    setEstadosInscripcion([]);
                    console.error('Error al cargar estados:', error);
                }
            };
            cargarEstados();
        }
    }, [editMode.academica]);

    const formatearFecha = (fecha) => {
        if (!fecha || fecha === 'No disponible') return 'No disponible';
        try {
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return 'No disponible';
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        } catch {
            return 'No disponible';
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const isFormDataChanged = (seccion) => {
        if (!estudiante) return false;
        switch (seccion) {
            case 'personales':
                return (
                    formData.nombre !== estudiante.nombre ||
                    formData.apellido !== estudiante.apellido ||
                    formData.cuil !== estudiante.cuil ||
                    formData.fechaNacimiento !== estudiante.fechaNacimiento
                );
            case 'domicilio':
                return (
                    formData.calle !== estudiante.calle ||
                    formData.numero !== estudiante.numero ||
                    formData.barrio !== estudiante.barrio ||
                    formData.localidad !== estudiante.localidad ||
                    formData.pcia !== estudiante.pcia
                );
            case 'academica':
                return (
                    formData.modalidad !== estudiante.modalidad ||
                    formData.planAnio !== estudiante.planAnio ||
                    formData.modulo !== estudiante.modulo ||
                    formData.estadoInscripcion !== estudiante.estadoInscripcion ||
                    formData.fechaInscripcion !== estudiante.fechaInscripcion
                );
            case 'documentacion':
                // Si tienes edición de documentación, puedes comparar aquí
                return false;
            default:
                return false;
        }
    };

    const getDatosSeccion = (seccion) => {
        switch (seccion) {
            case 'personales':
                return {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    cuil: formData.cuil,
                    fechaNacimiento: formData.fechaNacimiento,
                    dni: formData.dni,
                    tipoDocumento: formData.tipoDocumento,
                    paisEmision: formData.paisEmision,
                    email: formData.email
                };
            case 'domicilio':
                return {
                    calle: formData.calle,
                    numero: formData.numero,
                    barrio: formData.barrio,
                    localidad: formData.localidad,
                    pcia: formData.pcia,
                    dni: formData.dni // necesario para identificar
                };
            case 'academica':
                return {
                    modalidad: formData.modalidad,
                    planAnio: formData.planAnio,
                    modulo: formData.modulo,
                    estadoInscripcion: formData.estadoInscripcion,
                    modalidadId: formData.modalidadId,
                    planAnioId: formData.planAnioId,
                    modulosId: formData.modulosId,
                    estadoInscripcionId: formData.estadoInscripcionId,
                    dni: formData.dni
                };
            case 'documentacion': {
                // Construye el array de detalleDocumentacion para enviar al backend
                const detalle = (formData.documentacion || []).map(doc => ({
                    idDocumentaciones: doc.idDocumentaciones,
                    estadoDocumentacion: doc.estadoDocumentacion,
                    fechaEntrega: doc.fechaEntrega,
                    nombreArchivo: DocumentacionDescripcionToName[doc.descripcionDocumentacion] || doc.descripcionDocumentacion,
                }));
                // Adjunta archivos si se han cargado
                const archivos = formData.archivos || {};
                return {
                    detalleDocumentacion: JSON.stringify(detalle),
                    archivos, // Se envía como parte del formData si hay archivos
                    dni: formData.dni
                };
            }
            default:
                return {};
        }
    };

    const handleGuardar = (seccion) => {
        if (!isFormDataChanged(seccion)) {
            setEditMode(prev => ({ ...prev, [seccion]: false }));
            setFormData(estudiante);
            return;
        }
        const datosSeccion = getDatosSeccion(seccion);
        if (onModificar) {
            try {
                onModificar(datosSeccion, seccion); // ahora se pasa la sección
                console.log('✅ Datos enviados correctamente a onModificar'); // Debug log
            } catch (error) {
                console.error('🚨 Error al enviar datos a onModificar:', error); // Debug log
            }
        }
        setEditMode(prev => ({ ...prev, [seccion]: false }));
    };

    const handleCancelar = (seccion) => {
        setFormData(estudiante);
        setEditMode(prev => ({ ...prev, [seccion]: false }));
    };

    if (!estudiante) {
        return <div>No hay datos del estudiante para mostrar.</div>;
    }

    console.log('Estudiante recibido en visor:', estudiante);

    return (
        <div className={`visor-estudiante-container ${isConsulta ? 'modo-consulta' : 'modo-gestion'}`}>
            <div className="modal-header-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                {onVolver && (
                    <VolverButton onClick={onVolver} />
                )}
                {onClose && (
                    <CloseButton onClose={onClose} variant="simple" />
                )}
            </div>
            <div className="visor-header" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2>
                    {isEliminacion ? 'Eliminar Estudiante' :
                        isConsulta ? 'Consulta de Estudiante' :
                        'Detalles del Estudiante'}
                </h2>
            </div>
            <div className="visor-contenido layout-tarjetas-2x2">
                <div className="tarjetas-grid-2x2">
                    <div className="tarjeta tarjeta-personales" style={{ height: '520px' }}>
                        <div className="tarjeta-header">
                            <h3>Datos Personales</h3>
                            {!isConsulta && !isEliminacion && (
                                <button onClick={() => setEditMode(prev => ({ ...prev, personales: true }))} title="Editar datos personales">✏️</button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="dato-item">
                                <label>Nombre:</label>
                                {editMode.personales ? (
                                    <input value={formData.nombre || ''} onChange={e => handleInputChange('nombre', e.target.value)} />
                                ) : (
                                    <span>{estudiante.nombre}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Apellido:</label>
                                {editMode.personales ? (
                                    <input value={formData.apellido || ''} onChange={e => handleInputChange('apellido', e.target.value)} />
                                ) : (
                                    <span>{estudiante.apellido}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>DNI:</label>
                                <span>{estudiante.dni}</span>
                            </div>
                            <div className="dato-item">
                                <label>CUIL:</label>
                                {editMode.personales ? (
                                    <input value={formData.cuil || ''} onChange={e => handleInputChange('cuil', e.target.value)} />
                                ) : (
                                    <span>{estudiante.cuil}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Fecha de Nacimiento:</label>
                                {editMode.personales ? (
                                    <input type="date" value={formData.fechaNacimiento || ''} onChange={e => handleInputChange('fechaNacimiento', e.target.value)} />
                                ) : (
                                    <span>{formatearFecha(estudiante.fechaNacimiento)}</span>
                                )}
                            </div>
                            {/* Mostrar foto si existe */}
                            {estudiante.foto && (
                                <div className="dato-item" style={{ marginTop: '1em' }}>
                                    <label>Foto:</label>
                                    <img
                                        src={estudiante.foto.startsWith('http') ? estudiante.foto : `http://localhost:5000${estudiante.foto}`}
                                        alt={`Foto de ${estudiante.nombre} ${estudiante.apellido}`}
                                        style={{ maxWidth: '120px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                                    />
                                </div>
                            )}
                        </div>
                        {editMode.personales && (
                            <div className="visor-acciones">
                                <button className="btn-guardar-seccion" onClick={() => handleGuardar('personales')}>Guardar cambios</button>
                                <button className="btn-cancelar-seccion" onClick={() => handleCancelar('personales')}>Cancelar</button>
                            </div>
                        )}
                    </div>
                    <div className="tarjeta tarjeta-domicilio" style={{ height: '520px' }}>
                        <div className="tarjeta-header">
                            <h3>Domicilio</h3>
                            {!isConsulta && !isEliminacion && (
                                <button onClick={() => setEditMode(prev => ({ ...prev, domicilio: true }))} title="Editar domicilio">✏️</button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="dato-item">
                                <label>Calle:</label>
                                {editMode.domicilio ? (
                                    <input value={formData.calle || ''} onChange={e => handleInputChange('calle', e.target.value)} />
                                ) : (
                                    <span>{estudiante.calle || estudiante.domicilio?.calle || ''}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Número:</label>
                                {editMode.domicilio ? (
                                    <input value={formData.numero || ''} onChange={e => handleInputChange('numero', e.target.value)} />
                                ) : (
                                    <span>{estudiante.numero || estudiante.domicilio?.numero || ''}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Barrio:</label>
                                {editMode.domicilio ? (
                                    <input value={formData.barrio || ''} onChange={e => handleInputChange('barrio', e.target.value)} />
                                ) : (
                                    <span>{estudiante.barrio || 'No especificado'}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Localidad:</label>
                                {editMode.domicilio ? (
                                    <input value={formData.localidad || ''} onChange={e => handleInputChange('localidad', e.target.value)} />
                                ) : (
                                    <span>{estudiante.localidad || estudiante.domicilio?.localidad || ''}</span>
                                )}
                            </div>
                            <div className="dato-item">
                                <label>Provincia:</label>
                                {editMode.domicilio ? (
                                    <input value={formData.provincia || formData.pcia || ''} onChange={e => handleInputChange('provincia', e.target.value)} />
                                ) : (
                                    <span>{estudiante.provincia || estudiante.pcia || estudiante.domicilio?.provincia || ''}</span>
                                )}
                            </div>
                        </div>
                        {editMode.domicilio && (
                            <div className="visor-acciones">
                                <button className="btn-guardar-seccion" onClick={() => handleGuardar('domicilio')}>Guardar cambios</button>
                                <button className="btn-cancelar-seccion" onClick={() => handleCancelar('domicilio')}>Cancelar</button>
                            </div>
                        )}
                    </div>
                    <div className="tarjeta tarjeta-academica">
                        <div className="tarjeta-header">
                            <h3>Información Académica</h3>
                            {!isConsulta && !isEliminacion && (
                                <button onClick={() => setEditMode(prev => ({ ...prev, academica: true }))} title="Editar información académica">✏️</button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            {/* Modalidad (solo lectura, sin select) */}
                            <div className="dato-item">
                                <label>Modalidad:</label>
                                <span style={{ fontWeight: 600 }}>{formData.modalidad || 'No especificado'}</span>
                            </div>

                            {/* Plan/Año y Módulo */}
                            {formData.modalidad && formData.modalidad.toLowerCase() === 'presencial' && (
                                <div className="dato-item">
                                    <label>Año:</label>
                                    {editMode.academica ? (
                                        <select
                                            value={formData.planAnioId || ''}
                                            onChange={e => {
                                                handleInputChange('planAnioId', Number(e.target.value));
                                                handleInputChange('planAnio', e.target.options[e.target.selectedIndex]?.text || '');
                                                handleInputChange('modulosId', '');
                                                handleInputChange('modulo', '');
                                            }}
                                        >
                                            <option value="">Seleccionar Año</option>
                                            <option value={1}>1er Año</option>
                                            <option value={2}>2do Año</option>
                                            <option value={3}>3er Año</option>
                                        </select>
                                    ) : (
                                        <span>{formData.planAnio || 'No especificado'}</span>
                                    )}
                                </div>
                            )}
                            {formData.modalidad && formData.modalidad.toLowerCase() === 'semipresencial' && (
                                <>
                                    <div className="dato-item">
                                        <label>Plan:</label>
                                        {editMode.academica ? (
                                            <select
                                                value={formData.planAnioId || ''}
                                                onChange={e => {
                                                    const planId = Number(e.target.value);
                                                    const planTexto = e.target.options[e.target.selectedIndex]?.text || '';
                                                    handleInputChange('planAnioId', planId);
                                                    handleInputChange('planAnio', planTexto);
                                                    handleInputChange('modulosId', '');
                                                    handleInputChange('modulo', '');
                                                }}
                                            >
                                                <option value="">Seleccionar Plan</option>
                                                <option value={4}>Plan A</option>
                                                <option value={5}>Plan B</option>
                                                <option value={6}>Plan C</option>
                                            </select>
                                        ) : (
                                            <span>{formData.planAnio || 'No especificado'}</span>
                                        )}
                                    </div>
                                    <div className="dato-item">
                                        <label>Módulo:</label>
                                        {editMode.academica ? (
                                            <select
                                                value={formData.modulosId || ''}
                                                onChange={e => {
                                                    const id = Number(e.target.value);
                                                    const moduloTexto = modulos.find(m => m.id === id)?.nombre || '';
                                                    handleInputChange('modulosId', id);
                                                    handleInputChange('modulo', moduloTexto);
                                                }}
                                                disabled={!modulos.length}
                                            >
                                                <option value="">Seleccionar Módulo</option>
                                                {modulos.map(modulo => (
                                                    <option key={modulo.id} value={modulo.id}>
                                                        {modulo.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span>{formData.modulo || 'No especificado'}</span>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Estado de Inscripción */}
                            <div className="dato-item">
                                <label>Estado de Inscripción:</label>
                                {editMode.academica ? (
                                    <select
                                        value={formData.estadoInscripcionId || ''}
                                        onChange={e => {
                                            const id = Number(e.target.value);
                                            const selectedEstado = estadosInscripcion.find(est => est.id === id);
                                            handleInputChange('estadoInscripcionId', id);
                                            handleInputChange('estadoInscripcion', selectedEstado?.descripcionEstado || '');
                                        }}
                                    >
                                        <option value="">Estado</option>
                                        {estadosInscripcion.map(est => (
                                            <option key={est.id} value={est.id}>
                                                {est.descripcionEstado}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{formData.estadoInscripcion || 'No especificado'}</span>
                                )}
                            </div>

                            {/* Fecha de Inscripción */}
                            <div className="dato-item">
                                <label>Fecha de Inscripción:</label>
                                <span>{formatearFecha(formData.fechaInscripcion)}</span>
                            </div>
                        </div>
                        {editMode.academica && (
                            <div className="visor-acciones">
                                <button className="btn-guardar-seccion" onClick={() => handleGuardar('academica')}>Guardar cambios</button>
                                <button className="btn-cancelar-seccion" onClick={() => handleCancelar('academica')}>Cancelar</button>
                            </div>
                        )}
                    </div>
                    <div className="tarjeta tarjeta-documentacion">
                        <div className="tarjeta-header">
                            <h3>Documentación Presentada</h3>
                            {!isConsulta && !isEliminacion && (
                                <button onClick={() => setEditMode(prev => ({ ...prev, documentacion: true }))} title="Editar documentación">✏️</button>
                            )}
                        </div>
                        <div className="tarjeta-contenido">
                            <div className="documentacion-lista-tarjeta">
                                {(estudiante.documentacion || []).map((doc, idx) => {
                                    const isMissing = !doc.archivoDocumentacion;
                                    return (
                                        <div key={doc.idDocumentaciones || idx} className={`documento-item-tarjeta ${isMissing ? 'faltante' : ''}`}>
                                            <div className="documento-info">
                                                <span className="documento-icono" data-estado={doc.estadoDocumentacion?.toLowerCase() || 'faltante'}>
                                                    {doc.estadoDocumentacion?.toLowerCase() === 'entregado' ? '✓' : '✗'}
                                                </span>
                                                <span className="documento-nombre-corto">{doc.descripcionDocumentacion}</span>
                                            </div>
                                            <div className="documento-acciones">
                                                {doc.archivoDocumentacion ? (
                                                    <a
                                                        href={doc.archivoDocumentacion.startsWith('http') ? doc.archivoDocumentacion : `http://localhost:5000${doc.archivoDocumentacion}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-ver-archivo-mini"
                                                        title="Ver documento"
                                                    >👁️ Ver archivo</a>
                                                ) : (
                                                    <span className="documento-faltante" title="Documento faltante">❌</span>
                                                )}
                                                {!isConsulta && !isEliminacion && editMode.documentacion && isMissing && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            id={`file-input-${doc.idDocumentaciones || idx}`}
                                                            className="input-cargar-archivo"
                                                            style={{ display: 'none' }}
                                                            title="Subir documento"
                                                            onChange={() => {
                                                                // Puedes agregar aquí la lógica de manejo de archivo
                                                            }}
                                                        />
                                                        <label htmlFor={`file-input-${doc.idDocumentaciones || idx}`} style={{ cursor: 'pointer' }} title="Seleccionar archivo">
                                                            <span role="img" aria-label="Seleccionar archivo" style={{ fontSize: '1.3em' }}>📎</span>
                                                        </label>
                                                        <button className="btn-subir-archivo-mini" title="Subir archivo">📤</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {editMode.documentacion && (
                            <div className="visor-acciones">
                                <button className="btn-guardar-seccion" onClick={() => handleGuardar('documentacion')}>Guardar cambios</button>
                                <button className="btn-cancelar-seccion" onClick={() => handleCancelar('documentacion')}>Cancelar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

VisorEstudiante.propTypes = {
    estudiante: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onModificar: PropTypes.func,
    onVolver: PropTypes.func,
    isConsulta: PropTypes.bool,
    isEliminacion: PropTypes.bool,
};

export default VisorEstudiante;

