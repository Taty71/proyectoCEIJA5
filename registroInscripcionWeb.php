<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
error_log("Método de solicitud: " . $_SERVER['REQUEST_METHOD']);
require_once 'funciones/manejoArchivos.php'; // Asegúrate de incluir la función manejarArchivos() del archivo manejoArchivos.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Función para sanitizar datos
    function sanitize($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }

    // Datos del estudiante
    $datos = [
        "nombre" => isset($_POST['nombre']) ? sanitize($_POST['nombre']) : '',
        "apellido" => isset($_POST['apellido']) ? sanitize($_POST['apellido']) : '',
        "dni" => isset($_POST['dni']) ? sanitize($_POST['dni']) : '',
        "cuil" => isset($_POST['cuil']) ? sanitize($_POST['cuil']) : '',
        "fechaNacimiento" => isset($_POST['fechaNacimiento']) ? sanitize($_POST['fechaNacimiento']) : '',
        "calle" => isset($_POST['calle']) ? sanitize($_POST['calle']) : '',
        "nro" => isset($_POST['nro']) ? sanitize($_POST['nro']) : '',
        "barrio" => isset($_POST['barrio']) ? sanitize($_POST['barrio']) : '',
        "localidad" => isset($_POST['localidad']) ? sanitize($_POST['localidad']) : '',
        "pcia" => isset($_POST['pcia']) ? sanitize($_POST['pcia']) : '',
        "modalidad" => isset($_POST['modalidad']) ? sanitize($_POST['modalidad']) : '',
        "planAnio" => isset($_POST['planAnio']) ? sanitize($_POST['planAnio']) : '',
    ];

   
    // Especificar los archivos que esperamos recibir y sus extensiones permitidas
    $archivos = [
        "fotoFile" => ["jpg", "jpeg", "png", "gif"],   // Imagen
        "dniFile" => ["pdf", "jpg", "jpeg"],           // Documento PDF o imagen
        "cuilFile" => ["pdf", "jpg", "jpeg"],  
        "partidaNacimiento"  => ['pdf', 'jpg'],            // Documento PDF o imagen
        "fichaMedica" => ["pdf"],                // Ficha médica en formato PDF
        "tituloFile" => ["pdf", "jpg", "jpeg", "png"], // Título en formato PDF o imagen
    ];

    // Filtrar los archivos que existen en $_FILES
    $archivosExistentes = array_filter($archivos, function($key) {
        if (isset($_FILES[$key])) {
            echo "Archivo recibido: " . $key . " - Nombre: " . $_FILES[$key]['name'] . "\n";
            return true;
        }
        return false;
    }, ARRAY_FILTER_USE_KEY);

    $documentacion = manejarArchivos($archivosExistentes);

    // Leer el archivo JSON actual
    $archivoJson = 'inscripciones.json';
    if (file_exists($archivoJson) && filesize($archivoJson) > 0) {
        $inscripciones = json_decode(file_get_contents($archivoJson), true);
    } else {
        $inscripciones = [];
    }
    $datos["documentacion"] = $documentacion;


    $inscripciones[] = $datos;

    // Guardar el archivo JSON actualizado
    if (file_put_contents($archivoJson, json_encode($inscripciones, JSON_PRETTY_PRINT)) === false) {
        echo json_encode(["error" => "No se pudo guardar la inscripción."]);
        exit;
    }

        echo json_encode(["mensaje" => "Inscripción guardada correctamente."]);
        exit;
    
    echo json_encode(["error" => "Método no permitido"]);
}
?>