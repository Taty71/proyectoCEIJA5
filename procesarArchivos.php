<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = $_FILES['archivo']['name'];
        $tipoArchivo = $_FILES['archivo']['type'];
        $tamanoArchivo = $_FILES['archivo']['size'];
        $rutaTemporal = $_FILES['archivo']['tmp_name'];
        $directorioDestino = 'uploads/';

        // Crear el directorio si no existe
        if (!is_dir($directorioDestino)) {
            mkdir($directorioDestino, 0777, true);
        }

        // Validar tipo MIME
        $tiposPermitidos = ['application/pdf', 'image/jpeg']; // PDF y JPG
        if (!in_array($tipoArchivo, $tiposPermitidos)) {
            echo json_encode(["status" => "error", "message" => "Solo se permiten archivos PDF y JPG"]);
            exit;
        }

        // Validar extensión del archivo
        $extensionesPermitidas = ['pdf', 'jpg'];
        $extensionArchivo = strtolower(pathinfo($nombreArchivo, PATHINFO_EXTENSION));
        if (!in_array($extensionArchivo, $extensionesPermitidas)) {
            echo json_encode(["status" => "error", "message" => "Extensión no permitida"]);
            exit;
        }

        // Mover el archivo a la carpeta destino
        $rutaDestino = $directorioDestino . basename($nombreArchivo);
        if (move_uploaded_file($rutaTemporal, $rutaDestino)) {
            echo json_encode(["status" => "success", "message" => "Archivo subido con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al mover el archivo"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No se subió ningún archivo o hubo un error"]);
    }
}
?>

