<?php
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Método HTTP no permitido.', null, 405);
}

try {
    $input = getJsonInput();
    $code = strtoupper(trim($input['code'] ?? ''));
    $items = is_array($input['items'] ?? null) ? $input['items'] : [];

    if (empty($code)) {
        jsonResponse(false, 'Por favor ingresa un código de cupón.', null, 400);
    }

    if (empty($items)) {
        jsonResponse(false, 'El carrito está vacío. Agrega productos para aplicar un cupón.', null, 400);
    }

    $db = getDbConnection();

    // Recompute cart subtotal on server from database prices
    $cart = calculateCart($db, $items);
    $serverSubtotal = (float)$cart['subtotal'];

    if ($serverSubtotal <= 0) {
        jsonResponse(false, 'El subtotal del pedido debe ser mayor a 0 para aplicar cupones.', null, 400);
    }

    $stmt = $db->prepare("SELECT id, codigo, tipo, valor, minimo_compra, activo, expira_el FROM cupones WHERE codigo = ? AND activo = 1 LIMIT 1");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $res = $stmt->get_result();
    $coupon = $res->fetch_assoc();
    $stmt->close();

    if (!$coupon) {
        jsonResponse(false, 'El cupón no existe o ha expirado. Prueba con CAFE15 o VISTRO50.', null, 404);
    }

    if (!empty($coupon['expira_el']) && strtotime($coupon['expira_el']) < time()) {
        jsonResponse(false, 'Este cupón ha expirado.', null, 400);
    }

    $minSpend = (float)$coupon['minimo_compra'];
    if ($serverSubtotal < $minSpend) {
        jsonResponse(false, "Este cupón requiere una compra mínima de L. " . number_format($minSpend, 2), null, 400);
    }

    $discount = 0.00;
    if ($coupon['tipo'] === 'percent') {
        $discount = round($serverSubtotal * ((float)$coupon['valor'] / 100), 2);
    } elseif ($coupon['tipo'] === 'fixed') {
        $discount = round(min($serverSubtotal, (float)$coupon['valor']), 2);
    }

    $discountedTotal = round(max(0.00, $serverSubtotal - $discount), 2);

    jsonResponse(true, "¡Cupón '{$code}' aplicado con éxito!", [
        'code'             => $coupon['codigo'],
        'tipo'             => $coupon['tipo'],
        'valor'            => (float)$coupon['valor'],
        'subtotal_server'  => $serverSubtotal,
        'descuento'        => $discount,
        'total_con_cupon'  => $discountedTotal
    ]);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al validar el cupón.', null, 500);
}
