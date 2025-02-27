<?php

function insertarDomicilio($calle, $numero, $idBarrio) {
    global $conn;

    $stmt = $conn->prepare("INSERT INTO domicilios (calle, nro, idBarrio) VALUES (?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para domicilios: " . $conn->error);
    }
    $stmt->bind_param('sii', $calle, $numero, $idBarrio);
    $stmt->execute();
    $idDomicilio = $conn->insert_id;
    $stmt->close();

    return $idDomicilio;
}
?>