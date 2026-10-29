-- ==========================================================
-- CAFÉ VISTRO HN - TIER 2 DATABASE SCHEMA & INITIAL SEEDS
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `cafe_vistro` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cafe_vistro`;

-- 1. USUARIOS
DROP TABLE IF EXISTS `wishlist`;
DROP TABLE IF EXISTS `pedido_items`;
DROP TABLE IF EXISTS `pedidos`;
DROP TABLE IF EXISTS `producto_variantes`;
DROP TABLE IF EXISTS `producto_imagenes`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `cupones`;
DROP TABLE IF EXISTS `sucursales`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `eco_points` INT NOT NULL DEFAULT 0,
  `role` ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  `failed_attempts` INT NOT NULL DEFAULT 0,
  `lockout_until` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_usuario_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SUCURSALES
CREATE TABLE `sucursales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `ciudad` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `horario` VARCHAR(100) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PRODUCTOS
CREATE TABLE `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `imagen_url` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(80) NOT NULL,
  `eco_impact` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_producto_categoria` (`categoria`),
  INDEX `idx_producto_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. VARIANTES DE PRODUCTOS
CREATE TABLE `producto_variantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT NOT NULL,
  `nombre_variante` VARCHAR(100) NOT NULL,
  `precio_adicional` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE,
  INDEX `idx_variante_producto` (`producto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CUPONES DE DESCUENTO
CREATE TABLE `cupones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `tipo` ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
  `valor` DECIMAL(10, 2) NOT NULL,
  `minimo_compra` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `expira_el` DATETIME DEFAULT NULL,
  INDEX `idx_cupon_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PEDIDOS
CREATE TABLE `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `sucursal_id` INT DEFAULT NULL,
  `sucursal` VARCHAR(150) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `descuento` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `cupon_codigo` VARCHAR(50) DEFAULT NULL,
  `puntos_canjeados` INT NOT NULL DEFAULT 0,
  `descuento_puntos` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10, 2) NOT NULL,
  `puntos_ganados` INT NOT NULL DEFAULT 0,
  `estado` ENUM('pendiente', 'en_proceso', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  `notas` TEXT DEFAULT NULL,
  `fecha_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales`(`id`) ON DELETE SET NULL,
  INDEX `idx_pedido_usuario` (`usuario_id`),
  INDEX `idx_pedido_fecha` (`fecha_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. DETALLE DE ITEMS DE PEDIDO
CREATE TABLE `pedido_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `variante_id` INT DEFAULT NULL,
  `variante_nombre` VARCHAR(100) DEFAULT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10, 2) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT,
  INDEX `idx_item_pedido` (`pedido_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WISHLIST
CREATE TABLE `wishlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_product` (`usuario_id`, `producto_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BLOG POSTS
CREATE TABLE `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `resumen` TEXT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  `tag` VARCHAR(100) NOT NULL,
  `read_time` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Usuarios (Stephen Andrew con clave hashed 'demo123' y rol admin)
INSERT INTO `usuarios` (`id`, `nombre_completo`, `email`, `password`, `telefono`, `direccion`, `eco_points`, `role`) VALUES
(1, 'Stephen Andrew', 'sthephenandrew56@gmail.com', '$2y$10$A1P/4VMLceSF6nZ5DNNvCeLBCZxXCeLu.W6pyKDj4mRSJxiCHcPpW', '+504 8791-7652', 'Colonia Palmira, Tegucigalpa, Francisco Morazán', 180, 'admin');

-- Sucursales
INSERT INTO `sucursales` (`id`, `nombre`, `ciudad`, `direccion`, `telefono`, `horario`, `activo`) VALUES
(1, 'Mall Multiplaza', 'Tegucigalpa', 'Nivel 2, Food Court & Retail, Tegucigalpa, F.M.', '+504 2280-4500', 'Lun - Dom: 7:00 AM - 9:00 PM', 1),
(2, 'Mall Galerías', 'San Pedro Sula', 'Nivel 1, Pasillo Central, San Pedro Sula, Cortés', '+504 2550-1200', 'Lun - Dom: 8:00 AM - 8:30 PM', 1);

-- Cupones
INSERT INTO `cupones` (`id`, `codigo`, `tipo`, `valor`, `minimo_compra`, `activo`) VALUES
(1, 'CAFE15', 'percent', 15.00, 0.00, 1),
(2, 'VISTRO50', 'fixed', 50.00, 200.00, 1),
(3, 'BARISTA20', 'percent', 20.00, 350.00, 1);

-- Productos
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen_url`, `categoria`, `eco_impact`) VALUES
(1, 'Café Especial Marcala Reserva Orgánica', 'Café de estricta altura (SHG) cultivado bajo sombra a 1,650 msnm en Marcala, La Paz. Perfil aromático con notas a chocolate amargo, avellana tostada y miel de caña.', 195.00, 45, '/cafe_marcala.jpg', 'Café en Grano y Molido', 'Cultivo 100% orgánico bajo sombra que protege las aves y cuencas de Honduras'),
(2, 'Café Geisha Santa Bárbara Edición Limitada', 'Micro-lote de variedad Geisha de la Finca Santa Elena en Santa Bárbara. Proceso honey artesanal con notas florales a jazmín, bergamota, melocotón y una acidez brillante y sedosa.', 380.00, 20, '/cafe_geisha.jpg', 'Café de Especialidad', 'Proceso Honey ecológico que ahorra un 85% de agua en beneficio húmedo'),
(3, 'Prensa Francesa de Cobre y Vidrio Borosilicato', 'Elegante cafetera de prensa francesa con estructura de cobre pulido y vaso de vidrio borosilicato resistente a altas temperaturas. Extrae los aceites esenciales del café para un cuerpo denso y aromático.', 450.00, 25, '/prensa_francesa.jpg', 'Métodos de Extracción', 'Cero filtros de papel ni residuos plásticos. Construida para décadas de uso'),
(4, 'Molino Manual Cónico en Acero y Madera de Nogal', 'Molinillo de café de precisión con muelas cónicas de acero inoxidable grado 420 y cuerpo de madera de nogal natural. Ajuste micrométrico de molienda desde espresso hasta prensa francesa.', 680.00, 18, '/molino_manual.jpg', 'Accesorios Barista', 'Molienda manual de cero emisión eléctrica con durabilidad de por vida'),
(5, 'Cafetera V60 Cerámica Negro Mate & Servidor de Vidrio', 'Cono de goteo V60 en cerámica negra mate de alta retención térmica con espirales internas para máxima extracción. Incluye servidor de vidrio con marcas dosificadoras.', 390.00, 30, '/cafetera_v60.jpg', 'Métodos de Extracción', 'Cerámica cocida a altas temperaturas con pigmentos minerales 100% no tóxicos'),
(6, 'Cold Brew Concentrado 18 Horas (Botella de Vidrio)', 'Café de especialidad extraído en frío durante 18 horas gota a gota. Suave, achocolatado y con un 65% menos de acidez que el café caliente tradicional. Listo para servir con hielo.', 120.00, 40, '/cold_brew.jpg', 'Bebidas Preparadas', 'Botella de vidrio vintage reutilizable con sistema de devolución de envase'),
(7, 'Set de Tazas y Platillos de Cerámica Artesanal (2 Unidades)', 'Juego de dos tazas artesanales estilo flat white/capuchino con platillos de terracota. Textura moteada en crema y barro cocido, moldeadas a mano por alfareros hondureños.', 280.00, 22, '/tazas_ceramica.jpg', 'Vajilla y Hogar', 'Alfarería comunitaria local que apoya economías artesanales de Honduras'),
(8, 'Chorreador Tradicional Hondureño de Madera y Tela', 'El método tradicional hondureño para colar café en su máxima expresión. Soporte de madera noble tallada con sello "Hecho en Honduras" y bolsa de filtro de tela de algodón orgánico.', 260.00, 35, '/chorreador_cafe.jpg', 'Métodos de Extracción', 'Filtro de algodón 100% orgánico lavable y reutilizable más de 300 veces'),
(9, 'Tamper Barista Pro en Acero Quirúrgico & Palo Rosa', 'Prensador ergonómico de 58mm para café espresso profesional. Base plana en acero inoxidable 304 calibrada a peso perfecto y mango de madera pulida para un apisonado uniforme.', 310.00, 24, '/tamper_barista.jpg', 'Accesorios Barista', 'Materiales nobles sin plásticos que garantizan precisión por décadas'),
(10, 'Espresso Doble de Especialidad Marcala (Taza Servida Barista)', 'Extracción pura de café de estricta altura de Marcala. Crema densa y avellanada de persistencia prolongada, cuerpo untuoso y notas intensas a chocolate oscuro y cáscara de naranja.', 65.00, 50, '/espresso_shot.jpg', 'Bebidas Preparadas', 'Granos 100% orgánicos de comercio justo con huella de carbono neutral compensada'),
(11, 'Iced Latte Macchiato en Vaso Cristalino', 'Bebida de tres capas servida en vaso de vidrio facetado: sirope artesanal de vainilla silvestre, leche fresca texturizada sobre hielo tallado y corona de espresso doppio recién extraído.', 85.00, 35, '/iced_latte.jpg', 'Bebidas Preparadas', 'Servido en vaso de vidrio reutilizable con pajilla de bambú natural biodegradable'),
(12, 'Tiramisú Tradicional al Espresso Marcala', 'Postre insignia italiano elaborado con savoiardi empapados en café espresso SHG de Marcala recién extraído y licor de café, capas untuosas de crema de mascarpone auténtico y velo espolvoreado de cacao amargo holandés.', 110.00, 28, '/tiramisu_espresso.jpg', 'Repostería de Autor', 'Empaque biodegradable de caña de azúcar 100% compostable sin plásticos'),
(13, 'Croissant Artesanal de Mantequilla & Glaseado de Café', 'Hojaldre francés fermentado lentamente durante 72 horas con pura mantequilla de pastura. Horneado a corteza crocante caramelizada, cubierto con glaseado sedoso de infusión de café espresso y almendras tostadas fileteadas.', 68.00, 35, '/croissant_cafe.jpg', 'Repostería de Autor', 'Horneado en hornos solares térmicos y empacado en papel kraft reciclado'),
(14, 'Basque Burnt Cheesecake de Café & Caramelo Salado', 'Tarta de queso estilo Donostia horneada a alta temperatura para lograr una superficie tostada acaramelada y un corazón cremoso fundente, infusionada con extracto de espresso de especialidad y caramelo con sal marina de San Lorenzo.', 125.00, 18, '/cheesecake_espresso.jpg', 'Repostería de Autor', 'Ingredientes de granjas lecheras regenerativas locales de Olancho'),
(15, 'Affogato al Caffè con Gelato de Vainilla de Roatán', 'La suprema combinación italo-hondureña: una generosa bola de helado artesanal fior di latte con semillas de vainilla silvestre de Roatán, ahogada al momento con un shot doble de espresso hirviendo con crema densa.', 95.00, 30, '/affogato_artesanal.jpg', 'Bebidas Preparadas', 'Servido en cristalería grabada reutilizable o vaso térmico de bagazo'),
(16, 'Éclair Francés de Crema de Espresso & Cobertura Espejo', 'Masa choux crujiente y aireada rellena de suntuosa crema pastelera mousseline aromatizada con espresso de Santa Bárbara, coronada con glaseado espejo de ganache de café y copos de oro comestible.', 75.00, 22, '/eclair_espresso.jpg', 'Repostería de Autor', 'Empaque de celulosa vegetal transparente 100% biodegradable en 60 días'),
(17, 'Carajillo de Altura con Licor 43 & Café Marcala', 'Cóctel emblemático servido en vaso old fashioned tallado con hielo cristalino artesanal: doble shot de espresso Marcala recién preparado agitado con Licor 43 especiado y un perfume de piel de naranja quemada.', 135.00, 25, '/carajillo_espresso.jpg', 'Bebidas Preparadas', 'Hielo elaborado con agua purificada de manantial filtrada por osmosis inversa'),
(18, 'Flat White de Especialidad con Microespuma Sedosa', 'Doble ristretto extraído a 9 bares de presión con leche emulsionada a textura de terciopelo líquido y microespuma brillante sin burbujas. Decorado con latte art de tulipán o rosetta.', 78.00, 40, '/flat_white_art.jpg', 'Bebidas Preparadas', 'Taza de cerámica térmica o vaso para llevar libre de polietileno');

-- Variantes
INSERT INTO `producto_variantes` (`producto_id`, `nombre_variante`, `precio_adicional`) VALUES
(1, '340g Grano Entero (Tueste Medio)', 0.00),
(1, '340g Molido Medio para Cafetera', 0.00),
(1, '1 Kg Grano Entero (Ahorro Familiar)', 280.00),
(2, 'Bolsa 250g Grano Entero', 0.00),
(2, 'Bolsa 250g Molido Fino V60', 0.00),
(2, 'Lata Hermética Colección 500g', 340.00),
(3, 'Capacidad 600ml (3 Tazas)', 0.00),
(3, 'Capacidad 1000ml (8 Tazas)', 160.00),
(6, 'Botella Individual 500ml', 0.00),
(6, 'Pack Semanal (3 Botellas de 500ml)', 190.00),
(10, 'Extracción Simple (30ml)', 0.00),
(10, 'Doble Ristretto Intenso (40ml)', 10.00),
(10, 'Espresso Doppio Signature (60ml)', 15.00),
(11, 'Leche Entera Barista (12oz)', 0.00),
(11, 'Leche de Avena Barista Plant-Based (12oz)', 15.00),
(11, 'Edición Vainilla de Roatán Grande (16oz)', 25.00),
(12, 'Porción Individual Gourmet (180g)', 0.00),
(12, 'Caja Dúo Degustación con Grano Tostado', 95.00),
(13, 'Clásico Glaseado al Café', 0.00),
(13, 'Relleno de Crema de Avellanas & Moca', 22.00),
(14, 'Rebanada Cremosa de Tarta', 0.00),
(14, 'Tarta Entera Artesanal (6 Porciones)', 480.00),
(15, 'Gelato de Vainilla Roatán Clásico', 0.00),
(15, 'Gelato de Avellana Piamonte Artesanal', 18.00),
(15, 'Doble Shot Espresso de Altura Extra', 20.00),
(16, 'Éclair Individual de Colección', 0.00),
(16, 'Trilogía Éclairs (Espresso, Caramelo, Cacao)', 130.00),
(17, 'Carajillo Shaken Clásico (En las Rocas)', 0.00),
(17, 'Carajillo Ahumado con Madera de Café', 25.00),
(18, 'Taza 6oz Leche Entera Barista', 0.00),
(18, 'Taza 6oz Leche de Avena Barista Edition', 15.00),
(18, 'Taza 6oz Leche de Almendras Artesanal', 15.00);

-- Blog Posts
INSERT INTO `blog_posts` (`id`, `title`, `resumen`, `content`, `tag`, `read_time`) VALUES
(1, 'El Secreto del Café de Marcala: Altura, Suelo y Tradición', 'Por qué la Denominación de Origen Marcala produce uno de los perfiles en taza más codiciados del mundo.', 'Enclavada en el departamento de La Paz a más de 1,600 metros de altitud, Marcala fue la primera Denominación de Origen de café protegida en Centroamérica. Su suelo volcánico rico en minerales, la sombra de bosques nativos de liquidámbar y los vientos frescos de montaña permiten que las cerezas de café maduren lentamente, concentrando azúcares naturales y aceites esenciales que dan vida a notas inconfundibles de chocolate amargo, caramelo y flores silvestres.', 'Origen y Terroir', '3 min de lectura'),
(2, 'Guía de Extracción: V60 vs Prensa Francesa, ¿cuál es tu método?', 'Compara claridad aromática vs cuerpo denso para encontrar tu método de preparación perfecto.', 'Si buscas una taza limpia, brillante y aromática donde brillen las notas florales y frutales de un café Geisha, el método de goteo V60 es insuperable gracias a su filtrado fino y extracción por gravedad. Por otro lado, si prefieres un café con cuerpo robusto, sedoso y sensación envolvente para acompañar tus mañanas, la prensa francesa retiene los aceites naturales del café gracias a su émbolo de malla metálica.', 'Guía Barista', '4 min de lectura'),
(3, 'Por qué moler el café al momento transforma por completo tu taza', 'La oxidación del grano molido y cómo conservar el 90% de los compuestos aromáticos.', 'En tan solo 15 minutos después de moler el café, se evaporan hasta el 60% de los compuestos aromáticos más volátiles. Invertir en un molino manual con muelas cónicas te permite moler exactamente la dosis que vas a preparar al momento, garantizando una crema espesa, aromas embriagadores y una dulzura natural que nunca encontrarás en un café premolido industrial.', 'Consejos de Cata', '5 min de lectura');

-- Pedidos iniciales para el usuario 1
INSERT INTO `pedidos` (`id`, `usuario_id`, `sucursal_id`, `sucursal`, `subtotal`, `descuento`, `total`, `puntos_ganados`, `estado`, `fecha_pedido`) VALUES
(1001, 1, 1, 'Mall Multiplaza', 390.00, 0.00, 390.00, 39, 'entregado', '2026-10-18 10:30:00'),
(1002, 1, 2, 'Mall Galerías', 380.00, 0.00, 380.00, 38, 'pendiente', '2026-10-23 15:45:00');

INSERT INTO `pedido_items` (`pedido_id`, `producto_id`, `nombre`, `cantidad`, `precio_unitario`, `subtotal`, `imagen_url`) VALUES
(1001, 1, 'Café Especial Marcala Reserva Orgánica', 2, 195.00, 390.00, '/cafe_marcala.jpg'),
(1002, 2, 'Café Geisha Santa Bárbara Edición Limitada', 1, 380.00, 380.00, '/cafe_geisha.jpg');

-- Wishlist inicial
INSERT INTO `wishlist` (`usuario_id`, `producto_id`) VALUES
(1, 1),
(1, 2);

