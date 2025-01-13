import './input.css';

function Input(props){
    const {label, type, name, placeholder,options= [] , registro, error}=props
    return( 
        <div className="input-container">
        
                <label>{label}</label>
                {options.length > 0 ? (
                    // Renderiza un <select> si hay opciones
                    <select name={name} {...registro}>
                        <option value="">Seleccione una opción</option>
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
export default Input
//... express