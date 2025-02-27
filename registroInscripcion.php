<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once 'conexion.php';
require_once './funciones/manejoArchivos.php';
require_once './funciones/obtenerProvincias.php';
require_once './funciones/obtenerLocalidad.php';
require_once './funciones/obtenerBarrio.php';
require_once './funciones/insertarDomicilios.php';
require_once './funciones/insertarEstudiantes.php';
require_once './funciones/insertarInscripcion.php';
require_once './funciones/insertarDetalleInscripcion.php';

$conn = getDbConnection();
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Error al conectar a la base de datos: " . $conn->connect_error]);
    exit;
}

function obtenerIdTDocumentacion($tipoDocumento, $titulo = null) {
    $documentos = [
        'dni' => 1,
        'cuil' => 2,
        'fichaMedica' => 3,
        'partidaNacimiento' => 4,
        'titulo' => 5,
        'NivelPrimario' => 6,
        'AnaliticoProvisorio' => 7,
        'SolicitudPase' => 8,
        'foto' => 13,
    ];

    if ($tipoDocumento === 'archivoTitulo' && $titulo !== null) {
        return $documentos[$titulo] ?? null;
    }

    return $documentos[$tipoDocumento] ?? null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar y recibir datos
    $nombre = $_POST['nombre'] ?? null;
    $apellido = $_POST['apellido'] ?? null;
    $dni = $_POST['dni'] ?? null;
    $cuil = $_POST['cuil'] ?? null;
    $fechaNacimiento = $_POST['fechaNacimiento'] ?? null;
    $calle = $_POST['calle'] ?? null;
    $numero = $_POST['nro'] ?? null;
    $barrio = $_POST['barrio'] ?? null;
    $localidad = $_POST['localidad'] ?? null;
    $provincia = $_POST['provincia'] ?? null;
    $modalidad = $_POST['modalidad'] ?? null;
    $planAnio = $_POST['planAnio'] ?? null;

    if (!$nombre || !$apellido || !$dni || !$cuil || !$fechaNacimiento || !$calle || !$numero || !$barrio || !$localidad || !$provincia || !$modalidad || !$planAnio || !isset($_FILES['foto'])) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        $conn->close();
        exit;
    }

    // Manejo de archivos
    $archivos = [
        'foto' => ['jpg', 'jpeg', 'png'],
        'dni' => ['pdf', 'jpg'],
        'cuil' => ['pdf', 'jpg'],
        'partidaNacimiento' => ['pdf', 'jpg'],
        'fichaMedica' => ['pdf', 'jpg'],
        'archivoTitulo' => ['pdf', 'jpg']
    ];

    $archivosExistentes = array_filter($archivos, function($key) {
        return isset($_FILES[$key]);
    }, ARRAY_FILTER_USE_KEY);

    $rutas = manejarArchivos($archivosExistentes);

    // Manejo de la transacción
    $conn->begin_transaction();

    try {
        $idPcia = obtenerIdProvincia($provincia);
        $idLocalidad = obtenerIdLocalidad($localidad, $idPcia);
        $idBarrio = obtenerIdBarrio($barrio, $idLocalidad);
        $idDomicilio = insertarDomicilio($calle, $numero, $idBarrio);
        $fotoRuta = $rutas['foto'];
        $idEstudiante = insertarEstudiante($nombre, $apellido, $dni, $cuil, $fechaNacimiento, $fotoRuta, $idDomicilio);
        $fechaInscripcion = date('Y-m-d');
        $idInscripcion = insertarInscripcion($idEstudiante, $fechaInscripcion, $modalidad, $planAnio);
        insertarDetalleInscripciones($idInscripcion, $archivos,$fechaInscripcion, 'Entregado');

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Datos registrados exitosamente"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Error al guardar los datos: " . $e->getMessage()]);
    } finally {
        $conn->close();
    }
}
?>