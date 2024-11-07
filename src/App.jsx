import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Modalidad from './components/Modalidad';
//import Contacto from './components/Contacto';
import Preinscripcion from './components/Preinscripcion';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/modalidad" element={<Modalidad />} />
             
                <Route path="/preinscripcion" element={<Preinscripcion />} />
            </Routes>
        </Router>
    );
};

export default App;
