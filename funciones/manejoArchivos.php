<?php
function manejarArchivos($camposConExtensiones) {
    $rutas = [];

    foreach ($camposConExtensiones as $campo => $extensiones) {
        $ruta = manejarArchivo($campo, $extensiones);
        if (!$ruta) {
            throw new Exception("El archivo {$campo} no fue entregado.");
        }
        $rutas[$campo] = $ruta;
    }

    return $rutas;
}
 // Función para manejar archivos subidos
function manejarArchivo($campo, $extensionesPermitidas) {
    if (isset($_FILES[$campo]) && $_FILES[$campo]['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $extension = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $extensionesPermitidas)) {
            throw new Exception("Archivo $campo con extensión inválida.");
        }

        $nuevoNombre = uniqid($campo . '_') . '.' . $extension;
        $rutaArchivo = $uploadDir . $nuevoNombre;

        if (!move_uploaded_file($_FILES[$campo]['tmp_name'], $rutaArchivo)) {
            throw new Exception("Error al guardar el archivo $campo.");
        }

        return $rutaArchivo;
    }

    return null;
}
?>
$cuilRuta = manejarArchivo('cuil', ['pdf', 'jpg']);
 $partidaNacimientoRuta = manejarArchivo('partidaNacimiento', ['pdf', 'jpg']);
 $fichaMedicaRuta = manejarArchivo('fichaMedica', ['pdf', 'jpg']);
 $archivoTituloRuta = manejarArchivo('archivoTitulo', ['pdf', 'jpg']);
 /*function manejarArchivo($campo, $extensionesPermitidas) {
     if (isset($_FILES[$campo]) && $_FILES[$campo]['error'] === UPLOAD_ERR_OK) {
         $uploadDir = 'uploads/';
         if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

         $extension = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
         if (!in_array($extension, $extensionesPermitidas)) {
             echo json_encode(["status" => "error", "message" => "Archivo $campo con extensión inválida"]);
             exit;
         }

         $nuevoNombre = uniqid($campo . '_') . '.' . $extension;
         $rutaArchivo = $uploadDir . $nuevoNombre;

         if (!move_uploaded_file($_FILES[$campo]['tmp_name'], $rutaArchivo)) {
             echo json_encode(["status" => "error", "message" => "Error al guardar el archivo $campo"]);
             exit;
         }

         return $rutaArchivo;
     }

     return null;
 }*/