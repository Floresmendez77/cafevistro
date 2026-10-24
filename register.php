<?php
// register.php (VERSIÓN FINAL CON DEPURACIÓN SMTP)

// --- Usar PHPMailer para el envío de correos ---
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Ruta a los archivos de PHPMailer ---
// Asume una carpeta 'lib' en la raíz, al mismo nivel que este archivo.
require 'lib/PHPMailer/Exception.php';
require 'lib/PHPMailer/PHPMailer.php';
require 'lib/PHPMailer/SMTP.php';

// --- Conexión a la BD y configuración de respuesta ---
require 'conexion.php'; // Este archivo ya tiene el modo de depuración de errores PHP activado
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Error inesperado en el servidor.'];

// --- Lógica del Registro ---
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // 1. Recoger y limpiar los datos del formulario
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $direccion = trim($_POST['direccion'] ?? '');

    // 2. Validaciones del lado del servidor
    if (empty($nombre) || empty($email) || empty($telefono) || empty($password) || empty($direccion)) {
        $response['message'] = 'Todos los campos son obligatorios.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'El formato del correo electrónico es inválido.';
    } elseif ($password !== $confirm_password) {
        $response['message'] = 'Las contraseñas no coinciden.';
    } elseif (strlen($password) < 6) {
        $response['message'] = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
        // 3. Verificar si el email ya existe
        $stmt_check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt_check->bind_param("s", $email);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            $response['message'] = 'Este correo electrónico ya ha sido registrado.';
        } else {
            // 4. Insertar el nuevo usuario en la base de datos
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt_insert = $conn->prepare("INSERT INTO usuarios (nombre_completo, email, telefono, direccion, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt_insert->bind_param("sssss", $nombre, $email, $telefono, $direccion, $password_hash);
            
            if ($stmt_insert->execute()) {
                // 5. Si el usuario se creó, intentar enviar el correo de bienvenida
                $mail = new PHPMailer(true);
                try {
                    // --- MODO DEPURACIÓN SMTP ---
                    // Descomenta la siguiente línea para ver el log completo de la conexión con Brevo.
                    // $mail->SMTPDebug = 2; 

                    // --- SOLUCIÓN PARA ERRORES SSL EN SERVIDORES LOCALES ---
                    $mail->SMTPOptions = array(
                        'ssl' => array(
                            'verify_peer' => false,
                            'verify_peer_name' => false,
                            'allow_self_signed' => true
                        )
                    );

                    // Configuración del servidor SMTP (datos leídos desde config_mail.php)
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
                    $mail->addAddress($email, $nombre); 

                    //Contenido del Correo
                    $mail->isHTML(true);
                    $mail->CharSet = 'UTF-8';
                    $mail->Subject = '¡Bienvenido a la familia de Eco Tienda HN!';
                    $mail->Body    = "Hola " . htmlspecialchars($nombre) . ",<br><br>¡Gracias por unirte a nuestra comunidad sostenible! Estamos muy contentos de tenerte.<br><br>Ahora puedes iniciar sesión y explorar nuestro catálogo.<br><br>Saludos cordiales,<br>El equipo de <strong>Eco Tienda HN</strong>";
                    
                    $mail->send();
                    $response['success'] = true;
                    $response['message'] = '¡Registro completado! Se ha enviado un correo de bienvenida.';

                } catch (Exception $e) {
                    $response['success'] = true;
                    $response['message'] = "Registro exitoso, pero no se pudo enviar el correo de bienvenida. Error: {$mail->ErrorInfo}";
                }
            } else {
                $response['message'] = 'Error al crear la cuenta en la base de datos: ' . $stmt_insert->error;
            }
            $stmt_insert->close();
        }
        $stmt_check->close();
    }
} else {
    $response['message'] = 'Método de solicitud no permitido.';
}

$conn->close();
echo json_encode($response);