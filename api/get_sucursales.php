<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $db = getDbConnection();

    $result = $db->query("SELECT id, nombre, ciudad, direccion, telefono, horario FROM sucursales WHERE activo = 1 ORDER BY id ASC");
    $sucursales = [];
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $sucursales[] = $row;
    }
    $result->free();

    jsonResponse(true, 'Sucursales obtenidas exitosamente.', $sucursales);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al obtener sucursales.', null, 500);
}
