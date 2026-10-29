<?php
/**
 * config/database.php
 * Database connection provider with minimal .env loader and mysqli prepared statement support.
 */

function loadEnv(string $filePath): void {
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            // Remove surrounding quotes if present
            if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
                (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
                $value = substr($value, 1, -1);
            }

            if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Automatically attempt to load root .env
loadEnv(dirname(__DIR__) . '/.env');

function getDbConnection(): mysqli {
    static $conn = null;
    if ($conn !== null) {
        return $conn;
    }

    $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
    $user = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root');
    $pass = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
    $name = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'cafe_vistro');
    $port = (int)(getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? 3306));

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = new mysqli($host, $user, $pass, $name, $port);
    $conn->set_charset('utf8mb4');

    return $conn;
}
