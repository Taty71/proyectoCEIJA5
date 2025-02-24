import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
const UserContext = createContext();


// ✅ Hook para usar el contexto
export const useUserContext = () => {return useContext(UserContext);};
// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    /*const login = (userData) => {
        setUser(userData);
    };
    const logout = () => {
        setUser(null);
    };*/
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};  