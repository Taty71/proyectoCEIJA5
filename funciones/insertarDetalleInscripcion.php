<?php

function insertarDetalleInscripciones($idInscripcion, $archivos, $fechaEntrega, $estadoDocumentacion) {
    global $conn;

    // Repite para cada tipo de documentación requerida
    foreach ($archivos as $tipoDocumento => $extensiones) {
        if ($tipoDocumento === 'foto') {
            continue; // Excluir foto del proceso de inserción en detalle_inscripciones
        }
        $idTDocumentacion = obtenerIdTDocumentacion($tipoDocumento); // Pasamos $titulo a la función
        if ($idTDocumentacion) {
            $stmt = $conn->prepare("INSERT INTO detalle_inscripciones (idInscripcion, idTDocumentacion, estadoDocumentación, fechaEntrega) VALUES (?, ?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Error al preparar la consulta para detalle_inscripciones: " . $conn->error);
            }
            $stmt->bind_param('iiss', $idInscripcion, $idTDocumentacion, $estadoDocumentacion, $fechaEntrega);
            $stmt->execute();
            $stmt->close();
        } else {
            throw new Exception("No se pudo encontrar el idTDocumentacion para el tipo de documento: " . $tipoDocumento);
        }
    }

    // Insertar las materias seleccionadas en la tabla 'detalle_inscripcionesMatricula'
   /* if ($materiasSeleccionadas) {
        foreach ($materiasSeleccionadas as $idMateria) {
            $stmt = $conn->prepare("INSERT INTO detalle_inscripciones (idInscripcion, idMateria, estadoDocumentacion, fechaEntrega) VALUES (?, ?, ?, ?)");
            $stmt->bind_param('iiss', $idInscripcion, $idMateria, $estadoDocumentacion, $fechaEntrega);
            $stmt->execute();
            $stmt->close();
        }
    }*/
}
?>