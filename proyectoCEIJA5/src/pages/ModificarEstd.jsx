import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import axios from 'axios';
import useGestionDocumentacion from '../hooks/useGestionDocumentacion';
import FormularioModificar from '../components/FormularioModificar';
import { DocumentacionDescripcionToName, DocumentacionNameToId } from '../utils/DocumentacionMap'; // Aseg
import serviceInscripcion from '../services/serviceInscripcion';
import { formularioInscripcionSchema } from '../validaciones/ValidacionSchemaYup';


const ModificarEstd = ({
  idInscripcion,
  accion,
  isAdmin,
  estudiante,
  onSuccess,
  modalidadId,
  modalidadFiltrada,
}) => {
    const {
        previews,
        setPreviews,
        alert,
        setAlert,
        handleFileChange,
        buildDetalleDocumentacion,
        resetArchivos,
    } = useGestionDocumentacion();

  const [documentacion, setDocumentacion] = useState([]);

  // Traer la documentación junto con la preview (lo mismo que antes)
  useEffect(() => {
    const fetchDocumentacion = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/documentacion/${idInscripcion}`);
            if (response.data.success && Array.isArray(response.data.data)) {
                setDocumentacion(response.data.data);
                const archivos = response.data.data.reduce((acc, doc) => {
                    const nombreInterno = DocumentacionDescripcionToName[doc.descripcionDocumentacion];
                    if (nombreInterno) {
                        acc[nombreInterno] = {
                            url: doc.archivoDocumentacion || null,
                            estado: doc.estadoDocumentacion || 'Faltante',
                        };
                    }
                    return acc;
                }, {});
                setPreviews(archivos);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener documentación:', error);
            setAlert({ text: 'Error al cargar la documentación', variant: 'error' });
        }
    };

    if (idInscripcion && Number(idInscripcion) > 0) {
        fetchDocumentacion();
    }
  }, [idInscripcion, setPreviews, setAlert]);

  // --- NUEVA FUNCIÓN para guardar cambios de documentación desde el modal ---
  const handleGuardarCambiosDocumentacion = async (docsEditados) => {
    try {
      // Armar FormData para enviar archivos y estado actualizado
      const formData = new FormData();

      // Estado actualizado y fecha de entrega: asumimos que "Entregado" actualiza fecha al día actual
      const detalleDocumentacion = docsEditados.map((doc) => ({
        idDocumentaciones: doc.idDocumentaciones,
        estadoDocumentacion: doc.estadoDocumentacion,
        fechaEntrega: doc.estadoDocumentacion === 'Entregado' ? new Date().toISOString().slice(0, 10) : null,
        nombreArchivo: doc.descripcionDocumentacion,
      }));

      formData.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));

      // Archivos nuevos (si hay)
      docsEditados.forEach((doc) => {
        if (doc.nuevoArchivo) {
          // El backend debe saber qué archivo corresponde a qué documento, enviamos con nombre del campo = descripción interna
          const nombreInterno = DocumentacionDescripcionToName[doc.descripcionDocumentacion];
          if (nombreInterno) {
            formData.append(nombreInterno, doc.nuevoArchivo);
          }
        }
      });

      // Enviar a backend (creá endpoint si no existe, por ej: PUT /api/documentacion/:idInscripcion)
      const response = await axios.put(`http://localhost:5000/api/documentacion/${idInscripcion}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setAlert({ text: 'Documentación actualizada con éxito', variant: 'success' });

        // Refrescar documentación y previews
        setDocumentacion(response.data.data);
        const archivos = response.data.data.reduce((acc, doc) => {
          const nombreInterno = DocumentacionDescripcionToName[doc.descripcionDocumentacion];
          if (nombreInterno) {
            acc[nombreInterno] = {
              url: doc.archivoDocumentacion || null,
              estado: doc.estadoDocumentacion || 'Faltante',
            };
          }
          return acc;
        }, {});
        setPreviews(archivos);
      } else {
        setAlert({ text: 'Error al actualizar documentación', variant: 'error' });
      }
    } catch (error) {
      console.error('Error al guardar documentación:', error);
      setAlert({ text: 'Error interno al guardar documentación', variant: 'error' });
    }
  };

  // Resto igual: submit principal para modificar estudiante...

 

    const initialValues = {
        nombre: '',
        apellido: '',
        dni: '',
        cuil: '',
        email: '',
        calle: '',
        numero: '',
        barrio: '',
        localidad: '',
        pcia: '',
        planAnio: estudiante?.planAnio ? Number(estudiante.planAnio) : '',
        planAnioId: estudiante?.planAnioId ? Number(estudiante.planAnioId) : '',
        idModulo: estudiante?.idModulo ? Number(estudiante.idModulo) : '',
        modalidad: estudiante?.modalidad || '',
        modalidadId: estudiante?.modalidadId ? Number(estudiante.modalidadId) : 0,
        idEstadoInscripcion: estudiante?.idEstadoInscripcion ? Number(estudiante.idEstadoInscripcion) : (estudiante?.estadoInscripcionId ? Number(estudiante.estadoInscripcionId) : ''),
        foto: null,
        dniDocumento: null,
        cuilDocumento: null,
        partidaNacimiento: null,
        fichaMedica: null,
        solicitudPase: null,
        analiticoParcial: null,
        certificadoNivelPrimario: null,
        ...estudiante,
        fechaNacimiento: estudiante?.fechaNacimiento
            ? new Date(estudiante.fechaNacimiento).toISOString().slice(0, 10)
            : '',
        fechaInscripcion: estudiante?.fechaInscripcion
            ? new Date(estudiante.fechaInscripcion).toISOString().slice(0, 10)
            : '',

    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            // Validación simple en el cliente
            if (!values.nombre || !values.apellido || !values.dni || !values.planAnioId || !values.modalidadId) {
                setAlert({ text: 'Por favor, completa todos los campos obligatorios', variant: 'error' });
                setSubmitting(false);
                return;
            }

            // ModalidadId: debe ser numérico
            let modalidadId = Number(values.modalidadId);
            if (!modalidadId) {
                if (values.modalidad?.toLowerCase() === 'semipresencial') modalidadId = 2;
                else if (values.modalidad?.toLowerCase() === 'presencial') modalidadId = 1;
            }

            // PlanAnioId: debe ser numérico
            let planAnioId = Number(values.planAnioId);
            if (!planAnioId && values.planAnio && !isNaN(Number(values.planAnio))) {
                planAnioId = Number(values.planAnio);
            } else if (!planAnioId) {
                // Asegurarse de que planAnioId sea válido y corresponda a un ID existente en la base de datos
                setAlert({ text: 'El plan de año seleccionado no es válido', variant: 'error' });
                setSubmitting(false);
                return;
            }

            // ModulosId: debe ser numérico
            let modulosId = Number(values.idModulo);
            if (!modulosId && values.modulo && !isNaN(Number(values.modulo))) {
                modulosId = Number(values.modulo);
            }

            // EstadoInscripcionId: debe ser numérico
            let estadoInscripcionId = Number(values.idEstadoInscripcion);

            const detalleDocumentacion = Object.entries(previews)
                .filter(([name]) => DocumentacionNameToId[name])
                .map(([name, doc]) => ({
                    idDocumentaciones: DocumentacionNameToId[name],
                    estadoDocumentacion: doc?.url ? 'Entregado' : 'Faltante',
                    nombreArchivo: name,
                    archivoDocumentacion: null,
                    fechaEntrega: doc?.url ? new Date().toISOString().slice(0, 10) : null
                }));

            const formDataToSend = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                // Mapear correctamente los campos para el backend
                if (key === 'modalidadId') formDataToSend.append('modalidadId', modalidadId);
                else if (key === 'planAnioId' || key === 'planAnio') formDataToSend.append('planAnioId', planAnioId);
                else if (key === 'idModulo' || key === 'modulo') formDataToSend.append('modulosId', modulosId);
                else if (key === 'idEstadoInscripcion') formDataToSend.append('estadoInscripcionId', estadoInscripcionId);
                else formDataToSend.append(key, value);
            });
            Object.entries(previews).forEach(([key, value]) => {
                if (value?.file) {
                    formDataToSend.append(key, value.file);
                }
            });
            formDataToSend.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));

            // Llama al servicio de modificación
            const response = await serviceInscripcion.updateEstd(formDataToSend, values.dni);
            if (response.success) {
                setAlert({ text: response.message || 'Los datos del estudiante se han modificado con éxito.', variant: 'success' });
                onSuccess();
                setTimeout(() => setAlert({ text: '', variant: '' }), 5000);
            } else {
                setAlert({ text: response.message || 'Error al modificar los datos del estudiante.', variant: 'error' });
            }
        } catch (error) {
            console.error('Error al modificar estudiante:', error);
            const mensaje = error.response?.data?.message || 'Error interno al modificar';
            setAlert({ text: mensaje, variant: 'error' });
        } finally {
            setSubmitting(false); // Asegúrate de habilitar el botón después de la operación
        }
    };

  useEffect(() => {
    if (estudiante) {
        // Debug: Mostrar datos del estudiante cargados
        console.log('Datos del estudiante cargados:', estudiante);
        // Debug modalidad recibida
        console.log('modalidadId:', modalidadId, 'modalidadFiltrada:', modalidadFiltrada);
    } else {
        console.error('No se encontraron datos del estudiante.');
    }
}, [estudiante, modalidadId, modalidadFiltrada]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={formularioInscripcionSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, setFieldValue, isSubmitting, resetForm }) => (
        <FormularioModificar
          values={values}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
          handleFileChange={(e, field) => handleFileChange(e, field, setFieldValue)}
          alert={alert}
          isAdmin={isAdmin}
          accion={accion}
          documentacion={documentacion}
          setPreviews={setPreviews}
          // PASAMOS LA NUEVA FUNCIÓN AL MODAL (o componente que la use)
          onGuardarCambiosDocumentacion={handleGuardarCambiosDocumentacion}
          buildDetalleDocumentacion={buildDetalleDocumentacion} // Pasada como prop
          resetArchivos={resetArchivos} // Pasada como prop
        />
      )}
    </Formik>
  );
};
ModificarEstd.propTypes = {
  idInscripcion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accion: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  estudiante: PropTypes.object,
  onSuccess: PropTypes.func,
  modalidadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  modalidadFiltrada: PropTypes.string.isRequired,
};

export default ModificarEstd;
