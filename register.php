<?php
include_once 'conexion.php';

// Incluir el archivo con las funciones
include_once 'actualizarPassw.php'; //no estoy usuando la funcion aun para actualizar la contraseña


header('Content-Type: application/json');


// Obtener los datos de la solicitud
$input = json_decode(file_get_contents("php://input"), true);

// Verificar que $input no esté vacío y sea un array 
if (empty($input) || !is_array($input)) {
    echo json_encode(["status" => "error", "message" => "Datos de entrada no válidos"]);
    exit;
}

// Obtener los datos de la solicitud POST
$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$rol = $input['rol'] ?? '';

// Verificar que todos los campos necesarios estén presentes
if (empty($email) || empty($password) || empty($nombre) || empty($apellido) || empty($rol)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
    exit; // Sale del script si algún campo está vacío
}

// Conexión a la base de datos
$conn = getDbConnection();

// Verificar si el usuario ya existe en la base de datos
$query = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si ya existe un usuario con ese email
    echo json_encode(["status" => "error", "message" => "El correo electrónico ya está registrado"]);
    exit;
}

// Si el usuario no existe, cifrar la contraseña y proceder con el registro
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar el nuevo usuario en la base de datos
$query = "INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssss", $nombre, $apellido, $email, $hashedPassword, $rol);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Usuario registrado exitosamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Hubo un error al registrar el usuario"]);
}

$stmt->close();
$conn->close();
?>