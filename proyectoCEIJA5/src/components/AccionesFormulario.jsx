import { useState } from 'react';
import PropTypes from 'prop-types';
import '../estilos/accionesForm.css';

const acciones = [
    { nombre: "Registrar", icono: "wand.png" },
    { nombre: "Consultar", icono: "data-searching.png" },
    { nombre: "Modificar", icono: "data-processing.png" },
    { nombre: "Eliminar", icono: "delete.png" },
    { nombre: "Listar", icono: "printer.png" }
];
const AccionesFormulario = ({ setAccion }) => {
    const [selectedButton, setSelectedButton] = useState('');

    const handleButtonClick = (accion) => {
        setAccion(accion);
        setSelectedButton(accion);
    };

    return (
        <div className="accionesContainer">
              {acciones.map(({ nombre, icono }) => (
                <button
                    key={nombre}
                    className={`buttonAcciones ${selectedButton === nombre && "selectedButton"}`}
                    onClick={() => handleButtonClick(nombre)}
                    aria-label={nombre}
                >
                    <img src={`/src/assets/logos/${icono}`} className="img" alt={nombre} />
                    {nombre}
                </button>
            ))}
        </div>
    );
};

AccionesFormulario.propTypes = {
    setAccion: PropTypes.func.isRequired,
};

export default AccionesFormulario;