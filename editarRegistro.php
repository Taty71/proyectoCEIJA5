<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); 
header("Content-Type: application/json");

echo json_encode(["status" => "success", "message" => "1El servidor está funcionando correctamente."]); 

require_once 'conexion.php';

$conn = getDbConnection(); 
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "2Error al conectar a la base de datos: " . $conn->connect_error]);
    exit; }
echo json_encode(["status" => "success", "message" => "3Conectado a la base de datos correctamente."]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['dni'])) {
        $dni = $_POST['dni'];

    
        if (empty($dni)) {
            echo json_encode(["status" => "error", "message" => "Campo DNI vacío."]);
            exit;
        }
        // Depuración: mostrar el DNI recibido
        error_log("DNI recibido: " . $dni);

        $stmt = $conn->prepare("SELECT dni, nombreEstd, apellidoEstd, cuil, fechaNacimiento, FROM estudiantes WHERE dni = ?");
        if (!$stmt) {
            echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conn->error]);
            exit;
        }
        /*if (!$stmt) {
            throw new Exception("Error al preparar la consulta para el dni de editar: " . $conn->error);
        }*/
        //$dni = trim($dni);
        $stmt->bind_param('i', $dni);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $estudiante = $result->fetch_assoc();
            echo json_encode(["status" => "success", "data" => $estudiante]);
        } else {
            echo json_encode(["status" => "error", "message" => "No se encontró un estudiante con ese DNI."]);
        }

    $stmt->close();
    } else {
    echo json_encode(["status" => "error", "message" => "DNI no recibido."]);
    }
}

?>