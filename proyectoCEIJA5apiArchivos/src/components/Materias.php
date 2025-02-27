<?php

require_once '../../conexion.php';

class Materias {
    private $conn;

    public function __construct() {
        $this->conn = getDbConnection();
    }

    public function getMaterias($anioPlan, $modalidad) {
        $stmt = $this->conn->prepare("SELECT * FROM materias WHERE anioPlan = ? AND modalidad = ?");
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta: " . $this->conn->error);
        }

        $stmt->bind_param('is', $anioPlan, $modalidad);
        $stmt->execute();
        $result = $stmt->get_result();

        $materias = [];
        while ($row = $result->fetch_assoc()) {
            $materias[] = $row;
        }

        $stmt->close();
        return $materias;
    }
}

// Handling incoming requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $anioPlan = $_GET['anioPlan'] ?? null;
    $modalidad = $_GET['modalidad'] ?? null;

    if ($anioPlan === null || $modalidad === null) {
        echo json_encode(["status" => "error", "message" => "Faltan parámetros obligatorios"]);
        exit;
    }

    try {
        $materiasComponent = new Materias();
        $materias = $materiasComponent->getMaterias($anioPlan, $modalidad);
        echo json_encode(["status" => "success", "data" => $materias]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al obtener materias: " . $e->getMessage()]);
    }
}
?>