<?php
/**
 * POST /api/apply_coupon.php
 * Validates promo coupons with prepared statements and returns discount calculation.
 */

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

$response = [
    'success' => false,
    'message' => 'Cupón no válido',
    'data'    => null
];

$input = json_decode(file_get_contents('php://input'), true);
$code = strtoupper(trim($input['code'] ?? ''));
$subtotal = filter_var($input['subtotal'] ?? 0, FILTER_VALIDATE_FLOAT);

if (empty($code)) {
    http_response_code(400);
    $response['message'] = 'Por favor ingresa un código de cupón';
    echo json_encode($response);
    exit;
}

try {
    $db = getDbConnection();

    $stmt = $db->prepare("SELECT id, codigo, tipo, valor, minimo_compra, activo, expira_el
                          FROM cupones
                          WHERE codigo = ? AND activo = 1
                          LIMIT 1");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $response['message'] = 'El cupón no existe o ha expirado. Prueba con CAFE15 o VISTRO50';
        echo json_encode($response);
        exit;
    }

    $coupon = $result->fetch_assoc();
    $stmt->close();

    // Check expiration if set
    if (!empty($coupon['expira_el']) && strtotime($coupon['expira_el']) < time()) {
        $response['message'] = 'Este cupón ha caducado';
        echo json_encode($response);
        exit;
    }

    $minPurchase = (float)$coupon['minimo_compra'];
    if ($subtotal < $minPurchase) {
        $response['message'] = "Este cupón requiere una compra mínima de L. " . number_format($minPurchase, 2);
        echo json_encode($response);
        exit;
    }

    $discountAmount = 0.00;
    $val = (float)$coupon['valor'];

    if ($coupon['tipo'] === 'percent') {
        $discountAmount = round(($subtotal * ($val / 100)), 2);
    } else {
        $discountAmount = min($subtotal, $val);
    }

    $response['success'] = true;
    $response['message'] = "¡Cupón {$coupon['codigo']} aplicado con éxito!";
    $response['data'] = [
        'code'            => $coupon['codigo'],
        'type'            => $coupon['tipo'],
        'value'           => $val,
        'discount_amount' => $discountAmount,
        'new_total'       => max(0, $subtotal - $discountAmount),
    ];

} catch (Throwable $e) {
    http_response_code(500);
    $response['message'] = 'Error al validar el cupón';
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
