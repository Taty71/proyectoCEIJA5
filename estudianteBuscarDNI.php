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

$dni = $_GET['dni'];

$SQL_SELECT = "SELECT 	e.id,
                            e.nombre,
                            e.apellido,
                            e.dni,
                            e.cuil,
                            e.fechaNacimiento,
                            d.calle,
                            d.numero,
                            b.nombre as barrio,
                            l.nombre as localidad,
                            p.nombre as provincia,
                            ap.descripcionAnioPlan as anioPlan,
                            m.modalidad        
                FROM estudiantes e
                LEFT JOIN domicilios d ON e.idDomicilio = d.id
                LEFT JOIN barrios b ON d.idBarrio = b.id
                LEFT JOIN localidades l ON b.idLocalidad = l.id
                LEFT JOIN provincias p ON l.idProvincia = p.id
                LEFT JOIN inscripciones i ON e.id = i.idEstudiante
                LEFT JOIN anio_plan ap ON i.idAnioPlan = ap.id
                LEFT JOIN modalidades m ON i.idModalidad = m.id
                WHERE dni = $dni";

$result = $conn->query($SQL_SELECT);

if ($result->num_rows > 0) {

    $estudiante = $result->fetch_assoc();

    echo json_encode(["status" => "success", "data" => $estudiante]);

} else {

    echo json_encode(["status" => "error", "message" => "No se encontraron estudiantes."]);

}

$conn->close();

?>