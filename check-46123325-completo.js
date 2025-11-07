const db = require('./db');

async function checkCompleto() {
    try {
        console.log('🔍 === VERIFICACIÓN COMPLETA DNI 46123325 ===\n');
        
        // 1. Estudiante
        const [estudiantes] = await db.query(
            'SELECT * FROM estudiantes WHERE dni = ?',
            ['46123325']
        );
        
        if (estudiantes.length === 0) {
            console.log('❌ Estudiante NO encontrado');
            await db.end();
            return;
        }
        
        const est = estudiantes[0];
        console.log('✅ ESTUDIANTE (ID:', est.id + ')');
        console.log('   Nombre:', est.nombre, est.apellido);
        console.log('   DNI:', est.dni);
        console.log('   CUIL:', est.cuil);
        console.log('   Email:', est.email);
        console.log('   Teléfono:', est.telefono);
        console.log('   Fecha Nacimiento:', est.fechaNacimiento);
        console.log('   Tipo Documento:', est.tipoDocumento);
        console.log('   País Emisión:', est.paisEmision, est.paisEmision === null ? '❌ NULL' : '✅');
        console.log('   Foto:', est.foto, est.foto === null ? '❌ NULL' : '✅');
        console.log('   idDomicilio:', est.idDomicilio);
        
        // 2. Domicilio
        const [domicilios] = await db.query(
            'SELECT * FROM domicilios WHERE id = ?',
            [est.idDomicilio]
        );
        
        if (domicilios.length > 0) {
            const dom = domicilios[0];
            console.log('\n✅ DOMICILIO (ID:', dom.id + ')');
            console.log('   Calle:', dom.calle);
            console.log('   Número:', dom.numero);
            console.log('   Barrio ID:', dom.idBarrio);
        }
        
        // 3. Inscripciones
        const [inscripciones] = await db.query(
            'SELECT * FROM inscripciones WHERE idEstudiante = ?',
            [est.id]
        );
        
        console.log('\n✅ INSCRIPCIONES:', inscripciones.length);
        inscripciones.forEach((insc, idx) => {
            console.log(`   ${idx + 1}. ID: ${insc.id}`);
            console.log('      Fecha:', insc.fechaInscripcion);
            console.log('      Modalidad:', insc.idModalidad);
            console.log('      Año/Plan:', insc.idAnioPlan);
            console.log('      Módulos:', insc.idModulos, insc.idModulos === 6 ? '✅' : '❌');
            console.log('      Estado:', insc.idEstadoInscripcion);
        });
        
        // 4. Archivos estudiantes (tabla archivos_estudiantes)
        const [archivos] = await db.query(
            'SELECT * FROM archivos_estudiantes WHERE idEstudiante = ?',
            [est.id]
        );
        
        console.log('\n✅ ARCHIVOS_ESTUDIANTES:', archivos.length);
        archivos.forEach((arch, idx) => {
            console.log(`   ${idx + 1}. Tipo: ${arch.tipoDocumento}`);
            console.log('      Ruta:', arch.rutaArchivo);
        });
        
        // 5. Detalle inscripción (si existe)
        if (inscripciones.length > 0) {
            const [detalles] = await db.query(
                'SELECT * FROM detalle_inscripcion WHERE idInscripcion = ?',
                [inscripciones[0].id]
            );
            
            console.log('\n✅ DETALLE_INSCRIPCION:', detalles.length);
            detalles.forEach((det, idx) => {
                console.log(`   ${idx + 1}. idInscripcion: ${det.idInscripcion}`);
                console.log('      Documento:', det.nombreDocumento);
                console.log('      Ruta:', det.rutaDocumento);
            });
        }
        
        await db.end();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await db.end();
        process.exit(1);
    }
}

checkCompleto();
