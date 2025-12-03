import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../estilos/VisorEncuestas.css';

const VisorEncuestas = ({ onClose, userRole }) => {
    const [encuestas, setEncuestas] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todas');

    // Determinar qué modalidad puede ver según el rol
    const modalidadPermitida = () => {
        if (userRole === 'admin') return null; // Admin ve todas
        if (userRole === 'secretario') return 'presencial';
        if (userRole === 'coordinador') return 'semipresencial';
        return null;
    };

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarDatos = async () => {
        try {
            const modalidad = modalidadPermitida();
            const params = modalidad ? { modalidad } : {};
            
            // Cargar encuestas usando axios
            const respEncuestas = await axios.get('/api/encuestas-satisfaccion', { params });
            
            // Cargar estadísticas usando axios
            const respEstadisticas = await axios.get('/api/encuestas-satisfaccion/estadisticas', { params });
            
            if (respEncuestas.data.success) {
                setEncuestas(respEncuestas.data.encuestas);
            }
            
            if (respEstadisticas.data.success) {
                setEstadisticas(respEstadisticas.data.estadisticas);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    // SOLO MANTENER LA FUNCIÓN PDF
    const descargarPDF = async () => {
        try {
            const modalidad = modalidadPermitida();
            const params = modalidad ? { modalidad } : {};
            
            const response = await axios.get('/api/encuestas-satisfaccion/exportar-pdf', {
                params,
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Encuestas_Satisfaccion_${modalidad || 'Todas'}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error descargando PDF:', error);
        }
    };

    // Función para determinar el estado según los promedios
    const getEstadoEncuestas = () => {
        if (!estadisticas) return null;
        
        const promedioGeneral = (parseFloat(estadisticas.promedio_facilidad) + parseFloat(estadisticas.promedio_claridad)) / 2;
        
        if (promedioGeneral >= 4.5) {
            return {
                tipo: 'excelente',
                emoji: '🌟',
                titulo: 'Sistema Excelente',
                mensaje: 'El sistema está funcionando de manera óptima. Los usuarios están muy satisfechos.',
                recomendaciones: [
                    'Mantener los estándares actuales',
                    'Documentar las buenas prácticas implementadas',
                    'Considerar implementar estas prácticas en otras áreas'
                ]
            };
        } else if (promedioGeneral >= 3.5) {
            return {
                tipo: 'bueno',
                emoji: '✅',
                titulo: 'Sistema Funcionando Bien',
                mensaje: 'El sistema tiene un buen desempeño general con algunas áreas de mejora.',
                recomendaciones: [
                    'Identificar puntos específicos de fricción en el proceso',
                    'Revisar comentarios de usuarios para mejoras incrementales',
                    'Priorizar las sugerencias más frecuentes'
                ]
            };
        } else if (promedioGeneral >= 2.5) {
            return {
                tipo: 'regular',
                emoji: '⚠️',
                titulo: 'Necesita Atención',
                mensaje: 'El sistema presenta problemas que requieren atención inmediata.',
                recomendaciones: [
                    'Analizar los problemas más reportados',
                    'Realizar mejoras en la documentación y ayudas visuales',
                    'Considerar capacitación adicional para usuarios',
                    'Revisar el flujo del proceso de inscripción'
                ]
            };
        } else {
            return {
                tipo: 'critico',
                emoji: '🚨',
                titulo: 'Acción Urgente Requerida',
                mensaje: 'El sistema presenta problemas graves que impactan significativamente la experiencia del usuario.',
                recomendaciones: [
                    'Convocar reunión urgente del equipo técnico',
                    'Identificar y resolver problemas críticos de inmediato',
                    'Implementar canales de soporte adicionales',
                    'Considerar rediseño de las secciones más problemáticas',
                    'Establecer plan de acción con plazos definidos'
                ]
            };
        }
    };

    const estadoActual = getEstadoEncuestas();

    const encuestasFiltradas = encuestas.filter(e => {
        if (filtro === 'ultimas') return encuestas.indexOf(e) < 10;
        if (filtro === 'mejores') return e.respuestas.facilidad_uso >= 4;
        if (filtro === 'peores') return e.respuestas.facilidad_uso <= 2;
        return true;
    });

    if (loading) {
        return (
            <div className="visor-encuestas-overlay">
                <div className="visor-loading">⏳ Cargando encuestas...</div>
            </div>
        );
    }

    const modalidadTexto = modalidadPermitida() 
        ? modalidadPermitida().charAt(0).toUpperCase() + modalidadPermitida().slice(1)
        : 'Todas las modalidades';

    return (
        <div className="visor-encuestas-overlay">
            <div className="visor-encuestas-container">
                {/* Header */}
                <div className="visor-header">
                    <div className="header-title-section">
                        <h2>📊 Encuestas de Satisfacción</h2>
                        <span className="modalidad-badge">{modalidadTexto}</span>
                    </div>
                    <div className="header-actions">
                        {/* BOTÓN PDF MÁS PEQUEÑO Y DELICADO */}
                        <button className="btn-export-pdf" onClick={descargarPDF} title="Exportar a PDF">
                            <svg className="pdf-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                <path fill="#DC3545" d="M9.064,3.162h11.6A31.459,31.459,0,0,1,28.188,10.7V28.542H9.064Z"/>
                                <path fill="#FFF" d="M15.819,19.855c.466-.914,1-1.943,1.42-2.977h0l.168-.408c-.554-2.108-.886-3.8-.589-4.894h0a.755.755,0,0,1,.763-.458h0l.215,0h.039c.484-.007.711.608.737.847h0a3.847,3.847,0,0,1-.141,1.072h0a2.639,2.639,0,0,0-.161-1.091h0c-.2-.439-.391-.7-.562-.743h0a.54.54,0,0,0-.2.407h0a5.874,5.874,0,0,0-.077.939h0a10.511,10.511,0,0,0,.433,2.729h0c.054-.156.1-.306.14-.447h0c.059-.222.433-1.691.433-1.691h0s-.094,1.956-.226,2.547h0c-.028.125-.059.249-.092.375h0a8.586,8.586,0,0,0,2.145,3.351h0a6.7,6.7,0,0,0,1.24.852h0a16.9,16.9,0,0,1,2.517-.189h0a3.153,3.153,0,0,1,1.938.433h0a.738.738,0,0,1,.213.484h0a1.446,1.446,0,0,1-.041.282h0c.01-.051.01-.3-.755-.546h0a8.91,8.91,0,0,0-3.086-.043h0c1.566.766,3.093,1.147,3.576.919h0a1.015,1.015,0,0,0,.262-.254h0a2.727,2.727,0,0,1-.146.484h0a.764.764,0,0,1-.377.258h0c-.764.2-2.752-.268-4.485-1.258h0a36.619,36.619,0,0,0-5.768,1.371h0c-1.675,2.936-2.935,4.284-3.959,3.771h0l-.377-.189a.436.436,0,0,1-.141-.474h0c.119-.584.852-1.465,2.324-2.344h0c.158-.1.864-.469.864-.469h0s-.523.506-.645.605h0c-1.175.963-2.042,2.174-2.021,2.644h0l0,.041c1-.142,2.495-2.174,4.419-5.939m.61.312c-.321.605-.636,1.166-.926,1.682h0a24.582,24.582,0,0,1,4.975-1.408h0c-.221-.153-.435-.314-.637-.485h0a8.531,8.531,0,0,1-2.1-2.729h0a23.388,23.388,0,0,1-1.317,2.94"/>
                                <text x="8" y="9" fill="#FFF" fontSize="3" fontFamily="Arial" fontWeight="bold">PDF</text>
                            </svg>
                            <span>PDF</span>
                        </button>
                        <button className="btn-close-visor" onClick={onClose}>✖</button>
                    </div>
                </div>

                {/* Body con scroll único */}
                <div className="visor-encuestas-body">
                    {/* Estadísticas */}
                    {estadisticas && (
                        <div className="estadisticas-panel">
                            <div className="stat-card">
                                <span className="stat-label">Total Encuestas</span>
                                <span className="stat-value">{estadisticas.total}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Facilidad Promedio</span>
                                <span className="stat-value">{estadisticas.promedio_facilidad} ⭐</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Claridad Promedio</span>
                                <span className="stat-value">{estadisticas.promedio_claridad} ⭐</span>
                            </div>
                        </div>
                    )}

                    {/* Filtros - sticky */}
                    <div className="filtros-encuestas">
                        <button 
                            className={filtro === 'todas' ? 'active' : ''} 
                            onClick={() => setFiltro('todas')}
                        >
                            Todas ({encuestas.length})
                        </button>
                        <button 
                            className={filtro === 'ultimas' ? 'active' : ''} 
                            onClick={() => setFiltro('ultimas')}
                        >
                            Últimas 10
                        </button>
                        <button 
                            className={filtro === 'mejores' ? 'active' : ''} 
                            onClick={() => setFiltro('mejores')}
                        >
                            Mejores (4-5★)
                        </button>
                        <button 
                            className={filtro === 'peores' ? 'active' : ''} 
                            onClick={() => setFiltro('peores')}
                        >
                            A mejorar (1-2★)
                        </button>
                    </div>

                    {/* Lista de encuestas - SIN SCROLL PROPIO */}
                    <div className="encuestas-lista">
                        {encuestasFiltradas.length === 0 ? (
                            <p className="no-encuestas">📭 No hay encuestas disponibles</p>
                        ) : (
                            encuestasFiltradas.map(encuesta => (
                                <div key={encuesta.id} className="encuesta-card">
                                    <div className="encuesta-header-card">
                                        <div className="encuesta-info">
                                            <span className="dni-badge">DNI: {encuesta.dni_estudiante}</span>
                                            {encuesta.modalidad && (
                                                <span className={`modalidad-tag ${encuesta.modalidad}`}>
                                                    {encuesta.modalidad}
                                                </span>
                                            )}
                                        </div>
                                        <span className="fecha-encuesta">
                                            {new Date(encuesta.fecha).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                    
                                    <div className="encuesta-respuestas">
                                        <div className="respuesta-item">
                                            <span className="respuesta-label">Facilidad:</span>
                                            <span className="rating-stars">
                                                {'⭐'.repeat(encuesta.respuestas.facilidad_uso || 0)}
                                            </span>
                                        </div>
                                        <div className="respuesta-item">
                                            <span className="respuesta-label">Claridad:</span>
                                            <span className="rating-stars">
                                                {'⭐'.repeat(encuesta.respuestas.claridad_informacion || 0)}
                                            </span>
                                        </div>
                                        <div className="respuesta-item">
                                            <span className="respuesta-label">Tiempo:</span>
                                            <span>{encuesta.respuestas.tiempo_completado}</span>
                                        </div>
                                        {encuesta.respuestas.problemas_encontrados && 
                                         encuesta.respuestas.problemas_encontrados !== 'Ninguno' && (
                                            <div className="respuesta-item">
                                                <span className="respuesta-label">Problemas:</span>
                                                <span className="problema-badge">
                                                    {encuesta.respuestas.problemas_encontrados}
                                                </span>
                                            </div>
                                        )}
                                        {encuesta.respuestas.sugerencias && (
                                            <div className="respuesta-item sugerencias">
                                                <span className="respuesta-label">💡 Sugerencias:</span>
                                                <p>{encuesta.respuestas.sugerencias}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer - Acciones Recomendadas */}
                    {estadoActual && (
                        <div className={`estado-sistema-footer estado-${estadoActual.tipo}`}>
                            <div className="estado-header-footer">
                                <span className="estado-emoji-footer">{estadoActual.emoji}</span>
                                <div className="estado-info-footer">
                                    <h3>{estadoActual.titulo}</h3>
                                    <p>{estadoActual.mensaje}</p>
                                </div>
                            </div>
                            <div className="estado-recomendaciones-footer">
                                <h4>📋 Acciones Recomendadas:</h4>
                                <ul>
                                    {estadoActual.recomendaciones.map((rec, index) => (
                                        <li key={index}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

VisorEncuestas.propTypes = {
    onClose: PropTypes.func.isRequired,
    userRole: PropTypes.oneOf(['admin', 'secretario', 'coordinador']).isRequired
};

export default VisorEncuestas;
