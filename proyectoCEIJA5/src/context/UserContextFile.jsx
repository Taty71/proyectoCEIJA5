import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        nombre: '',
        rol: '',
        email: '', // Inicializa el email como una cadena vacía
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Exportar el contexto para usarlo en otros archivos
export { UserContext };