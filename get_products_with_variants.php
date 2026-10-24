<?php
require 'conexion.php';
header('Content-Type: application/json');

$sql_productos = "SELECT id, nombre, descripcion, precio, stock, imagen_url FROM productos ORDER BY id ASC";
$result_productos = $conn->query($sql_productos);

$productos = [];
if ($result_productos->num_rows > 0) {
    while($row = $result_productos->fetch_assoc()) {
        $row['variantes'] = []; // Prepara un array para las variantes
        $productos[$row['id']] = $row; // Usa el ID del producto como clave
    }
}

$sql_variantes = "SELECT producto_id, nombre_variante, precio_adicional FROM producto_variantes";
$result_variantes = $conn->query($sql_variantes);

if ($result_variantes->num_rows > 0) {
    while($row = $result_variantes->fetch_assoc()) {
        // Si el producto existe en nuestro array, añade la variante
        if (isset($productos[$row['producto_id']])) {
            $productos[$row['producto_id']]['variantes'][] = $row;
        }
    }
}

// Re-indexa el array para que sea una lista normal y no asociativa
echo json_encode(array_values($productos));
$conn->close();