<?php
session_start();
require 'conexion.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'No se pudo obtener el historial de pedidos.'];

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    $response['message'] = 'Debes iniciar sesión para ver tus pedidos.';
    echo json_encode($response);
    exit;
}

$usuario_id = $_SESSION['user_id'];
$pedidos = [];

// Consulta para obtener los pedidos del usuario
$sql = "SELECT id, total, estado, fecha_pedido FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $pedidos[] = $row;
    }

    $response['success'] = true;
    $response['pedidos'] = $pedidos;
    $stmt->close();
} else {
    $response['message'] = 'Error al preparar la consulta de pedidos.';
}

$conn->close();
echo json_encode($response);