import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import axios from 'axios';
import useGestionDocumentacion from '../hooks/useGestionDocumentacion';
import FormularioModificar from '../components/FormularioModificar';
import { DocumentacionDescripcionToName, DocumentacionNameToId } from '../utils/DocumentacionMap'; // Aseg
import serviceInscripcion from '../services/serviceInscripcion';


const ModificarEstd = ({
  idInscripcion,
  accion,
  isAdmin,
  estudiante,
  onSuccess,
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
        calle: '',
        numero: '',
        barrio: '',
        localidad: '',
        pcia: '',
        planAnio: '',
        modalidad: '',
        modalidadId: Number(estudiante?.modalidadId) || 0,
        idEstadoInscripcion: estudiante?.idEstadoInscripcion || '',
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
            // NUEVO: Validación simple en el cliente
            if (!values.nombre || !values.apellido) {
                setAlert({ text: 'Por favor, completa todos los campos obligatorios', variant: 'error' });
                setSubmitting(false);
                return;
            }

            const detalleDocumentacion = Object.entries(previews)
                .filter(([name]) => DocumentacionNameToId[name])
                .map(([name, doc]) => ({
                    idDocumentaciones: DocumentacionNameToId[name],
                    estadoDocumentacion: doc?.url ? 'Entregado' : 'Faltante',
                    nombreArchivo: name,
                    archivoDocumentacion: null, // Aquí está el problema
                    fechaEntrega: doc?.url ? new Date().toISOString().slice(0, 10) : null
                }));

            const formDataToSend = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                const campo = key === 'modulos' ? 'idModulo' : key;
                formDataToSend.append(campo, value);
            });
            Object.entries(previews).forEach(([key, value]) => {
                if (value?.file) {
                    formDataToSend.append(key, value.file);
                }
            });
            formDataToSend.append('detalleDocumentacion', JSON.stringify(detalleDocumentacion));

            const response = await serviceInscripcion.updateEstd(formDataToSend);
            if (response.success) {
                setAlert({ text: response.message, variant: 'success' });
                onSuccess();
            } else {
                setAlert({ text: response.message, variant: 'error' });
            }
        } catch (error) {
            console.error('Error al modificar estudiante:', error);
            const mensaje = error.response?.data?.message || 'Error interno al modificar';
            setAlert({ text: mensaje, variant: 'error' });
        } finally {
            setTimeout(() => setAlert({ text: '', variant: '' }), 8000);
            setSubmitting(false);
        }
    };


  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
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
};

export default ModificarEstd;
