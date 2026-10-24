<?php
require 'conexion.php';
header('Content-Type: application/json');

$sql = "SELECT id, nombre, descripcion, precio, stock, imagen_url FROM productos ORDER BY id ASC";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();