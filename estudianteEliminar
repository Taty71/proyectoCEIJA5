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

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input)) {
    echo json_encode(["status" => "error", "message" => "Valor vacio."]);
    exit;
}

$dni = $input['dni'];

$SQL_UPDATE = "UPDATE estudiantes e
               SET e.activo = 0 
               WHERE e.dni = $dni";

$result = $conn->query($SQL_UPDATE);

if ($conn->query($SQL_UPDATE) === TRUE) {

    echo json_encode(["status" => "success", "message" => "Estudiante eliminado con exito"]);

} else {

    echo json_encode(["status" => "error", "message" => "No se encontro el estudiante."]);

}

$conn->close();

?>