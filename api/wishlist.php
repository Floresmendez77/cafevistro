<?php
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Método HTTP no permitido.', null, 405);
}

try {
    $db = getDbConnection();
    $user = requireAuth($db);
    verifyCsrf();

    $input = getJsonInput();
    $productId = (int)($input['producto_id'] ?? ($input['product_id'] ?? 0));

    if ($productId <= 0) {
        jsonResponse(false, 'Identificador de producto inválido.', null, 400);
    }

    // Check if product exists
    $chkStmt = $db->prepare("SELECT id FROM productos WHERE id = ? LIMIT 1");
    $chkStmt->bind_param("i", $productId);
    $chkStmt->execute();
    if ($chkStmt->get_result()->num_rows === 0) {
        $chkStmt->close();
        jsonResponse(false, 'El producto no existe.', null, 404);
    }
    $chkStmt->close();

    // Check if in wishlist
    $stmt = $db->prepare("SELECT id FROM wishlist WHERE usuario_id = ? AND producto_id = ? LIMIT 1");
    $stmt->bind_param("ii", $user['id'], $productId);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($exists) {
        $delStmt = $db->prepare("DELETE FROM wishlist WHERE id = ?");
        $delStmt->bind_param("i", $exists['id']);
        $delStmt->execute();
        $delStmt->close();

        jsonResponse(true, 'Producto eliminado de favoritos.', [
            'in_wishlist' => false,
            'producto_id' => $productId
        ]);
    } else {
        $insStmt = $db->prepare("INSERT INTO wishlist (usuario_id, producto_id) VALUES (?, ?)");
        $insStmt->bind_param("ii", $user['id'], $productId);
        $insStmt->execute();
        $insStmt->close();

        jsonResponse(true, 'Producto agregado a favoritos.', [
            'in_wishlist' => true,
            'producto_id' => $productId
        ]);
    }
} catch (Throwable $e) {
    jsonResponse(false, 'Error al actualizar lista de deseos.', null, 500);
}
