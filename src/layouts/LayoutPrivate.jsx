import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContextFile";

const LayoutPrivate = () => {
    const { user } = useUserContext();

    if (!user) {
        return <Navigate to="/" replace />; // 🔥 Si no hay usuario, redirigir al inicio
    }

    return <Outlet />;  // ✅ Si hay usuario, carga el contenido del dashboard
};

export default LayoutPrivate;


