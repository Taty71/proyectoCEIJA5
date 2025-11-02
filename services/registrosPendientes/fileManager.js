const fs = require('fs').promises;
const path = require('path');
const { REGISTROS_PENDIENTES_PATH, ARCHIVOS_PENDIENTES_PATH, ARCHIVOS_DOCUMENTO_PATH } = require('./config');

// Función para asegurar que existe el directorio y el archivo
const ensureFileExists = async () => {
    const dir = path.dirname(REGISTROS_PENDIENTES_PATH);
    
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
    
    try {
        await fs.access(REGISTROS_PENDIENTES_PATH);
    } catch {
        await fs.writeFile(REGISTROS_PENDIENTES_PATH, '[]', 'utf8');
    }
};

// Función para leer registros pendientes
const leerRegistrosPendientes = async () => {
    await ensureFileExists();
    const data = await fs.readFile(REGISTROS_PENDIENTES_PATH, 'utf8');
    return JSON.parse(data);
};

// Función para guardar registros pendientes
const guardarRegistrosPendientes = async (registros) => {
    await ensureFileExists();
    await fs.writeFile(REGISTROS_PENDIENTES_PATH, JSON.stringify(registros, null, 2), 'utf8');
};

// Función para migrar archivo de archivosPendientes a archivosDocumento
const migrarArchivo = async (archivoPath, nuevoNombre) => {
    try {
        const archivoCompleto = path.join(ARCHIVOS_PENDIENTES_PATH, archivoPath.replace('/archivosPendientes/', ''));
        const destinoCompleto = path.join(ARCHIVOS_DOCUMENTO_PATH, nuevoNombre);
        
        console.log(`📂 [migración] ${archivoCompleto} → ${destinoCompleto}`);
        
        // Verificar que el archivo de origen existe
        await fs.access(archivoCompleto);
        
        // Asegurar que el directorio de destino existe
        await fs.mkdir(path.dirname(destinoCompleto), { recursive: true });
        
        // Copiar archivo
        await fs.copyFile(archivoCompleto, destinoCompleto);
        
        // Eliminar archivo original
        await fs.unlink(archivoCompleto);
        
        console.log(`✅ [migración] Archivo migrado exitosamente`);
        return `/archivosDocumento/${nuevoNombre}`;
    } catch (error) {
        console.error(`❌ [migración] Error al migrar archivo:`, error);
        throw error;
    }
};

// Función para detectar archivos disponibles en archivosPendientes
const detectarArchivosDisponibles = async (registro) => {
    const archivosDisponibles = {};
    
    try {
        const archivosEnPendientes = await fs.readdir(ARCHIVOS_PENDIENTES_PATH);
        const prefijoBusqueda = `${registro.datos.nombre}_${registro.datos.apellido}_${registro.dni}_`;
        
        console.log(`🔍 [detección] Buscando archivos con prefijo: ${prefijoBusqueda}`);
        
        const archivosCoincidentes = archivosEnPendientes.filter(archivo => 
            archivo.startsWith(prefijoBusqueda)
        );
        
        console.log(`📁 [detección] Archivos encontrados: ${archivosCoincidentes.length}`);
        
        // Mapear archivos encontrados a los campos esperados
        archivosCoincidentes.forEach(archivo => {
            const sinPrefijo = archivo.replace(prefijoBusqueda, '');
            const campo = sinPrefijo.substring(0, sinPrefijo.lastIndexOf('.')) || sinPrefijo;
            
            archivosDisponibles[campo] = `/archivosPendientes/${archivo}`;
            console.log(`   ✅ ${campo}: ${archivo}`);
        });
        
        // También incluir archivos que ya están en el registro
        if (registro.archivos) {
            Object.keys(registro.archivos).forEach(campo => {
                if (!archivosDisponibles[campo]) {
                    archivosDisponibles[campo] = registro.archivos[campo];
                    console.log(`   📋 ${campo}: desde registro existente`);
                }
            });
        }
        
    } catch (error) {
        console.error('❌ [detección] Error al detectar archivos:', error);
    }
    
    return archivosDisponibles;
};

// Función para migrar todos los archivos de un registro
const migrarArchivosRegistro = async (registro, archivosDisponibles) => {
    const archivosMigrados = {};
    
    for (const [campo, rutaArchivo] of Object.entries(archivosDisponibles)) {
        if (rutaArchivo && rutaArchivo.includes('/archivosPendientes/')) {
            try {
                const nombreArchivo = path.basename(rutaArchivo);
                const nuevaRuta = await migrarArchivo(rutaArchivo, nombreArchivo);
                archivosMigrados[campo] = nuevaRuta;
                console.log(`✅ [migración] ${campo}: ${rutaArchivo} → ${nuevaRuta}`);
            } catch (error) {
                console.error(`❌ [migración] Error al migrar ${campo}:`, error);
                // Mantener la ruta original si falla la migración
                archivosMigrados[campo] = rutaArchivo;
            }
        } else {
            // Archivo ya migrado o no existe
            archivosMigrados[campo] = rutaArchivo;
        }
    }
    
    return archivosMigrados;
};

module.exports = {
    ensureFileExists,
    leerRegistrosPendientes,
    guardarRegistrosPendientes,
    migrarArchivo,
    detectarArchivosDisponibles,
    migrarArchivosRegistro
};