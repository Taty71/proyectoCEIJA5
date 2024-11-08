import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Modalidad from './components/Modalidad';
import LoginButton from './components/LoginButton';
import RegisterButton from './components/RegisterButton';
//import Contacto from './components/Contacto';
import Preinscripcion from './components/Preinscripcion';
import './EstilosC.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/modalidad" element={<Modalidad />} />
                <Route path="/login" element={<LoginButton/>} />
                <Route path="/register" element={<RegisterButton />} />
                <Route path="/preinscripcion" element={<Preinscripcion />} />
            </Routes>
        </Router>
    );
};

export default App;
