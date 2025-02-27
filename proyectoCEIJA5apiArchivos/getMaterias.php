<?php
function getMateriasPorPlanModulo($planAnio, $modulo) {
    global $conn; // Usamos la conexión global
    $materias = [];

    // Consulta para obtener las materias y las áreas de estudio correspondientes al plan y módulo seleccionados
    $sql = "SELECT m.idMateria, m.materia, ae.nombre AS areaEstudio 
            FROM materia m
            JOIN area_estudio ae ON m.idAreaEstudio = ae.id
            WHERE m.anioPlan = ? AND m.modulo = ?";
    
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar la consulta para obtener las materias: " . $conn->error);
    }

    // Vinculamos los parámetros para la consulta
    $stmt->bind_param('ii', $planAnio, $modulo);
    $stmt->execute();
    $result = $stmt->get_result();

    // Guardamos las materias en el array
    while ($row = $result->fetch_assoc()) {
        $materias[] = $row; // Cada materia con su área de estudio
    }

    $stmt->close();
    
    return $materias;
}
?>