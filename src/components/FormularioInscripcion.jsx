// src/components/FormularioPreinscripcion.jsx
import React, { useState } from 'react';
import Documentacion from './Documentacion';
import PlanOrYearSelector from './PlanOrYearSelector';
import service from '../services/service';

const FormularioInscripcion = ({ modalidad, estudianteEncontrado }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        cuil: '',
        fechaNacimiento: '',
        calle: '',
        nro: '',
        barrio: '',
        localidad: '',
        pcia: '',
        modalidad,
        planAnio: '',
        titulo: '',
    });

    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({
        dni: null,
        cuil: null,
        foto: null,
        partidaNacimiento: null,
        fichaMedica: null,
        archivoTitulo: null,
    });
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 600 * 1024) {
                alert('El archivo es demasiado grande. Máximo permitido: 600 KB.');
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviews((prev) => ({ ...prev, [field]: { url, type: file.type } }));
            setFiles((prev) => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        Object.entries(files).forEach(([key, file]) => {
            formDataToSend.append(key, file);
        });
     
    console.log([...formDataToSend.entries()]);

        try {
            const response = await service.create(formDataToSend);
            if (response) {
                alert('Formulario enviado con éxito');
            } else {
                alert('Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Ocurrió un error al enviar los datos.');
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
             <div className="formd">
                <div className="form-datos">
                <h3>Datos Pesonales</h3>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido:</label>
                        <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>DNI:</label>
                        <input type="number" name="dni" placeholder="DNI" onChange={handleChange} required />            
                    </div>
                    <div className="form-group">
                        <label>CUIL:</label>
                        <input type="text" name="cuil" placeholder="CUIL" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Fecha Nacimiento:</label>
                        <input type="date" name="fechaNacimiento" onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-domicilio">
                    <h3>Domicilo</h3>
                    <div className="form-group">                
                        <label>Calle:</label>
                        <input type="text" name="calle" placeholder="Calle" onChange={handleChange} required />
                    </div>
                    <div className="form-group"> 
                        <label>Número:</label>
                        <input type="text" name="nro" className="nro" placeholder="Número" onChange={handleChange} required />
                    </div>
                    <div className="form-group">   
                        <label>Barrio:</label>
                        <input type="text" name="barrio" placeholder="Barrio" onChange={handleChange} required />
                    </div>
                    <div className="localPcia">
                        <div className="form-group">
                            <label>Localidad:</label>
                            <input type="text" name="localidad" placeholder="Localidad" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Provincia:</label>
                            <input type="text" name="pcia" placeholder="Provincia" onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="form-eleccion">
                    <h3>Modalidad Presencial/Semipresencial a Distancia</h3>
                    <div className="form-group">
                        <label>Modalidad:</label>
                        <input type="text" name="modalidad" value={modalidad} readOnly className="modalidad"/>
                    </div>
                    <div className="form-group">
                    {/*{renderPlanOrYearSelector()}*/}
                    <PlanOrYearSelector modalidad={modalidad} handleChange={handleChange} /> 
                    {/* Botón para adjuntar archivo según el título seleccionado */}
                    </div>
                </div>
                <div className="form-documentacion">
                    <div className='form-h3'>
                    <h3>Documentacion a presentar <br/>
                    <span>Recuerda que debes presentarla al momento de la inscripcion presencial</span>
                    </h3>
                    </div>
                  {/*DOCUMENTACION*/}
                  <div className='form-doc'>
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

                    {/* Botón para adjuntar archivo según el título seleccionado */}
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
                            
                        onRadioChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                        
                    />
                    </div>
                    </div>
                </div>
            </div>

           
          {/* Botón enviar */}
            <button type="submit" className="buttonF">Enviar</button>
        </form>
        
    );
};

export default FormularioInscripcion;
