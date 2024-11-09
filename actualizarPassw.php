<?php
// Función para actualizar la contraseña
function updatePassword($conn, $id, $newPassword) {
    // Cifra la nueva contraseña
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Prepara la consulta para actualizar la contraseña
    $query = "UPDATE usuarios SET password = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $hashedPassword, $id);

    // Ejecuta la consulta
    return $stmt->execute();
}
?>
