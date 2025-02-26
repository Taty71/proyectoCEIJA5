<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$path = 'dataEstudiantes/inscripcionWebEstudiantes.json';

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");


//$fechaInscripcion = date("Y-m-d");

$jsonArray = [
    "nombre" => $_POST['nombre'],
    "apellido" => $_POST['apellido'],
    "dni" => $_POST['dni'],
    "cuil" => $_POST['cuil'],
    "fechaNacimiento" => $_POST['fechaNacimiento'],
    "calle" => $_POST['calle'],
    "numero" => $_POST['nro'],
    "barrio" => $_POST['barrio'],
    "localidad" => $_POST['localidad'],
    "provincia" => $_POST['pcia'],
    "modalidad" => $_POST['modalidad'],
    "planAnio" => $_POST['planAnio']
];

$prettyJsonString = json_encode(value: $jsonArray, flags: JSON_PRETTY_PRINT);

$fpn = fopen(filename: $path, mode: 'a');

fwrite(stream: $fpn, data: $prettyJsonString);

fclose(stream: $fpn);

?>