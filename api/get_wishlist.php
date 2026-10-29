<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $db = getDbConnection();
    $user = requireAuth($db);

    $stmt = $db->prepare("SELECT producto_id FROM wishlist WHERE usuario_id = ? ORDER BY id DESC");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    $res = $stmt->get_result();

    $ids = [];
    while ($row = $res->fetch_assoc()) {
        $ids[] = (int)$row['producto_id'];
    }
    $stmt->close();

    jsonResponse(true, 'Lista de deseos obtenida exitosamente.', $ids);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al obtener la lista de deseos.', null, 500);
}
