<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
error_log("Método de solicitud: " . $_SERVER['REQUEST_METHOD']);
require_once 'funciones/manejoArchivos.php'; // Asegúrate de incluir la función manejarArchivos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Datos del estudiante
    $datos = [
        "nombre" => $_POST['nombre'] ?? '',
        "apellido" => $_POST['apellido'] ?? '',
        "dni" => $_POST['dni'] ?? '',
        "cuil" => $_POST['cuil'] ?? '',
        "fechaNacimiento" => $_POST['fechaNacimiento'] ?? '',
        "calle" => $_POST['calle'] ?? '',
        "nro" => $_POST['nro'] ?? '',
        "barrio" => $_POST['barrio'] ?? '',
        "localidad" => $_POST['localidad'] ?? '',
        "pcia" => $_POST['pcia'] ?? '',
        "modalidad" => $_POST['modalidad'] ?? '',
        "planAnio" => $_POST['planAnio'] ?? '',
    ];

    // Especificar los archivos que esperamos recibir y sus extensiones permitidas
    $archivos = [
        "fotoFile" => ["jpg", "jpeg", "png", "gif"],   // Imagen
        "dniFile" => ["pdf", "jpg", "jpeg"],           // Documento PDF o imagen
        "cuilFile" => ["pdf", "jpg", "jpeg"],          // Documento PDF o imagen
        "partidaNacimiento" => ["pdf"],                // Documento PDF
        "fichaMedica" => ["pdf"],                      // Ficha médica en formato PDF
        "tituloFile" => ["pdf", "jpg", "jpeg"],        // Título en formato PDF o imagen
    ];

    $documentacion = manejarArchivos($archivos);

    error_log("Documentación procesada: " . print_r($documentacion, true)); // Log para confirmar la documentación procesada

    // Guardar los documentos procesados
    $datos["documentacion"] = $documentacion;

    // Leer el archivo JSON actual
    $archivoJson = 'inscripciones.json';
    $inscripciones = file_exists($archivoJson) ? json_decode(file_get_contents($archivoJson), true) : [];

    // Agregar la nueva inscripción con los datos y la documentación
    $inscripciones[] = $datos;

    // Guardar el archivo JSON actualizado
    file_put_contents($archivoJson, json_encode($inscripciones, JSON_PRETTY_PRINT));

    // Respuesta al cliente
    echo json_encode(["mensaje" => "Inscripción guardada correctamente."]);
} else {
    echo json_encode(["error" => "Método no permitido"]);
}

?>