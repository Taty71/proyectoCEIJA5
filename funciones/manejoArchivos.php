<?php
function manejarArchivos($camposConExtensiones) {
    $rutas = [];

    foreach ($camposConExtensiones as $campo => $extensiones) {
        try {
            $ruta = manejarArchivo($campo, $extensiones);
            if (!$ruta) {
                throw new Exception("El archivo {$campo} no fue entregado.");
            }
            $rutas[$campo] = $ruta;
        } catch (Exception $e) {
            die(json_encode(["status" => "error", "message" => $e->getMessage()]));
        }
    }

    return $rutas;
}

function manejarArchivo($campo, $extensionesPermitidas) {
    if (!isset($_FILES[$campo])) {
        throw new Exception("No se encontró el archivo $campo.");
    }

    if ($_FILES[$campo]['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Error en la subida del archivo $campo. Código: " . $_FILES[$campo]['error']);
    }

    $uploadDir = 'uploads/';
    
    // Intentar crear la carpeta si no existe
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("No se pudo crear el directorio $uploadDir");
        }
    }

    // Verificar permisos de escritura
    if (!is_writable($uploadDir)) {
        throw new Exception("No hay permisos de escritura en $uploadDir");
    }

    // Obtener extensión del archivo
    $extension = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $extensionesPermitidas)) {
        throw new Exception("Archivo $campo con extensión inválida.");
    }

    // Generar un nuevo nombre para el archivo
    $nuevoNombre = uniqid($campo . '_') . '.' . $extension;
    $rutaArchivo = $uploadDir . $nuevoNombre;

    // Mover archivo al servidor
    if (!move_uploaded_file($_FILES[$campo]['tmp_name'], $rutaArchivo)) {
        throw new Exception("Error al guardar el archivo $campo.");
    }

    return $rutaArchivo;
}
?>