<?php
require_once __DIR__ . '/bootstrap.php';

try {
    $db = getDbConnection();

    $result = $db->query("SELECT id, title, resumen, content, tag, read_time as readTime, created_at FROM blog_posts ORDER BY id ASC");
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $posts[] = $row;
    }
    $result->free();

    jsonResponse(true, 'Artículos de blog obtenidos exitosamente.', $posts);
} catch (Throwable $e) {
    jsonResponse(false, 'Error al obtener los artículos de blog.', null, 500);
}

