<?php

function obtenerIdLocalidad($localidad, $idPcia) {
    global $conn;

    $stmt = $conn->prepare("SELECT id FROM localidades WHERE localidad = ? AND idPcia = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para localidades: " . $conn->error);
    }
    $stmt->bind_param('si', $localidad, $idPcia);
    $stmt->execute();
    $idLocalidad = null;
    $stmt->bind_result($idLocalidad);
    if (!$stmt->fetch()) {
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO localidades (localidad, idPcia) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta de inserción para localidades: " . $conn->error);
        }
        $stmt->bind_param('si', $localidad, $idPcia);
        $stmt->execute();
        $idLocalidad = $conn->insert_id;
    }
    $stmt->close();

    return $idLocalidad;
}
?>