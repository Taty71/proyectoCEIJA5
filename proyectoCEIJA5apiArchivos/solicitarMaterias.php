<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos

$idAnioPlan = isset($_GET['idAnioPlan']) ? intval($_GET['idAnioPlan']) : null;
$idModulo = isset($_GET['idModulo']) ? intval($_GET['idModulo']) : null;

if ($idAnioPlan) {
    // Obtener materias por año
    $query = "SELECT * FROM materias WHERE idAnioPlan = $idAnioPlan";
} elseif ($idModulo) {
    // Obtener áreas de estudio y materias por módulo
    $query = "SELECT m.id, m.materia, a.nombre AS areaEstudio 
              FROM materias m 
              JOIN area_estudio a ON m.idAreaEstudio = a.id 
              WHERE a.idModulo = $idModulo";
} else {
    echo json_encode(['error' => true, 'message' => 'Parámetros inválidos']);
    exit;
}

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(['error' => true, 'message' => 'Error en la consulta']);
    exit;
}

$materias = [];
while ($row = mysqli_fetch_assoc($result)) {
    $materias[] = $row;
}

echo json_encode(['error' => false, 'data' => $materias]);
?>