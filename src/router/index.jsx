import { createBrowserRouter } from "react-router-dom";
import LayoutRoot from "../layouts/LayoutRoot";
import LayoutPrivate from "../layouts/LayoutPrivate";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Preinscripcion from "../pages/Preinscripcion";

export const router = createBrowserRouter([
    {
        path: '/',
        element: (  
                <LayoutRoot />
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'dashboard',
                element: <LayoutPrivate />,
                children:[
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: 'formulario-inscripcion-adm',  // Cambié la ruta aquí
                        element: <Preinscripcion />
                    },
                ]
            },
            {
                path: 'preinscripcion',
                element: <Preinscripcion />
            }
        ]
    }   
])