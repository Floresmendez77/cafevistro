<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $db = getDbConnection();

    // Query active products
    $result = $db->query("SELECT id, nombre, descripcion, precio, stock, imagen_url, categoria, eco_impact, created_at FROM productos WHERE activo = 1 ORDER BY id ASC");
    $products = [];
    $productMap = [];

    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['precio'] = (float)$row['precio'];
        $row['stock'] = (int)$row['stock'];
        $row['variantes'] = [];
        $products[] = $row;
        $productMap[$row['id']] = count($products) - 1;
    }
    $result->free();

    // Fetch all variants in one query
    if (!empty($products)) {
        $varResult = $db->query("SELECT id, producto_id, nombre_variante, precio_adicional FROM producto_variantes ORDER BY producto_id ASC, id ASC");
        while ($varRow = $varResult->fetch_assoc()) {
            $pId = (int)$varRow['producto_id'];
            if (isset($productMap[$pId])) {
                $idx = $productMap[$pId];
                $products[$idx]['variantes'][] = [
                    'id'               => (int)$varRow['id'],
                    'nombre_variante'  => $varRow['nombre_variante'],
                    'precio_adicional' => (float)$varRow['precio_adicional']
                ];
            }
        }
        $varResult->free();
    }

    jsonResponse(true, 'Productos obtenidos exitosamente.', $products);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al obtener el catálogo de productos.', null, 500);
}
