<?php
$host = 'localhost';
$db = 'nombre_base_datos'; // Cambia esto por el nombre de tu base de datos
$user = 'usuario'; // Cambia esto por tu usuario de base de datos
$pass = 'contraseña'; // Cambia esto por tu contraseña de base de datos

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>