<?php
include_once 'conexion.php'; 

// Incluir el archivo con las funciones
include_once 'actualizarPassw.php'; 

// Configuración de conexión a la base de datos
$conn = getDbConnection(); // Asegúrate de iniciar la conexión aquí

// Obtener los datos de la solicitud
$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? '';

// Manejar la acción de login
if ($action === 'login') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        $query = "SELECT id, nombre, rol, password FROM usuarios WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Login exitoso",
                    "user" => [
                        "id" => $user['id'],
                        "nombre" => $user['nombre'],
                        "rol" => $user['rol']
                    ]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Email y contraseña son obligatorios"]);
    }
} elseif ($action === 'updatePassword') {
    $id = $input['id'] ?? '';
    $newPassword = $input['newPassword'] ?? '';

    if (!empty($id) && !empty($newPassword)) {
        // Llamar a la función updatePassword desde functions.php
        if (updatePassword($conn, $id, $newPassword)) {
            echo json_encode(["status" => "success", "message" => "Contraseña actualizada correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar la contraseña"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "ID y nueva contraseña son obligatorios"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
}

// Cerrar la conexión
$conn->close();
?>
