<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once 'conexion.php';

if (!isset($_GET['dni'])) {
    echo json_encode(["status" => "error", "message" => "DNI no proporcionado."]);
    exit;
}

$dni = $_GET['dni'];

$conn = getDbConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT 
    e.id, 
    e.nombre AS nombreEstd, 
    e.apellido AS apellidoEstd, 
    e.dni, 
    e.cuil, 
    e.fechaNacimiento, 
    d.calle, 
    d.numero AS nro, 
    b.nombreBarrio AS barrioEstd, 
    l.localidad AS localidadEstd, 
    p.provincia AS provinciaEstd,
    m.modalidad AS modalidadEstd,
    ap.descripcionAnioPlan AS anioPlanEstd,
    i.fechaInscripcion,
    i.idEstadoInscripcion
FROM inscripciones i
LEFT JOIN estudiantes e ON i.idEstudiante = e.id
LEFT JOIN domicilios d ON e.idDomicilio = d.id
LEFT JOIN barrios b ON d.idBarrio = b.id
LEFT JOIN localidades l ON b.idLocalidad = l.id
LEFT JOIN provincias p ON l.idPcia = p.id
LEFT JOIN modalidades m ON i.idModalidad = m.id
LEFT JOIN anio_plan ap ON i.idAnioPlan = ap.id
WHERE e.dni = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $dni);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $estudiante = $result->fetch_assoc();
    echo json_encode(["status" => "success", "data" => $estudiante]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró el estudiante."]);
}

$stmt->close();
$conn->close();

?>