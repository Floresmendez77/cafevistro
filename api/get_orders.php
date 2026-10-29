<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $db = getDbConnection();
    $user = requireAuth($db);

    $isAdmin = ($user['role'] ?? '') === 'admin';
    $all = isset($_GET['all']) && $_GET['all'] === 'true' && $isAdmin;

    if ($all) {
        $stmt = $db->prepare("SELECT p.id, p.usuario_id, p.sucursal, p.subtotal, p.descuento, p.cupon_codigo, p.puntos_canjeados, p.descuento_puntos, p.total, p.puntos_ganados, p.estado, p.notas, p.fecha_pedido, u.nombre_completo as cliente_nombre, u.email as cliente_email FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.id DESC");
    } else {
        $stmt = $db->prepare("SELECT id, usuario_id, sucursal, subtotal, descuento, cupon_codigo, puntos_canjeados, descuento_puntos, total, puntos_ganados, estado, notas, fecha_pedido FROM pedidos WHERE usuario_id = ? ORDER BY id DESC");
        $stmt->bind_param("i", $user['id']);
    }

    $stmt->execute();
    $ordersRes = $stmt->get_result();

    $orders = [];
    $orderIds = [];

    while ($order = $ordersRes->fetch_assoc()) {
        $order['id'] = (int)$order['id'];
        $order['usuario_id'] = (int)$order['usuario_id'];
        $order['subtotal'] = (float)$order['subtotal'];
        $order['descuento'] = (float)$order['descuento'];
        $order['descuento_puntos'] = (float)$order['descuento_puntos'];
        $order['puntos_canjeados'] = (int)$order['puntos_canjeados'];
        $order['total'] = (float)$order['total'];
        $order['puntos_ganados'] = (int)$order['puntos_ganados'];
        $order['items'] = [];
        $orders[$order['id']] = $order;
        $orderIds[] = $order['id'];
    }
    $stmt->close();

    // Query items for these orders
    if (!empty($orderIds)) {
        $inClause = implode(',', array_fill(0, count($orderIds), '?'));
        $types = str_repeat('i', count($orderIds));
        $stmtItems = $db->prepare("SELECT id, pedido_id, producto_id, variante_id, variante_nombre, nombre, cantidad, precio_unitario, subtotal, imagen_url FROM pedido_items WHERE pedido_id IN ($inClause) ORDER BY id ASC");
        $stmtItems->bind_param($types, ...$orderIds);
        $stmtItems->execute();
        $itemsRes = $stmtItems->get_result();
        while ($item = $itemsRes->fetch_assoc()) {
            $pId = (int)$item['pedido_id'];
            if (isset($orders[$pId])) {
                $orders[$pId]['items'][] = [
                    'id'              => (int)$item['id'],
                    'producto_id'     => (int)$item['producto_id'],
                    'variante_id'     => $item['variante_id'] !== null ? (int)$item['variante_id'] : null,
                    'variante_nombre' => $item['variante_nombre'],
                    'nombre'          => $item['nombre'],
                    'cantidad'        => (int)$item['cantidad'],
                    'precio_unitario' => (float)$item['precio_unitario'],
                    'subtotal'        => (float)$item['subtotal'],
                    'imagen_url'      => $item['imagen_url']
                ];
            }
        }
        $stmtItems->close();
    }

    jsonResponse(true, 'Pedidos recuperados exitosamente.', array_values($orders));
} catch (Throwable $e) {
    jsonResponse(false, 'Error al recuperar los pedidos.', null, 500);
}

