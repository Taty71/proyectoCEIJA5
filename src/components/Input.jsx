import '../estilos/input.css';
import PropTypes from 'prop-types';

function Input(props){
    const {label, type, name, placeholder,options= [] , registro, error}=props
    return( 
        <div className="input-container">
        
                <label>{label}</label>
                {options.length > 0 ? (
                    // Renderiza un <select> si hay opciones {//<option value="">Seleccione una opción</option>}
                    <select name={name} {...registro}>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    // Renderiza un <input> en caso contrario
                    <input
                        type={type || 'text'}
                        name={name || ''}
                        placeholder={placeholder || ''}
                        {...registro}
                    />
                )} 
                 {/* Muestra el error de forma genérica */}
                 {error && <span className="error-message">{error}</span>} 
        </div> 
        
    )
}
Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    registro: PropTypes.object,
    error: PropTypes.any,
};



export default Input;