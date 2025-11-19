import { useState } from 'react';
import PropTypes from 'prop-types';
import BotonCargando from './BotonCargando';
import '../estilos/buscadorDNI.css';

const BuscadorDNI = ({ 
  onBuscar,
  onBuscarGeneral,
  loading = false, 
  disabled = false, 
  modoBusqueda: _modoBusqueda = false,
  placeholder = "Ingresa el DNI del estudiante (ej: 12345678)",
  suppressGlobalLoading = true
}) => {
  const [term, setTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const handleBuscar = () => {
    if (!term || !term.trim()) return;
    const texto = term.trim();
    // Si es solo dígitos (DNI), usar onBuscar (buscar por DNI). Si no, usar onBuscarGeneral si está disponible.
    const soloDigitos = /^\d+$/.test(texto.replace(/\s+/g, ''));
    try {
      let result;
      if (soloDigitos) {
        if (typeof onBuscar === 'function') result = onBuscar(texto);
      } else {
        if (typeof onBuscarGeneral === 'function') result = onBuscarGeneral(texto);
        else if (typeof onBuscar === 'function') result = onBuscar(texto);
      }

      // If handler returned a promise, show local spinner until it resolves
      if (result && typeof result.then === 'function') {
        setSearching(true);
        result.finally(() => setSearching(false));
      }
    } catch (err) {
      // ignore handler errors here (they'll be handled upstream)
      setSearching(false);
    }
  };

  // Nota: la limpieza se renderiza externamente en PanelControles.

  const handleInputChange = (e) => {
    // Permitir texto libre (nombre/apellido/DNI). Limitar longitud a 60
    const valor = e.target.value.slice(0, 60);
    setTerm(valor);
  };

  // Ejecutar búsqueda cuando el usuario presiona Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  const showSpinner = (!suppressGlobalLoading && loading) || searching;

  return (
    <div className="buscador-dni-container">
      {/* Buscador general por Nombre / Apellido / DNI (solo si se provee handler) */}
      <div className="buscador-dni-input-group">
        <input
          type="text"
          placeholder={placeholder}
          className="buscador-dni-input"
          value={term}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={loading || disabled}
        />
        <BotonCargando
          loading={showSpinner}
          className="btn-buscar-dni"
          onClick={handleBuscar}
          disabled={loading || disabled || !term.trim()}
          title="Buscar estudiante"
        >
          🔍
        </BotonCargando>
      </div>
      
      {/* Limpieza se mostrará externamente justo debajo del buscador en PanelControles */}
    </div>
  );
};

BuscadorDNI.propTypes = {
  onBuscar: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  modoBusqueda: PropTypes.bool,
  onBuscarGeneral: PropTypes.func,
  placeholder: PropTypes.string,
};

export default BuscadorDNI;
