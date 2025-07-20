require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

// Importa las rutas
const modalidadesRoutes = require('./routes/modalidades');
const planCursoRoutes = require('./routes/planCurso');
const modulosRoutes = require('./routes/modulos');
const userRoutes = require('./routes/users');
const areasRoutes = require('./routes/areas');
const materiasRoutes = require('./routes/materias');
const estadosInscripcionRoutes = require('./routes/estadosInscripcion');
const registroEstRoutes = require('./routes/registroEst');
const faltantesRoutes = require('./routes/faltantes');
const consultarEstdInscriptosRoutes = require('./routes/consultarEstdInscriptos');
const datosInsRoutes = require('./routes/datosIns');
const datosDomicilioRoutes = require('./routes/datosDomicilio');
const modificarEstRoutes = require('./routes/modificarEst');
const eliminarEstRoutes = require('./routes/eliminarEst'); // Importa la ruta
const documentacionRoutes = require('./routes/buscarDocumentacion');

const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// en app.js o server.js, antes de las rutas

app.use(
  '/archivosDocumentacion',                              // URL pública
  express.static(path.join(__dirname, 'archivosDocumentacion')) // carpeta real
);

// También servir desde archivosDocumento (sin 's') para compatibilidad
app.use(
  '/archivosDocumento',                              // URL pública
  express.static(path.join(__dirname, 'archivosDocumento')) // carpeta real
);


// Rutas
app.use('/api/users', userRoutes);
app.use('/api/modalidades', modalidadesRoutes);
app.use('/api/planes', planCursoRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/estados-inscripcion', estadosInscripcionRoutes);
app.use('/api/estudiantes', registroEstRoutes);
app.use('/api/faltantes', faltantesRoutes);
app.use('/api/consultar-estudiantes', consultarEstdInscriptosRoutes);
app.use('/api/consultar-estudiantes-dni', datosInsRoutes);
app.use('/api/datos-domicilio', datosDomicilioRoutes);
app.use('/api/modificar-estudiante', modificarEstRoutes);
app.use('/api/eliminar-estudiante', eliminarEstRoutes); // Registra la ruta bajo el prefijo /api
app.use('/api/documentacion', documentacionRoutes);

// Middleware para manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
});

// Ruta de prueba
app.get('/', (_req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});