import { NavLink, Navigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";
import '../estilos/navMain.css';

const NavMain = () => {
    const context = useUserContext();  
    console.log("Context in NavMain:", context); // 🔍 Verifica si el contexto está disponible

    if (!context || !context.user) {
        console.error("UserContext is not available");
        return <Navigate to="/" replace />;
    }

    const { user, setUser } = context;
    console.log(user, "en NavMain");

    return (
        <nav>
            <NavLink to="/">Inicio</NavLink>
            {user && (
                <>
                    <NavLink to="/dashboard">Panel-Administracion CEIJA5</NavLink>
                    <button onClick={() => {
                        setUser(null);
                        localStorage.removeItem("user"); // Limpia el usuario en localStorage
                    }}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default NavMain;