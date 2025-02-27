<?php

function insertarEstudiante($nombre, $apellido, $dni, $cuil, $fechaNacimiento, $fotoRuta, $idDomicilio, $idLogin = null) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO estudiantes (nombreEstd, apellidoEstd, dni, cuil, fechaNacimiento, foto, idDomicilio, idLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para estudiantes: " . $conn->error);
    }
    $stmt->bind_param('sssisssi', $nombre, $apellido, $dni, $cuil, $fechaNacimiento, $fotoRuta, $idDomicilio, $idLogin);
    $stmt->execute();
    $idEstudiante = $conn->insert_id;
    $stmt->close();

    return $idEstudiante;
}
?>