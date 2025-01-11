import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Publics from './Routes/Publics';

//import Contacto from './components/Contacto';
import './App.css';

const App = () => {
    return (
        <Router>
           <Publics />
               {/*} <Route path="/" element={<Home />} />
                <Route path="/modalidad" element={<Modalidad />} />
                <Route path="/login" element={<LoginButton/>} />
                <Route path="/register" element={<RegisterButton />} />
                <Route path="/preinscripcion" element={<Preinscripcion />} />*/}
               
           
        </Router>
    );
};

export default App;
