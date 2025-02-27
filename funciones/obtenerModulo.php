<?php

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once '../conexion.php';

$conn = getDbConnection();

// Verificar la conexión con la base de datos
if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al conectar a la base de datos: " . $conn->connect_error
    ]);
    exit;
}

// Función para obtener los módulos
function getModulos($modalidad) {
    global $conn;

    // Consulta SQL para obtener módulos por modalidad
    $query = "SELECT id, nombre FROM modulos WHERE idModalidad = ? AND id <> 10"; // Excluir módulo con id = 10
    $stmt = $conn->prepare($query);

    // Verificar si la consulta se prepara correctamente
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para módulos: " . $conn->error);
    }

    // Enlazar parámetro de modalidad a la consulta preparada
    $stmt->bind_param('i', $modalidad);
    $stmt->execute();
    $result = $stmt->get_result();

    $modulos = [];
    
    // Recorrer los resultados y almacenar los módulos en un array
    while ($row = $result->fetch_assoc()) {
        $modulos[] = $row;
    }
   
    // Cerrar la consulta y devolver los módulos
    $stmt->close();
    return $modulos;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $modalidad = isset($_GET['modalidad']) ? intval($_GET['modalidad']) : null;

    if (!$modalidad) {
        echo json_encode([
            "status" => "error",
            "message" => "Faltan parámetros obligatorios o el parámetro 'modalidad' no es válido"
        ]);
        exit;
    }

    try {
        $modulos = getModulos($modalidad);

        // Si se encontraron módulos, devolver solo el array de módulos en la respuesta
        echo json_encode($modulos);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener los módulos: " . $e->getMessage()
        ]);
    }
}
