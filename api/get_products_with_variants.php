<?php
/**
 * GET /api/get_products_with_variants.php
 * Fetches products, variants, and gallery with search, category filtering and sorting.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../config/database.php';

$response = [
    'success' => false,
    'message' => 'Error al consultar catálogo',
    'data'    => []
];

try {
    $db = getDbConnection();

    // Query parameters
    $search   = trim($_GET['search'] ?? '');
    $category = trim($_GET['cat'] ?? '');
    $sort     = trim($_GET['sort'] ?? 'relevancia');

    $whereClauses = [];
    $params = [];
    $types  = '';

    if (!empty($search)) {
        $whereClauses[] = '(p.nombre LIKE ? OR p.descripcion LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types   .= 'ss';
    }

    if (!empty($category) && $category !== 'Todos') {
        $whereClauses[] = 'p.categoria = ?';
        $params[] = $category;
        $types   .= 's';
    }

    $whereSql = !empty($whereClauses) ? 'WHERE ' . implode(' AND ', $whereClauses) : '';

    $orderSql = 'ORDER BY p.id ASC';
    if ($sort === 'precio-asc') {
        $orderSql = 'ORDER BY p.precio ASC';
    } elseif ($sort === 'precio-desc') {
        $orderSql = 'ORDER BY p.precio DESC';
    } elseif ($sort === 'stock') {
        $orderSql = 'ORDER BY p.stock DESC';
    }

    $sql = "SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen_url, p.categoria, p.eco_impact
            FROM productos p
            {$whereSql}
            {$orderSql}";

    $stmt = $db->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['precio'] = (float)$row['precio'];
        $row['stock']  = (int)$row['stock'];
        $row['variantes'] = [];
        $row['gallery']   = [];
        $products[$row['id']] = $row;
    }
    $stmt->close();

    // Fetch variants with prepared statement
    if (!empty($products)) {
        $productIds = array_keys($products);
        $inPlaceholders = implode(',', array_fill(0, count($productIds), '?'));
        $typesIds = str_repeat('i', count($productIds));

        $stmtVar = $db->prepare("SELECT producto_id, nombre_variante, precio_adicional FROM producto_variantes WHERE producto_id IN ({$inPlaceholders})");
        $stmtVar->bind_param($typesIds, ...$productIds);
        $stmtVar->execute();
        $resVar = $stmtVar->get_result();
        while ($var = $resVar->fetch_assoc()) {
            $var['precio_adicional'] = (float)$var['precio_adicional'];
            $products[$var['producto_id']]['variantes'][] = $var;
        }
        $stmtVar->close();
    }

    $response['success'] = true;
    $response['message'] = 'Productos obtenidos correctamente';
    $response['data']    = array_values($products);
} catch (Throwable $e) {
    http_response_code(500);
    $response['message'] = 'Error interno en el servidor';
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
