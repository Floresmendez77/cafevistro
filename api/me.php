<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        jsonResponse(true, 'No hay sesión activa.', [
            'user'       => null,
            'csrf_token' => getCsrfToken()
        ]);
    }

    $db = getDbConnection();
    $stmt = $db->prepare("SELECT id, nombre_completo, email, telefono, direccion, eco_points, role FROM usuarios WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();
    $stmt->close();

    if (!$user) {
        unset($_SESSION['user_id']);
        jsonResponse(true, 'Sesión no válida.', [
            'user'       => null,
            'csrf_token' => getCsrfToken()
        ]);
    }

    jsonResponse(true, 'Usuario autenticado.', [
        'user'       => $user,
        'csrf_token' => getCsrfToken()
    ]);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al consultar la sesión.', null, 500);
}
