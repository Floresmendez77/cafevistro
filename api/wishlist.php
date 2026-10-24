<?php
/**
 * POST /api/wishlist.php
 * Toggle wishlist items for authenticated users with prepared statements & CSRF validation.
 */

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

$response = [
    'success' => false,
    'message' => 'Error al actualizar lista de deseos',
    'data'    => null
];

// Check authentication
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    $response['message'] = 'Debes iniciar sesión para guardar favoritos en la nube';
    echo json_encode($response);
    exit;
}

// CSRF validation
$headers = getallheaders();
$csrfHeader = $headers['X-CSRF-Token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfHeader)) {
    http_response_code(403);
    $response['message'] = 'Token CSRF inválido';
    echo json_encode($response);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$productId = filter_var($input['product_id'] ?? null, FILTER_VALIDATE_INT);

if (!$productId) {
    http_response_code(400);
    $response['message'] = 'ID de producto inválido';
    echo json_encode($response);
    exit;
}

try {
    $db = getDbConnection();
    $userId = (int)$_SESSION['user_id'];

    // Check if already in wishlist
    $stmtCheck = $db->prepare("SELECT id FROM wishlist WHERE usuario_id = ? AND producto_id = ?");
    $stmtCheck->bind_param("ii", $userId, $productId);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows > 0) {
        // Remove from wishlist
        $stmtDel = $db->prepare("DELETE FROM wishlist WHERE usuario_id = ? AND producto_id = ?");
        $stmtDel->bind_param("ii", $userId, $productId);
        $stmtDel->execute();
        $stmtDel->close();

        $response['success'] = true;
        $response['message'] = 'Producto eliminado de tu lista de deseos';
        $response['data']    = ['is_wishlisted' => false, 'product_id' => $productId];
    } else {
        // Add to wishlist
        $stmtAdd = $db->prepare("INSERT INTO wishlist (usuario_id, producto_id) VALUES (?, ?)");
        $stmtAdd->bind_param("ii", $userId, $productId);
        $stmtAdd->execute();
        $stmtAdd->close();

        $response['success'] = true;
        $response['message'] = 'Producto añadido a tu lista de deseos';
        $response['data']    = ['is_wishlisted' => true, 'product_id' => $productId];
    }

    $stmtCheck->close();
} catch (Throwable $e) {
    http_response_code(500);
    $response['message'] = 'Error de base de datos al procesar la lista de deseos';
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
