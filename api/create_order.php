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
    $items = is_array($input['items'] ?? null) ? $input['items'] : [];
    $sucursalInput = trim($input['sucursal'] ?? 'Mall Multiplaza');
    $cuponCodigo = strtoupper(trim($input['cupon_codigo'] ?? ($input['cupon'] ?? '')));
    $puntosCanjeados = max(0, (int)($input['puntos_canjeados'] ?? 0));
    $notas = trim($input['notas'] ?? '');

    if (empty($items)) {
        jsonResponse(false, 'El carrito no contiene productos para procesar el pedido.', null, 400);
    }

    // Resolve sucursal
    $sucursalId = null;
    $sucursalNombre = $sucursalInput;
    $stmtSuc = $db->prepare("SELECT id, nombre FROM sucursales WHERE nombre = ? OR id = ? LIMIT 1");
    $sucursalIdParam = is_numeric($sucursalInput) ? (int)$sucursalInput : 0;
    $stmtSuc->bind_param("si", $sucursalInput, $sucursalIdParam);
    $stmtSuc->execute();
    $sucRes = $stmtSuc->get_result();
    if ($sucRow = $sucRes->fetch_assoc()) {
        $sucursalId = (int)$sucRow['id'];
        $sucursalNombre = $sucRow['nombre'];
    }
    $stmtSuc->close();

    // START TRANSACTION
    $db->begin_transaction();

    // 1. Lock and check stock for each product
    $stmtLock = $db->prepare("SELECT id, nombre, precio, stock, imagen_url FROM productos WHERE id = ? AND activo = 1 FOR UPDATE");
    $stmtUpdateStock = $db->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");
    $stmtVar = $db->prepare("SELECT id, nombre_variante, precio_adicional FROM producto_variantes WHERE id = ? AND producto_id = ? LIMIT 1");

    $processedItems = [];
    $serverSubtotal = 0.00;

    foreach ($items as $item) {
        $productId = (int)($item['productId'] ?? ($item['id'] ?? ($item['producto_id'] ?? 0)));
        $quantity = max(1, (int)($item['quantity'] ?? ($item['cantidad'] ?? 1)));
        $variantId = isset($item['variantId']) && $item['variantId'] !== null ? (int)$item['variantId'] : null;

        if ($productId <= 0) {
            continue;
        }

        $stmtLock->bind_param("i", $productId);
        $stmtLock->execute();
        $prodRes = $stmtLock->get_result();
        $product = $prodRes->fetch_assoc();

        if (!$product) {
            $db->rollback();
            jsonResponse(false, "El producto solicitado (ID: {$productId}) ya no está disponible.", null, 404);
        }

        if ((int)$product['stock'] < $quantity) {
            $db->rollback();
            jsonResponse(false, "Stock insuficiente para '{$product['nombre']}'. Disponibles: {$product['stock']} unidades.", null, 400);
        }

        // Deduct stock
        $stmtUpdateStock->bind_param("ii", $quantity, $productId);
        $stmtUpdateStock->execute();

        $unitPrice = (float)$product['precio'];
        $variantName = null;

        if ($variantId !== null && $variantId > 0) {
            $stmtVar->bind_param("ii", $variantId, $productId);
            $stmtVar->execute();
            $varRes = $stmtVar->get_result();
            if ($variant = $varRes->fetch_assoc()) {
                $variantName = $variant['nombre_variante'];
                $unitPrice += (float)$variant['precio_adicional'];
            }
        } elseif (!empty($item['nombre_variante'])) {
            $stmtVarName = $db->prepare("SELECT id, nombre_variante, precio_adicional FROM producto_variantes WHERE producto_id = ? AND nombre_variante = ? LIMIT 1");
            $stmtVarName->bind_param("is", $productId, $item['nombre_variante']);
            $stmtVarName->execute();
            $varRes = $stmtVarName->get_result();
            if ($variant = $varRes->fetch_assoc()) {
                $variantId = (int)$variant['id'];
                $variantName = $variant['nombre_variante'];
                $unitPrice += (float)$variant['precio_adicional'];
            }
            $stmtVarName->close();
        }

        $itemSubtotal = round($unitPrice * $quantity, 2);
        $serverSubtotal += $itemSubtotal;

        $processedItems[] = [
            'producto_id'     => $productId,
            'variante_id'     => $variantId,
            'variante_nombre' => $variantName,
            'nombre'          => $product['nombre'],
            'cantidad'        => $quantity,
            'precio_unitario' => round($unitPrice, 2),
            'subtotal'        => $itemSubtotal,
            'imagen_url'      => $product['imagen_url']
        ];
    }

    $stmtLock->close();
    $stmtUpdateStock->close();
    $stmtVar->close();

    if (empty($processedItems)) {
        $db->rollback();
        jsonResponse(false, 'No se procesaron productos válidos.', null, 400);
    }

    $serverSubtotal = round($serverSubtotal, 2);

    // 2. Validate and recompute coupon
    $descuentoCupon = 0.00;
    $validCouponCode = null;

    if (!empty($cuponCodigo)) {
        $stmtC = $db->prepare("SELECT id, codigo, tipo, valor, minimo_compra, expira_el FROM cupones WHERE codigo = ? AND activo = 1 LIMIT 1");
        $stmtC->bind_param("s", $cuponCodigo);
        $stmtC->execute();
        $cRes = $stmtC->get_result();
        if ($coupon = $cRes->fetch_assoc()) {
            $isExpired = !empty($coupon['expira_el']) && strtotime($coupon['expira_el']) < time();
            $meetsMin = $serverSubtotal >= (float)$coupon['minimo_compra'];

            if (!$isExpired && $meetsMin) {
                $validCouponCode = $coupon['codigo'];
                if ($coupon['tipo'] === 'percent') {
                    $descuentoCupon = round($serverSubtotal * ((float)$coupon['valor'] / 100), 2);
                } elseif ($coupon['tipo'] === 'fixed') {
                    $descuentoCupon = round(min($serverSubtotal, (float)$coupon['valor']), 2);
                }
            }
        }
        $stmtC->close();
    }

    $remainingAfterCoupon = round(max(0.00, $serverSubtotal - $descuentoCupon), 2);

    // 3. Lock user row to validate and deduct Eco points
    $stmtUserLock = $db->prepare("SELECT eco_points FROM usuarios WHERE id = ? FOR UPDATE");
    $stmtUserLock->bind_param("i", $user['id']);
    $stmtUserLock->execute();
    $userRow = $stmtUserLock->get_result()->fetch_assoc();
    $stmtUserLock->close();

    $availableEcoPoints = (int)($userRow['eco_points'] ?? 0);
    $descuentoPuntos = 0.00;
    $puntosADescontar = 0;

    if ($puntosCanjeados > 0) {
        if ($puntosCanjeados > $availableEcoPoints) {
            $db->rollback();
            jsonResponse(false, "No tienes suficientes Puntos Eco (disponibles: {$availableEcoPoints}).", null, 400);
        }

        // Each point is worth L. 1.00 of discount, capped at remaining total
        $descuentoPuntos = round(min((float)$puntosCanjeados, $remainingAfterCoupon), 2);
        $puntosADescontar = (int)$descuentoPuntos;

        if ($puntosADescontar > 0) {
            $stmtDeduct = $db->prepare("UPDATE usuarios SET eco_points = eco_points - ? WHERE id = ?");
            $stmtDeduct->bind_param("ii", $puntosADescontar, $user['id']);
            $stmtDeduct->execute();
            $stmtDeduct->close();
        }
    }

    // 4. Calculate final total and points earned
    $total = round(max(0.00, $remainingAfterCoupon - $descuentoPuntos), 2);
    $puntosGanados = (int)round($total * 0.10); // 10% in points

    if ($puntosGanados > 0) {
        $stmtAdd = $db->prepare("UPDATE usuarios SET eco_points = eco_points + ? WHERE id = ?");
        $stmtAdd->bind_param("ii", $puntosGanados, $user['id']);
        $stmtAdd->execute();
        $stmtAdd->close();
    }

    $totalDescuento = round($descuentoCupon + $descuentoPuntos, 2);

    // 5. Insert order
    $stmtOrder = $db->prepare("INSERT INTO pedidos (usuario_id, sucursal_id, sucursal, subtotal, descuento, cupon_codigo, puntos_canjeados, descuento_puntos, total, puntos_ganados, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)");
    $stmtOrder->bind_param("iisddsiddss",
        $user['id'],
        $sucursalId,
        $sucursalNombre,
        $serverSubtotal,
        $totalDescuento,
        $validCouponCode,
        $puntosADescontar,
        $descuentoPuntos,
        $total,
        $puntosGanados,
        $notas
    );
    $stmtOrder->execute();
    $orderId = (int)$stmtOrder->insert_id;
    $stmtOrder->close();

    // 6. Insert items
    $stmtItem = $db->prepare("INSERT INTO pedido_items (pedido_id, producto_id, variante_id, variante_nombre, nombre, cantidad, precio_unitario, subtotal, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($processedItems as $pItem) {
        $stmtItem->bind_param("iiissidds",
            $orderId,
            $pItem['producto_id'],
            $pItem['variante_id'],
            $pItem['variante_nombre'],
            $pItem['nombre'],
            $pItem['cantidad'],
            $pItem['precio_unitario'],
            $pItem['subtotal'],
            $pItem['imagen_url']
        );
        $stmtItem->execute();
    }
    $stmtItem->close();

    // COMMIT TRANSACTION
    $db->commit();

    $newBalance = $availableEcoPoints - $puntosADescontar + $puntosGanados;

    jsonResponse(true, '¡Pedido confirmado exitosamente! Tu café ya se está preparando.', [
        'order_id'           => $orderId,
        'subtotal'           => $serverSubtotal,
        'descuento_cupon'    => $descuentoCupon,
        'descuento_puntos'   => $descuentoPuntos,
        'total'              => $total,
        'puntos_ganados'     => $puntosGanados,
        'puntos_canjeados'   => $puntosADescontar,
        'eco_points_balance' => $newBalance,
        'sucursal'           => $sucursalNombre,
        'items'              => $processedItems
    ], 201);

} catch (Throwable $e) {
    if (isset($db)) {
        @$db->rollback();
    }
    jsonResponse(false, 'Error al procesar el pedido. No se realizó ningún cargo ni descuento de inventario.', null, 500);
}

