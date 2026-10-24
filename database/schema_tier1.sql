-- ==========================================================
-- CAFÉ VISTRO HN / ECOTIENDA - TIER 1 DATABASE SCHEMA
-- ==========================================================

CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `imagen_url` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(80) NOT NULL,
  `eco_impact` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `producto_variantes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT NOT NULL,
  `nombre_variante` VARCHAR(100) NOT NULL,
  `precio_adicional` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `producto_imagenes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT NOT NULL,
  `imagen_url` VARCHAR(255) NOT NULL,
  `orden` INT DEFAULT 0,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cupones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `tipo` ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
  `valor` DECIMAL(10, 2) NOT NULL,
  `minimo_compra` DECIMAL(10, 2) DEFAULT 0.00,
  `activo` TINYINT(1) DEFAULT 1,
  `expira_el` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_product` (`usuario_id`, `producto_id`),
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEED DATA FOR TIER 1 COUPONS
INSERT INTO `cupones` (`codigo`, `tipo`, `valor`, `minimo_compra`, `activo`) VALUES
('CAFE15', 'percent', 15.00, 0.00, 1),
('VISTRO50', 'fixed', 50.00, 200.00, 1),
('BARISTA20', 'percent', 20.00, 350.00, 1)
ON DUPLICATE KEY UPDATE `activo`=1;
