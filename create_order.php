<?php
// create_order.php (VERSIÓN FINAL CON DEPURACIÓN SMTP)

session_start();

// --- Usar PHPMailer ---
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Ruta a los archivos de PHPMailer ---
require 'lib/PHPMailer/Exception.php';
require 'lib/PHPMailer/PHPMailer.php';
require 'lib/PHPMailer/SMTP.php';

// --- Conexión a la BD y configuración de respuesta ---
require 'conexion.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Error al procesar el pedido.'];

// --- 1. Verificación de Seguridad y Datos ---
if (!isset($_SESSION['loggedin'], $_SESSION['user_id'], $_SESSION['user_email'])) {
    $response['message'] = 'Sesión inválida o incompleta para realizar un pedido.';
    echo json_encode($response);
    exit;
}

$json_data = file_get_contents('php://input');
$cart_data = json_decode($json_data, true);

if (empty($cart_data['cart'])) {
    $response['message'] = 'El carrito está vacío.';
    echo json_encode($response);
    exit;
}

$usuario_id = $_SESSION['user_id'];
$total_final = $cart_data['total'];
$cart_items = $cart_data['cart'];

// --- 2. Transacción en la Base de Datos ---
$conn->begin_transaction();

try {
    // A. Insertar el resumen del pedido
    $stmt_pedido = $conn->prepare("INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, 'pendiente')");
    $stmt_pedido->bind_param("id", $usuario_id, $total_final);
    $stmt_pedido->execute();
    $pedido_id = $conn->insert_id;
    $stmt_pedido->close();

    // B. Insertar cada producto del carrito
    $stmt_detalle = $conn->prepare("INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
    foreach ($cart_items as $item) {
        $stmt_detalle->bind_param("iiid", $pedido_id, $item['id'], $item['quantity'], $item['price']);
        $stmt_detalle->execute();
    }
    $stmt_detalle->close();

    // C. Confirmar los cambios en la BD
    $conn->commit();
    
    // --- 3. Envío de Correo de Confirmación ---
    $mail = new PHPMailer(true);
    try {
        // --- MODO DEPURACIÓN SMTP ---
        // Descomenta la siguiente línea para ver el log completo.
        // $mail->SMTPDebug = 2; 

        // --- SOLUCIÓN PARA ERRORES SSL EN SERVIDORES LOCALES ---
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $config = require __DIR__ . '/config_mail.php';

$mail->isSMTP();
$mail->Host       = $config['host'];
$mail->SMTPAuth   = true;
$mail->Username   = $config['username'];
$mail->Password   = $config['password'];
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = $config['port'];

        //Remitente y Destinatario
        $mail->setFrom('no-reply@ecotiendahn.com', 'Eco Tienda HN');
        $mail->addAddress($_SESSION['user_email'], $_SESSION['user_nombre']);

        //Contenido del Correo
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Confirmacion de tu Pedido #' . $pedido_id . ' en Eco Tienda HN';
        $mail->Body    = "Hola " . htmlspecialchars($_SESSION['user_nombre']) . ",<br><br>"
                       . "Hemos recibido tu pedido con el número <strong>#" . $pedido_id . "</strong> por un total de <strong>L. " . number_format($total_final, 2) . "</strong>.<br><br>"
                       . "Lo procesaremos pronto y te notificaremos cuando sea enviado.<br><br>"
                       . "¡Gracias por tu compra sostenible!<br>"
                       . "El equipo de <strong>Eco Tienda HN</strong>";
        
        $mail->send();

    } catch (Exception $e) {
        // No detenemos el proceso si el email falla, solo lo registramos
        error_log("Mailer Error para pedido #{$pedido_id}: {$mail->ErrorInfo}");
    }

    // --- 4. Preparar la respuesta final de éxito ---
    $response['success'] = true;
    $response['message'] = '¡Pedido realizado con éxito! Revisa tu correo para la confirmación.';
    $response['order_id'] = $pedido_id;

} catch (Exception $e) {
    // Si algo falló en la BD, revertimos todo.
    $conn->rollback();
    $response['message'] = 'Error al guardar el pedido en la base de datos: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);