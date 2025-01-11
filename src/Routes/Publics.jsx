import React from 'react';

import Home from '../pages/Home';
import { Routes, Route, Navigate} from "react-router-dom";
import Modalidad from '../components/Modalidad';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import Preinscripcion from '../pages/Preinscripcion';
import ListaEstudiantes from '../pages/ListaEstudiantes';
const Publics = () => {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                
                <Route path="/modalidad" element={<Modalidad />} />
                <Route path="/login" element={<LoginButton/>} />
                <Route path="/register" element={<RegisterButton />} />
                <Route path="/preinscripcion" element={<Preinscripcion />} />
                <Route path="/consultar" element={<ListaEstudiantes />} />
            </Routes>
    );
};
export default Publics;