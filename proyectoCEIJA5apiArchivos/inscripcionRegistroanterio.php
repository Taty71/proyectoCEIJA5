<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");

require_once 'conexion.php';
require_once 'funciones/manejoArchivos.php';
require_once 'funciones/getMaterias.php'; // Incluir el archivo getMaterias.php

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
    $modulo = $_POST['modulo'] ?? null;
    $areaEstudio = $_POST['areaEstudio'] ?? null;
    $materiasSeleccionadas = $_POST['materias'] ?? null; // Array con los ids de las materias seleccionadas

    if (!$nombre || !$apellido || !$dni || !$cuil || !$fechaNacimiento || !$calle || !$numero || !$barrio || !$localidad || !$provincia || !$modalidad || !$planAnio || !isset($_FILES['foto'])) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        $conn->close();
        exit;
    }

    // Obtener las materias según el plan y la modalidad
    $materias = getMaterias($planAnio, $modulo);

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
        // Insertar en provincias (si no existe)
        $stmt = $conn->prepare("SELECT id FROM provincias WHERE provincia = ?");
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
        $stmt = $conn->prepare("SELECT id FROM localidades WHERE localidad = ? AND idPcia = ?");
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
        $stmt = $conn->prepare("SELECT id FROM barrios WHERE nombreBarrio = ? AND idLocalidad = ?");
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
        $stmt->bind_param('sii', $calle, $numero, $idBarrio);
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
        $stmt->bind_param('sssisssi', $nombre, $apellido, $dni, $cuil, $fechaNacimiento, $fotoRuta, $idDomicilio, $idLogin);
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
            $idTDocumentacion = obtenerIdTDocumentacion($tipoDocumento); // Pasamos $titulo a la función
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

        // Insertar las materias seleccionadas en la tabla 'detalle_inscripciones'
        if ($materiasSeleccionadas) {
            foreach ($materiasSeleccionadas as $idMateria) {
                $stmt = $conn->prepare("INSERT INTO detalle_inscripciones (idInscripcion, idMateria, estadoDocumentacion, fechaEntrega) VALUES (?, ?, ?, ?)");
                $stmt->bind_param('iiss', $idInscripcion, $idMateria, $estadoDocumentacion, $fechaEntrega);
                $stmt->execute();
                $stmt->close();
            }
        }

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