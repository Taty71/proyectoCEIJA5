// src/components/BusquedaDni.jsx
import  { useState } from 'react';
import service from '../services/service';
import Input from './Input';
import AlertaMens from './AlertaMens';
import '../estilos/estilosDocumentacion.css';  

//Busqueda DNI
const BusquedaDNI = () => {
    const [dni, setDni] = useState('');
    const [estudiante, setEstudiante] = useState(null);const [error, setError] = useState(null);  // Para manejar errores


    const handleChange = (e) => {
        setDni(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await service.getByDocumento(dni);
            if (response.status === 'success') {
                setEstudiante(response.data.data);
                setError(null);  // Limpiar el error si se encuentra el estudiante
            } else {
                //alert('No se encontró un estudiante con ese DNI');
                setEstudiante(null);
                setError('No se encontró un estudiante con ese DNI.');
                
            }
        } catch (error) {
            console.error('Error al consultar el DNI:', error);
            setEstudiante(null);
            setError('Hubo un error al buscar el estudiante.');
        }
    };

    return (
        <div>
            <h2>Consulta de Estudiante por DNI</h2>
            <form onSubmit={handleSubmit}>
            <Input
                    label="DNI"
                    type="number"
                    name="dni"
                    placeholder="Ingresa el DNI"
                    registro={{ value: dni, onChange: handleChange }}
                    error={error && <AlertaMens text={error} variant="error" />}
                />
                <button type="submit" className='buttonF'>Consultar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar mensaje de error */}
            {estudiante && (
                <div>
                    <h3>Información del Estudiante</h3>
                    <p>Nombre: {estudiante.nombreEstd}</p>
                    <p>Apellido: {estudiante.apellidoEstd}</p>
                    <p>DNI: {estudiante.dni}</p>
                    <p>CUIL: {estudiante.cuil}</p>
                    <p>Fecha de Nacimiento: {estudiante.fechaNacimiento}</p>
                    <p>Domicilio Calle: {estudiante.calle}</p>
                    <p>Nro: {estudiante.nro}</p>
                    <p>Barrio: {estudiante.barrioEstd}</p>
                    <p>Localidad: {estudiante.localidadEstd}</p>
                    <p>Provincia: {estudiante.provinciaEstd}</p>
                </div>
            )}
        </div>
    );
};

export default BusquedaDNI;

{/*const BusquedaDNI = ({ onEstudianteEncontrado }) => {
    const [dni, setDni] = useState(''); // Declaramos el estado para el DNI

    const buscarDniSubmit = async (e) => {
        e.preventDefault();
        console.log('DNI enviado:', dni);

        try {
            const buscarDni = { dni };
            const estudiante = await service.buscarDni(buscarDni);
            console.log('Estudiante encontrado:', estudiante);
            onEstudianteEncontrado(estudiante); // Llamamos a la función pasada por props
        } catch (err) {
            console.error('Error al buscar DNI:', err);
            alert('No se encontró un estudiante con ese DNI.');
        }
    };

    const onChangeDni = (event) => setDni(event.target.value);

    return (
        <form onSubmit={buscarDniSubmit}>
            <p>Si ya estás inscripto, ingresa el DNI aquí:</p>
            <div className="form-group">
            <input
                type="number"
                name="dni"
                placeholder="DNI aquí"
                value={dni}
                onChange={onChangeDni}
                className='buscar'
            />
            </div>
            
            <button type="submit">Buscar</button>
        </form>
           {estudiante && (
                <div>
                    <h3>Información del Estudiante</h3>
                    <p>Nombre: {estudiante.nombreEstd}</p>
                    <p>Apellido: {estudiante.apellidoEstd}</p>
                    <p>DNI: {estudiante.dni}</p>
                    <p>CUIL: {estudiante.cuil}</p>
                    <p>Fecha de Nacimiento: {estudiante.fechaNacimiento}</p>
                    {/* Agregar más campos según sea necesario
                </div>
                )}
    );
};

export default BusquedaDNI;*/}

