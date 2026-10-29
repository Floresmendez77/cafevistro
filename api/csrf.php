<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $token = getCsrfToken();
    jsonResponse(true, 'Token CSRF generado.', ['csrf_token' => $token]);
} catch (Throwable $e) {
    jsonResponse(false, 'Error interno del servidor.', null, 500);
}
