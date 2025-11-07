const db = require('./db');

async function verificarDNI(dni) {
    try {
        console.log(`\n🔍 Verificando DNI: ${dni}`);
        
        // 1. Estudiante
        const [estudiante] = await db.query('SELECT * FROM estudiantes WHERE dni = ?', [dni]);
        console.log('\n📋 ESTUDIANTE:');
        console.log(estudiante[0] || 'No encontrado');
        
        if (estudiante.length > 0) {
            const idEstudiante = estudiante[0].id;
            
            // 2. Inscripciones
            const [inscripciones] = await db.query('SELECT * FROM inscripciones WHERE idEstudiante = ?', [idEstudiante]);
            console.log('\n📚 INSCRIPCIONES:', inscripciones.length);
            console.log(inscripciones);
            
            if (inscripciones.length > 0) {
                const idInscripcion = inscripciones[0].id;
                
                // 3. Detalle inscripción
                const [detalles] = await db.query(`
                    SELECT di.*, d.descripcionDocumentacion 
                    FROM detalle_inscripcion di
                    JOIN documentaciones d ON di.idDocumentaciones = d.id
                    WHERE di.idInscripcion = ?
                `, [idInscripcion]);
                console.log('\n📎 DETALLE INSCRIPCIÓN:', detalles.length);
                console.log(detalles);
            }
            
            // 4. Archivos estudiantes
            const [archivos] = await db.query('SELECT * FROM archivos_estudiantes WHERE idEstudiante = ?', [idEstudiante]);
            console.log('\n📁 ARCHIVOS ESTUDIANTES:', archivos.length);
            console.log(archivos);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verificarDNI('46123325');
