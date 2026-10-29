<?php
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Método HTTP no permitido.', null, 405);
}

try {
    $input = getJsonInput();
    $nombre = trim($input['nombre_completo'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $password = (string)($input['password'] ?? '');
    $telefono = trim($input['telefono'] ?? '');
    $direccion = trim($input['direccion'] ?? '');

    if (empty($nombre) || empty($email) || empty($password)) {
        jsonResponse(false, 'Nombre completo, correo y contraseña son obligatorios.', null, 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(false, 'El formato del correo electrónico es inválido.', null, 400);
    }

    if (strlen($password) < 6) {
        jsonResponse(false, 'La contraseña debe tener al menos 6 caracteres.', null, 400);
    }

    $db = getDbConnection();

    // Check if email already registered
    $stmtCheck = $db->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
    $stmtCheck->bind_param("s", $email);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows > 0) {
        $stmtCheck->close();
        jsonResponse(false, 'Este correo electrónico ya está registrado. Inicia sesión.', null, 409);
    }
    $stmtCheck->close();

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $initialPoints = 50;

    $stmtInsert = $db->prepare("INSERT INTO usuarios (nombre_completo, email, password, telefono, direccion, eco_points, role) VALUES (?, ?, ?, ?, ?, ?, 'cliente')");
    $stmtInsert->bind_param("sssssi", $nombre, $email, $hash, $telefono, $direccion, $initialPoints);
    $stmtInsert->execute();
    $newId = $stmtInsert->insert_id;
    $stmtInsert->close();

    session_regenerate_id(true);
    $_SESSION['user_id'] = $newId;

    $user = [
        'id'              => $newId,
        'nombre_completo' => $nombre,
        'email'           => $email,
        'telefono'        => $telefono,
        'direccion'       => $direccion,
        'eco_points'      => $initialPoints,
        'role'            => 'cliente'
    ];

    jsonResponse(true, 'Registro exitoso. ¡Bienvenido a Café Vistro!', [
        'user'       => $user,
        'csrf_token' => getCsrfToken()
    ], 201);
} catch (Throwable $e) {
    jsonResponse(false, 'Ocurrió un error al procesar el registro.', null, 500);
}

