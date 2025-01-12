<?php
// Encabezados comunes para todas las solicitudes
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *'); // Permite solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Encabezados permitidos
// Configuración de conexión a la base de datos
function getDbConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ceija5";

    // Crear la conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar la conexión
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Error de conexión a la base de datos: " . $conn->connect_error]));
    }

    return $conn;  // Retornar la conexión para usarla en otras partes del código
}
?>
