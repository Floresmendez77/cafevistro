<?php
// MODO DEPURACIÓN: Muestra todos los errores de PHP.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la Base de Datos
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'ecotienda';

// Crear la Conexión
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Verificar la Conexión
if ($conn->connect_error) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la BD: ' . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");