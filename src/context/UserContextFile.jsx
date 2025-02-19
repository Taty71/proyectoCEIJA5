import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
const UserContext = createContext();


// ✅ Hook para usar el contexto
export const useUserContext = () => {return useContext(UserContext);};
// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null; // Leer el usuario desde localStorage si existe
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user)); // Guardar el usuario en localStorage
        } else {
            localStorage.removeItem("user"); // Limpiar el localStorage si no hay usuario
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children} {/* Proporciona el contexto a los componentes hijos */}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};  