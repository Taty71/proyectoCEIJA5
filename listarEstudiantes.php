<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once 'conexion.php';

$conn = getDbConnection();

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT 	e.id,
		        e.nombre,
		        e.apellido,
                e.dni,
                e.cuil,
                e.fechaNacimiento,
                e.foto,
                d.calle,
                d.numero
        FROM estudiantes e
        LEFT JOIN domicilios d ON e.idDomicilio = d.id";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $estudiantes = [];
    while ($row = $result->fetch_assoc()) {
        $estudiantes[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $estudiantes]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontraron estudiantes."]);
}

$conn->close();
?>