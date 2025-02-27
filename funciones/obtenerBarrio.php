<?php

function obtenerIdBarrio($barrio, $idLocalidad) {
    global $conn;

    $stmt = $conn->prepare("SELECT id FROM barrios WHERE nombreBarrio = ? AND idLocalidad = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para barrios: " . $conn->error);
    }
    $stmt->bind_param('si', $barrio, $idLocalidad);
    $stmt->execute();
    $idBarrio = null;
    $stmt->bind_result($idBarrio);
    if (!$stmt->fetch()) {
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO barrios (nombreBarrio, idLocalidad) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta de inserción para barrios: " . $conn->error);
        }
        $stmt->bind_param('si', $barrio, $idLocalidad);
        $stmt->execute();
        $idBarrio = $conn->insert_id;
    }
    $stmt->close();

    return $idBarrio;
}
?>