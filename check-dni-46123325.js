const db = require('./db');

async function checkDni() {
    try {
        console.log('🔍 Verificando DNI 46123325 en base de datos...\n');
        
        // 1. Buscar estudiante
        const [estudiantes] = await db.query(
            'SELECT * FROM estudiantes WHERE dni = ?',
            ['46123325']
        );
        
        if (estudiantes.length === 0) {
            console.log('❌ Estudiante con DNI 46123325 NO encontrado en BD');
            console.log('   El registro NO se guardó en la base de datos');
        } else {
            const estudiante = estudiantes[0];
            console.log('✅ Estudiante encontrado en BD:');
            console.log('   ID:', estudiante.idEstudiante);
            console.log('   Nombre:', estudiante.nombre, estudiante.apellido);
            console.log('   DNI:', estudiante.dni);
            console.log('   Email:', estudiante.email);
            
            // 2. Buscar inscripciones
            const [inscripciones] = await db.query(
                'SELECT * FROM inscripciones WHERE idEstudiante = ?',
                [estudiante.idEstudiante]
            );
            
            console.log('\n📋 Inscripciones:', inscripciones.length);
            inscripciones.forEach((insc, idx) => {
                console.log(`   ${idx + 1}. ID: ${insc.idInscripcion}, idModulos: ${insc.idModulos}, Estado: ${insc.idEstadoInscripcion}`);
            });
            
            // 3. Buscar archivos
            const [archivos] = await db.query(
                'SELECT * FROM archivos_estudiantes WHERE idEstudiante = ?',
                [estudiante.idEstudiante]
            );
            
            console.log('\n📁 Archivos:', archivos.length);
            archivos.forEach((arch, idx) => {
                console.log(`   ${idx + 1}. Tipo: ${arch.tipoDocumento}, Ruta: ${arch.rutaArchivo}`);
            });
        }
        
        await db.end();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await db.end();
        process.exit(1);
    }
}

checkDni();
