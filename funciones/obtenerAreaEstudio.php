<?php

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once '../conexion.php';

$conn = getDbConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

function getAreasEstudio($idModulo) {
    global $conn;

    $query = "SELECT id, nombre FROM area_estudio WHERE idModulo = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para áreas de estudio: " . $conn->error);
    }

    $stmt->bind_param('i', $idModulo);
    $stmt->execute();
    $result = $stmt->get_result();

    $areasEstudio = [];
    while ($row = $result->fetch_assoc()) {
        $areasEstudio[] = $row;
    }

    $stmt->close();
    return $areasEstudio;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $idModulo = isset($_GET['idModulo']) ? intval($_GET['idModulo']) : null;

    
    if (!$idModulo) {
        echo json_encode(["status" => "error", "message" => "Faltan parámetros obligatorios"]);
        exit;
    }

    try {
        $areasEstudio = getAreasEstudio($idModulo);
        echo json_encode(["status" => "success", "data" => $areasEstudio]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al obtener las áreas de estudio: " . $e->getMessage()]);
    }
}

$conn->close();
?>