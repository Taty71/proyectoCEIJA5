if (isset($_POST['materias'])) {
    $materiasSeleccionadas = $_POST['materias']; // Array con los ids de las materias seleccionadas
    $idEstudiante = $_POST['idEstudiante']; // El ID del estudiante que se inscribe
    $fechaInscripcion = date('Y-m-d'); // La fecha de inscripción actual
    $modalidad = $_POST['modalidad']; // Modalidad (presencial o semipresencial)
    $estadoDocumentacion = 'Entregado'; // El estado de la documentación (ejemplo)

    // Insertar en la tabla 'inscripciones' (como antes)
    $stmt = $conn->prepare("INSERT INTO inscripciones (idEstudiante, fechaInscripcion, idModalidad, idEstadoInscripcion) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('issi', $idEstudiante, $fechaInscripcion, $modalidad, $idEstadoInscripcion);
    $stmt->execute();
    $idInscripcion = $conn->insert_id; // El ID de la inscripción recién registrada
    $stmt->close();

    // Insertar las materias seleccionadas en la tabla 'detalle_inscripciones'
    foreach ($materiasSeleccionadas as $idMateria) {
        $stmt = $conn->prepare("INSERT INTO detalle_inscripciones (idInscripcion, idMateria, estadoDocumentacion, fechaEntrega) VALUES (?, ?, ?, ?)");
        $fechaEntrega = date('Y-m-d'); // Puedes usar la fecha actual o una fecha específica
        $stmt->bind_param('iiss', $idInscripcion, $idMateria, $estadoDocumentacion, $fechaEntrega);
        $stmt->execute();
        $stmt->close();
    }

    echo "Inscripción completada exitosamente.";
}
