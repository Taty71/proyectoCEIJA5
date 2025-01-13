import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import Publics from './Routes/Publics';

//import Contacto from './components/Contacto';
import './App.css';

const App = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Publics />
               {/*} <Route path="/" element={<Home />} />
                <Route path="/modalidad" element={<Modalidad />} />
                <Route path="/login" element={<LoginButton/>} />
                <Route path="/register" element={<RegisterButton />} />
                <Route path="/preinscripcion" element={<Preinscripcion />} />*/}
         </BrowserRouter>
    );
};

export default App;
