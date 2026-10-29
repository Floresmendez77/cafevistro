<?php
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Método HTTP no permitido.', null, 405);
}

try {
    $input = getJsonInput();
    $email = strtolower(trim($input['email'] ?? ''));
    $password = (string)($input['password'] ?? '');

    if (empty($email) || empty($password)) {
        jsonResponse(false, 'Correo y contraseña son requeridos.', null, 400);
    }

    $db = getDbConnection();

    $stmt = $db->prepare("SELECT id, nombre_completo, email, password, telefono, direccion, eco_points, role, failed_attempts, lockout_until FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();
    $stmt->close();

    if (!$user) {
        // Prevent user enumeration by taking similar time
        password_verify('dummy', '$2y$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456');
        jsonResponse(false, 'Credenciales inválidas.', null, 401);
    }

    // Check lockout
    if (!empty($user['lockout_until'])) {
        $lockoutTime = strtotime($user['lockout_until']);
        if ($lockoutTime > time()) {
            $minutesLeft = ceil(($lockoutTime - time()) / 60);
            jsonResponse(false, "Cuenta bloqueada temporalmente por intentos fallidos. Intenta nuevamente en {$minutesLeft} minutos.", null, 429);
        }
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        $failedAttempts = (int)$user['failed_attempts'] + 1;
        if ($failedAttempts >= 5) {
            $lockoutStmt = $db->prepare("UPDATE usuarios SET failed_attempts = ?, lockout_until = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?");
            $lockoutStmt->bind_param("ii", $failedAttempts, $user['id']);
            $lockoutStmt->execute();
            $lockoutStmt->close();
            jsonResponse(false, 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 15 minutos.', null, 429);
        } else {
            $failStmt = $db->prepare("UPDATE usuarios SET failed_attempts = ? WHERE id = ?");
            $failStmt->bind_param("ii", $failedAttempts, $user['id']);
            $failStmt->execute();
            $failStmt->close();
            jsonResponse(false, 'Credenciales inválidas.', null, 401);
        }
    }

    // Successful login: reset failed attempts and lockout
    $resetStmt = $db->prepare("UPDATE usuarios SET failed_attempts = 0, lockout_until = NULL WHERE id = ?");
    $resetStmt->bind_param("i", $user['id']);
    $resetStmt->execute();
    $resetStmt->close();

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];

    unset($user['password'], $user['failed_attempts'], $user['lockout_until']);

    jsonResponse(true, 'Inicio de sesión exitoso.', [
        'user'       => $user,
        'csrf_token' => getCsrfToken()
    ]);
} catch (Throwable $e) {
    jsonResponse(false, 'Error interno durante el inicio de sesión.', null, 500);
}

