import { NavLink, Navigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";
import '../estilos/navMain.css';

const NavMain = () => {
    const context = useUserContext();

    if (!context || !context.user) {
        console.error("UserContext is not available");
        return <Navigate to="/" replace />;
    }

    const { user, setUser } = context;

    return (
        <nav className="nav-main">
            <div className="nav-links">
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/dashboard">Panel-Administracion CEIJA5</NavLink>
            </div>
            <div className="nav-user">
                <span className="user-name">Bienvenido, {user.nombre}</span>
                <button
                    className="logout-button"
                    onClick={() => {
                        setUser(null);
                        localStorage.removeItem("user"); // Limpia el usuario en localStorage
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavMain;