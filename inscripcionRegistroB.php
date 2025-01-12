<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); 
header("Content-Type: application/json");
echo json_encode(["status" => "success", "message" => "1El servidor está funcionando correctamente."]); require_once 'conexion.php';
require_once 'funciones\manejoArchivos.php';

 $conn = getDbConnection(); 
 if ($conn->connect_error) {
     echo json_encode(["status" => "error", "message" => "2Error al conectar a la base de datos: " . $conn->connect_error]);
 exit; } 
echo json_encode(["status" => "success", "message" => "3Conectado a la base de datos correctamente."]); 

function obtenerIdTDocumentacion($tipoDocumento, $titulo = null) {
    $documentos = [
        'dni' => 1,
        'cuil' => 2,
        'fichaMedica' => 3,
        'partidaNacimiento' => 4,
        'titulo'=>5,
        'NivelPrimario' => 6,
        'AnaliticoProvisorio' => 7,
        'SolicitudPase' => 8,
        'foto' => 9,
    ];
    
    if ($tipoDocumento === 'archivoTitulo' && $titulo !== null) {
        return $documentos[$titulo] ?? null;
    }

    return $documentos[$tipoDocumento] ?? null;
}
 

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')
 { var_dump($_POST); var_dump($_FILES);
   
       // Validar y recibir datos
    $nombreEstd = $_POST['nombre'] ?? null;
    $apellidoEstd = $_POST['apellido'] ?? null;
    $dni = $_POST['dni'] ?? null;
    $cuil = $_POST['cuil'] ?? null;
    $fechaNacimiento = $_POST['fechaNacimiento'] ?? null;
    $calle = $_POST['calle'] ?? null;
    $nro = $_POST['nro'] ?? null;
    $barrio = $_POST['barrio'] ?? null;
    $localidad = $_POST['localidad'] ?? null;
    $provincia = $_POST['pcia'] ?? null;
    $modalidad = $_POST['modalidad'] ?? null;
    $planAnio = $_POST['planAnio'] ?? null;
    $titulo = $_POST['titulo'] ?? null; // Nuevo campo para el título

    if (!$nombreEstd || !$apellidoEstd || !$dni || !$cuil || !$fechaNacimiento || !$calle || !$nro || !$barrio || !$localidad || !$provincia) { echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
     exit; }
 

  // Manejo de archivos
  $archivos = [
    'foto' => ['jpg', 'jpeg', 'png'],
    'dni' => ['pdf', 'jpg'],
    'cuil' => ['pdf', 'jpg'],
    'partidaNacimiento' => ['pdf', 'jpg'],
    'fichaMedica' => ['pdf', 'jpg'],
    'archivoTitulo' => ['pdf', 'jpg']
];

$rutas = manejarArchivos($archivos);

 
 // Manejo de la transacción
 $conn->begin_transaction();

 try {
     // Insertar en provincias (si no existe)
     $stmt = $conn->prepare("SELECT idPcias FROM provincias WHERE provincia = ?");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para provincias: " . $conn->error);
     }
     $stmt->bind_param('s', $provincia);
     $stmt->execute();
     $stmt->bind_result($idPcia);
     if (!$stmt->fetch()) {
         $stmt->close();
         $stmt = $conn->prepare("INSERT INTO provincias (provincia) VALUES (?)");
         if (!$stmt) {
             throw new Exception("Error al preparar la consulta de inserción para provincias: " . $conn->error);
         }
         $stmt->bind_param('s', $provincia);
         $stmt->execute();
         $idPcia = $conn->insert_id;
     }
     $stmt->close();

     // Insertar en localidades (si no existe)
     $stmt = $conn->prepare("SELECT idLocalidades FROM localidades WHERE localidad = ? AND idPcia = ?");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para localidades: " . $conn->error);
     }
     $stmt->bind_param('si', $localidad, $idPcia);
     $stmt->execute();
     $stmt->bind_result($idLocalidad);
     if (!$stmt->fetch()) {
         $stmt->close();
         $stmt = $conn->prepare("INSERT INTO localidades (localidad, idPcia) VALUES (?, ?)");
         if (!$stmt) {
             throw new Exception("Error al preparar la consulta de inserción para localidades: " . $conn->error);
         }
         $stmt->bind_param('si', $localidad, $idPcia);
         $stmt->execute();
         $idLocalidad = $conn->insert_id;
     }
     $stmt->close();

     // Insertar en barrios (si no existe)
     $stmt = $conn->prepare("SELECT idBarrios FROM barrios WHERE nombreBarrio = ? AND idLocalidad = ?");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para barrios: " . $conn->error);
     }
     $stmt->bind_param('si', $barrio, $idLocalidad);
     $stmt->execute();
     $stmt->bind_result($idBarrio);
     if (!$stmt->fetch()) {
         $stmt->close();
         $stmt = $conn->prepare("INSERT INTO barrios (nombreBarrio, idLocalidad) VALUES (?, ?)");
         if (!$stmt) {
             throw new Exception("Error al preparar la consulta de inserción para barrios: " . $conn->error);
         }
         $stmt->bind_param('si', $barrio, $idLocalidad);
         $stmt->execute();
         $idBarrio = $conn->insert_id;
     }
     $stmt->close();

     // Insertar en domicilios
     $stmt = $conn->prepare("INSERT INTO domicilios (calle, nro, idBarrio) VALUES (?, ?, ?)");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para domicilios: " . $conn->error);
     }
     $stmt->bind_param('sii', $calle, $nro, $idBarrio);
     $stmt->execute();
     $idDomicilio = $conn->insert_id;
     $stmt->close();

     // Insertar en estudiantes
     $idLogin = null; // Cambiar según corresponda
     $fotoRuta = $rutas['foto']; // Esto debe contener la ruta de la foto

     $stmt = $conn->prepare("INSERT INTO estudiantes (nombreEstd, apellidoEstd, dni, cuil, fechaNacimiento, foto, idDomicilio, idLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para estudiantes: " . $conn->error);
     }
     $stmt->bind_param('sssisssi', $nombreEstd, $apellidoEstd, $dni, $cuil, $fechaNacimiento, $fotoRuta, $idDomicilio, $idLogin);
     $stmt->execute();
     $idEstudiante = $conn->insert_id;
     $stmt->close();

     // Insertar en inscripciones
     $fechaInscripcion = date('Y-m-d');
     $stmt = $conn->prepare("INSERT INTO inscripciones (idEstudiante, fechaInscripcion, idModalidad, idAnioPlan, idEstadoInscripcion) VALUES (?, ?, ?, ?, ?)");
     if (!$stmt) {
         throw new Exception("Error al preparar la consulta para inscripciones: " . $conn->error);
     }
     $idEstadoInscripcion = 1; // Suponiendo que 1 significa 'Inscripción completada' o algún estado predeterminado
     $stmt->bind_param('isssi', $idEstudiante, $fechaInscripcion, $modalidad, $planAnio, $idEstadoInscripcion);
     $stmt->execute();
     $idInscripcion = $conn->insert_id;
     $stmt->close();

 
     // Insertar en detalle_inscripciones
$fechaEntrega = $fechaInscripcion; // Asumimos que la fecha de entrega es la misma que la fecha de inscripción
$estadoDocumentacion = 'Entregado'; // Suponiendo que el estado es 'Entregado'

// Repite para cada tipo de documentación requerida
foreach ($archivos as $tipoDocumento => $extensiones) {
    if ($tipoDocumento === 'foto') {
        continue; // Excluir foto del proceso de inserción en detalle_inscripciones
    }
    $idTDocumentacion = obtenerIdTDocumentacion($tipoDocumento, $titulo); // Pasamos $titulo a la función
    if ($idTDocumentacion) {
        $stmt = $conn->prepare("INSERT INTO detalle_inscripciones (idInscripcion, idTDocumentacion, estadoDocumentación, fechaEntrega) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta para detalle_inscripciones: " . $conn->error);
        }
        $stmt->bind_param('iiss', $idInscripcion, $idTDocumentacion, $estadoDocumentacion, $fechaEntrega); 
        $stmt->execute();
        $stmt->close();
    } else {
        throw new Exception("No se pudo encontrar el idTDocumentacion para el tipo de documento: " . $tipoDocumento);
    }
}


     // Función para obtener el idDocumentaciones correspondiente
    
    $conn->commit();
     echo json_encode(["status" => "success", "message" => "Datos registrados exitosamente"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Error al guardar los datos: " . $e->getMessage()]);
    } finally {
        $conn->close();
    
    echo json_encode(["status" => "success", "message" => "El servidor está funcionando correctamente."]);

    }
}
?>  