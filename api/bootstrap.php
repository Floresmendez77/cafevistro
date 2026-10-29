<?php
/**
 * api/bootstrap.php
 * Core API bootstrap: Session, CSRF, JSON helpers, DB connection & Server-side cart calculations.
 */

// Configure secure session cookies BEFORE session_start
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', '1');
    }
    session_start();
}

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

/**
 * Standardized JSON response helper. Never leaks raw SQL or internal exceptions.
 */
function jsonResponse(bool $success, string $message = '', mixed $data = null, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Safely parse incoming JSON body.
 */
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * CSRF token generation and validation.
 */
function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrf(): void {
    $serverToken = $_SESSION['csrf_token'] ?? '';
    if (empty($serverToken)) {
        jsonResponse(false, 'Sesión no válida o token CSRF ausente.', null, 403);
    }

    $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($headerToken)) {
        $input = getJsonInput();
        $headerToken = $input['csrf_token'] ?? ($_POST['csrf_token'] ?? '');
    }

    if (!hash_equals($serverToken, (string)$headerToken)) {
        jsonResponse(false, 'Token CSRF inválido o expirado.', null, 403);
    }
}

/**
 * Require authenticated user.
 */
function requireAuth(mysqli $db): array {
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        jsonResponse(false, 'Debes iniciar sesión para realizar esta acción.', null, 401);
    }

    $stmt = $db->prepare("SELECT id, nombre_completo, email, telefono, direccion, eco_points, role FROM usuarios WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();
    $stmt->close();

    if (!$user) {
        unset($_SESSION['user_id']);
        jsonResponse(false, 'Usuario no encontrado o sesión expirada.', null, 401);
    }

    return $user;
}

/**
 * Server-side Cart Calculator.
 * Evaluates cart items against the database to guarantee untampered base prices and variant prices.
 */
function calculateCart(mysqli $db, array $items): array {
    if (empty($items)) {
        return [
            'subtotal' => 0.00,
            'items'    => []
        ];
    }

    $calculatedItems = [];
    $subtotal = 0.00;

    // Prepared statements for product and variant lookup
    $stmtProd = $db->prepare("SELECT id, nombre, precio, stock, imagen_url FROM productos WHERE id = ? AND activo = 1 LIMIT 1");
    $stmtVar = $db->prepare("SELECT id, nombre_variante, precio_adicional FROM producto_variantes WHERE id = ? AND producto_id = ? LIMIT 1");

    foreach ($items as $item) {
        $productId = (int)($item['productId'] ?? ($item['id'] ?? ($item['producto_id'] ?? 0)));
        $quantity = max(1, (int)($item['quantity'] ?? ($item['cantidad'] ?? 1)));
        $variantId = isset($item['variantId']) && $item['variantId'] !== null ? (int)$item['variantId'] : null;

        if ($productId <= 0) {
            continue;
        }

        $stmtProd->bind_param("i", $productId);
        $stmtProd->execute();
        $prodRes = $stmtProd->get_result();
        $product = $prodRes->fetch_assoc();

        if (!$product) {
            continue;
        }

        $unitPrice = (float)$product['precio'];
        $variantName = null;
        $variantPriceExtra = 0.00;

        if ($variantId !== null && $variantId > 0) {
            $stmtVar->bind_param("ii", $variantId, $productId);
            $stmtVar->execute();
            $varRes = $stmtVar->get_result();
            if ($variant = $varRes->fetch_assoc()) {
                $variantName = $variant['nombre_variante'];
                $variantPriceExtra = (float)$variant['precio_adicional'];
                $unitPrice += $variantPriceExtra;
            }
        } elseif (!empty($item['nombre_variante'])) {
            // If variant was sent by name, find it in DB
            $stmtVarName = $db->prepare("SELECT id, nombre_variante, precio_adicional FROM producto_variantes WHERE producto_id = ? AND nombre_variante = ? LIMIT 1");
            $stmtVarName->bind_param("is", $productId, $item['nombre_variante']);
            $stmtVarName->execute();
            $varRes = $stmtVarName->get_result();
            if ($variant = $varRes->fetch_assoc()) {
                $variantId = (int)$variant['id'];
                $variantName = $variant['nombre_variante'];
                $variantPriceExtra = (float)$variant['precio_adicional'];
                $unitPrice += $variantPriceExtra;
            }
            $stmtVarName->close();
        }

        $itemSubtotal = round($unitPrice * $quantity, 2);
        $subtotal += $itemSubtotal;

        $calculatedItems[] = [
            'producto_id'      => (int)$product['id'],
            'nombre'           => $product['nombre'],
            'variante_id'      => $variantId,
            'variante_nombre'  => $variantName,
            'cantidad'         => $quantity,
            'precio_unitario'  => round($unitPrice, 2),
            'subtotal'         => $itemSubtotal,
            'stock_disponible' => (int)$product['stock'],
            'imagen_url'       => $product['imagen_url']
        ];
    }

    $stmtProd->close();
    $stmtVar->close();

    return [
        'subtotal' => round($subtotal, 2),
        'items'    => $calculatedItems
    ];
}

