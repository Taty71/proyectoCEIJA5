<?php

function insertarInscripcion($idEstudiante, $fechaInscripcion, $modalidad, $planAnio) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO inscripciones (idEstudiante, fechaInscripcion, modalidad, planAnio) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta de inserción para inscripciones: " . $conn->error);
    }
    $stmt->bind_param('issi', $idEstudiante, $fechaInscripcion, $modalidad, $planAnio);
    $stmt->execute();
    $idInscripcion = $conn->insert_id;
    $stmt->close();

    return $idInscripcion;
}
?>