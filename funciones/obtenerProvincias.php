<?php

function obtenerIdProvincia($provincia) {
    global $conn;

    $stmt = $conn->prepare("SELECT id FROM provincias WHERE provincia = ?");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para provincias: " . $conn->error);
    }
    $stmt->bind_param('s', $provincia);
    $stmt->execute();
    $idPcia = null;
    $stmt->bind_result($idPcia);
    if (!$stmt->fetch()) {
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO provincias (provincia) VALUES (?)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta de inserción para provincias: " . $conn->error);
        }
        $stmt->bind_param('s', $provincia);
        $stmt->execute();
        $idPcia = $conn->insert_id;
    }
    $stmt->close();

    return $idPcia;
}
?>