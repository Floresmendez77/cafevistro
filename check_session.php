<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        'loggedin' => true,
        'nombre' => $_SESSION['user_nombre'],
        'user_id' => $_SESSION['user_id']
    ]);
} else {
    echo json_encode(['loggedin' => false]);
}