<?php

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once '../conexion.php';

$conn = getDbConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

function getMateriasPorArea($idAreaEstudio) {
    global $conn;

    $query = "SELECT id, materia, idAreaEstudio, idAnioPlan, idModalidad, idModulo FROM materias WHERE idAreaEstudio = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para materias: " . $conn->error);
    }

    $stmt->bind_param('i', $idAreaEstudio);
    $stmt->execute();
    $result = $stmt->get_result();

    $materias = [];
    while ($row = $result->fetch_assoc()) {
        $materias[] = $row;
    }

    $stmt->close();
    return $materias;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $idAreaEstudio = isset($_GET['idAreaEstudio']) ? intval($_GET['idAreaEstudio']) : null;
      // Para ver si el parámetro se recibe correctamente
        if (!$idAreaEstudio) {
            echo json_encode(["status" => "error", "message" => "Faltan parámetros obligatorios"]);
        exit;
}

    try {
        $materias = getMateriasPorArea($idAreaEstudio);
        echo json_encode(["status" => "success", "data" => $materias]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al obtener las materias: " . $e->getMessage()]);
    }
}

$conn->close();
?>