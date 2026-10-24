<?php
// login.php

// Iniciar la sesión es lo PRIMERO que se debe hacer en cualquier script que la use.
session_start();

// Incluir la conexión a la base de datos
require 'conexion.php';

// Establecer el tipo de respuesta a JSON para que JavaScript lo entienda
header('Content-Type: application/json');

// Preparar una respuesta por defecto
$response = ['success' => false, 'message' => 'Credenciales inválidas.'];

// Asegurarse de que la solicitud sea por el método POST para seguridad
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Recoger los datos del formulario de forma segura
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validar que los campos no estén vacíos
    if (empty($email) || empty($password)) {
        $response['message'] = 'Por favor, ingresa tu correo y contraseña.';
    } else {
        // Preparar la consulta para buscar al usuario por su email
        // Usamos sentencias preparadas para prevenir inyección SQL
        $stmt = $conn->prepare("SELECT id, nombre_completo, email, password_hash FROM usuarios WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // Verificar si se encontró exactamente un usuario
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Verificar que la contraseña proporcionada coincida con el hash guardado en la BD
            if (password_verify($password, $user['password_hash'])) {
                // ¡Éxito! Las credenciales son correctas.
                
                // Limpiar cualquier sesión antigua y regenerar el ID por seguridad
                session_regenerate_id(true);

                // Guardar los datos esenciales del usuario en la sesión del servidor
                $_SESSION['loggedin'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_nombre'] = $user['nombre_completo'];
                $_SESSION['user_email'] = $user['email']; // <-- ¡LÍNEA CLAVE AÑADIDA!

                // Preparar el mensaje de éxito para el usuario
                $nombre_corto = explode(' ', $user['nombre_completo'])[0]; // Obtiene solo el primer nombre
                $response['success'] = true;
                $response['message'] = '¡Bienvenido de nuevo, ' . htmlspecialchars($nombre_corto) . '!';

            } else {
                // La contraseña no coincide
                $response['message'] = 'La contraseña no es correcta. Inténtalo de nuevo.';
            }
        } else {
            // No se encontró ningún usuario con ese correo
            $response['message'] = 'No se encontró una cuenta con ese correo electrónico.';
        }
        $stmt->close();
    }
} else {
    // Si alguien intenta acceder al archivo directamente por la URL (método GET)
    $response['message'] = 'Método de solicitud no permitido.';
}

$conn->close();

// Enviar la respuesta final a JavaScript
echo json_encode($response);