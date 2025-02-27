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

if (empty($input) || !is_array($input)) {
    echo json_encode(["status" => "error", "message" => "Datos del estudiante no validos."]);
    exit;
}

$nombre = $input['nombre'];
$apellido = $input['apellido'];
$dni = $input['dni'];
$cuil = $input['cuil'];
$fechaNacimiento = $input['fechaNacimiento'];
$numero = $input['nro'];
$calle = $input['calle'];
$barrio = $input['barrio'];


$SQL_UPDATE =  "UPDATE estudiantes e, domicilios d
                SET e.nombre= $nombre,
                    e.apellido = $apellido,
                    e.cuil = $cuil,
                    e.fechaNacimiento = $fechaNacimiento,
                    d.numero = $numero,
                    d.calle = $calle,
                    d.idBarrio = $barrio
                WHERE d.id = e.idDomicilio
                AND e.dni = $dni";

$result = $conn->query($SQL_UPDATE);

if ($conn->query($SQL_UPDATE) === TRUE) {

    echo json_encode(["status" => "success", "message" => "Estudiante actualizado con exito"]);

} else {

    echo json_encode(["status" => "error", "message" => "No se encontro el estudiante."]);

}

$conn->close();

?>