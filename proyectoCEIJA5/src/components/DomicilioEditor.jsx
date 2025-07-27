import PropTypes from 'prop-types';
import CampoEditable from './subcomponents/CampoEditable';

const DomicilioEditor = ({ formData, handleInputChange, loading, handleGuardarCambios, onClose }) => (
  <div className="tarjeta-editor tarjeta-pequena">
    <h3>Domicilio</h3>
    <div className="tarjeta-contenido-editor">
      <CampoEditable label="Calle" campo="calle" formData={formData} onInputChange={handleInputChange} />
      <CampoEditable label="Número" campo="numero" formData={formData} onInputChange={handleInputChange} tipo="number" />
      <CampoEditable label="Barrio" campo="barrio" formData={formData} onInputChange={handleInputChange} />
      <CampoEditable label="Localidad" campo="localidad" formData={formData} onInputChange={handleInputChange} />
      <CampoEditable label="Provincia" campo="provincia" formData={formData} onInputChange={handleInputChange} />
    </div>
    <div className="tarjeta-acciones">
      <button className="btn-guardar-seccion" onClick={handleGuardarCambios} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Domicilio'}
      </button>
      <button className="btn-cancelar-seccion" onClick={onClose}>Cancelar</button>
    </div>
  </div>
);

DomicilioEditor.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleGuardarCambios: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DomicilioEditor;
