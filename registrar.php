<?php
include 'conexion.php';


$data = json_decode(file_get_contents("php://input"));

$nombre = $data->nombre;
$dni = $data->dni;
$cuil = $data->cuil;
$fechaNacimiento = $data->fechaNacimiento;
$direccion = $data->direccion;
$plan = $data->plan;
$modalidad = $data->modalidad;

$query = $conn->prepare("INSERT INTO inscripciones (nombre, dni, cuil, fechaNacimiento, direccion, plan, modalidad) VALUES (?, ?, ?, ?, ?, ?, ?)");
$query->bind_param("sssssss", $nombre, $dni, $cuil, $fechaNacimiento, $direccion, $plan, $modalidad);

if ($query->execute()) {
    echo json_encode(["status" => "success", "message" => "Inscripción registrada correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al registrar la inscripción"]);
}
?>
