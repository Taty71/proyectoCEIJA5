<?php

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once '../conexion.php';

$conn = getDbConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

function getMaterias($anioPlan, $modulo) {
    global $conn;

    $query = "SELECT * FROM materias WHERE idAnioPlan = ?";
    if ($modulo !== null) {
        $query .= " AND idModulo = ?";
    }

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para materias: " . $conn->error);
    }

    if ($modulo !== null) {
        $stmt->bind_param('ii', $anioPlan, $modulo);
    } else {
        $stmt->bind_param('i', $anioPlan);
    }

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
    $anioPlan = $_GET['idAnioPlan'] ?? null;
    $modulo = $_GET['idModulo'] ?? null;

    if (!$anioPlan) {
        echo json_encode(["status" => "error", "message" => "Faltan parámetros obligatorios"]);
        exit;
    }

    try {
        $materias = getMaterias($anioPlan, $modulo);
        echo json_encode(["status" => "success", "data" => $materias]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al obtener las materias: " . $e->getMessage()]);
    }
}

$conn->close();
?>