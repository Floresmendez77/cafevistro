-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 22-06-2025 a las 01:28:29
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecotienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` int UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','procesando','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `fecha_pedido` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id_fk` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `total`, `estado`, `fecha_pedido`) VALUES
(1, 1, 480.00, 'pendiente', '2025-06-21 22:00:52'),
(2, 1, 600.00, 'pendiente', '2025-06-21 22:01:35'),
(3, 1, 192.00, 'pendiente', '2025-06-22 00:07:16'),
(4, 1, 192.00, 'pendiente', '2025-06-22 00:07:18'),
(5, 2, 150.00, 'pendiente', '2025-06-22 00:16:52'),
(6, 3, 150.00, 'pendiente', '2025-06-22 00:33:10'),
(7, 3, 150.00, 'pendiente', '2025-06-22 00:33:12'),
(8, 3, 150.00, 'pendiente', '2025-06-22 00:33:13'),
(9, 4, 150.00, 'pendiente', '2025-06-22 00:48:35'),
(10, 4, 150.00, 'pendiente', '2025-06-22 00:48:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_detalle`
--

DROP TABLE IF EXISTS `pedidos_detalle`;
CREATE TABLE IF NOT EXISTS `pedidos_detalle` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` int UNSIGNED NOT NULL,
  `producto_id` int UNSIGNED NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id_fk` (`pedido_id`),
  KEY `producto_id_fk` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedidos_detalle`
--

INSERT INTO `pedidos_detalle` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 2, 150.00),
(2, 1, 2, 2, 90.00),
(3, 2, 1, 1, 150.00),
(4, 2, 2, 5, 90.00),
(5, 3, 1, 2, 150.00),
(6, 4, 1, 2, 150.00),
(7, 5, 1, 1, 150.00),
(8, 6, 1, 1, 150.00),
(9, 7, 1, 1, 150.00),
(10, 8, 1, 1, 150.00),
(11, 9, 1, 1, 150.00),
(12, 10, 1, 1, 150.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `imagen_url` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen_url`, `fecha_creacion`) VALUES
(1, 'Bolsa de Algodón', '100% algodón orgánico, lavable y resistente.', 150.00, 200, 'Bolsa_Ecologica.jpeg', '2025-06-21 21:46:34'),
(2, 'Jabón Artesanal', 'Sin fragancias artificiales, libre de crueldad.', 90.00, 120, 'jabones_artesanales.jpeg', '2025-06-21 21:46:34'),
(3, 'Cepillo de Bambú', 'Mango 100% biodegradable, cerdas suaves.', 70.00, 300, 'cepillo_de_bambu.jpeg', '2025-06-21 21:46:34'),
(4, 'Kit Pajillas Metálicas', 'Incluye 4 pajillas, cepillo y estuche de tela.', 120.00, 150, 'kit_pajillas.jpeg', '2025-06-21 21:46:34'),
(5, 'Detergente Ecológico', '1 Litro concentrado, biodegradable.', 200.00, 80, 'detergente_ecologico.jpeg', '2025-06-21 21:46:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_variantes`
--

DROP TABLE IF EXISTS `producto_variantes`;
CREATE TABLE IF NOT EXISTS `producto_variantes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `producto_id` int UNSIGNED NOT NULL,
  `nombre_variante` varchar(255) NOT NULL,
  `precio_adicional` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `producto_variantes`
--

INSERT INTO `producto_variantes` (`id`, `producto_id`, `nombre_variante`, `precio_adicional`) VALUES
(1, 1, 'Algodón Canvas (Más resistente)', 25.00),
(2, 1, 'Diseño tipo Mochila', 15.00),
(3, 2, 'Avena y Miel Calmante', 5.00),
(4, 2, 'Carbón Activado Detox', 10.00),
(5, 3, 'Cerdas con Carbón Activado', 10.00),
(6, 3, 'Tamaño para Niño', -5.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(25) NOT NULL,
  `direccion` text NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unico` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_completo`, `email`, `telefono`, `direccion`, `password_hash`, `fecha_registro`) VALUES
(1, 'Andrew Estheven', 'Andrewito23on@gmail.com', '87917652', 'Colonia San Francisco', '$2y$10$3HQ.INncE4cOAZpxsJRLuOdP9XlR1lXGen05z78LuVwAchQFCCxli', '2025-06-21 21:11:38'),
(2, 'Estheven', 'sthephenandrew56@gmail.com', '97352928', 'Colonia San Francisco', '$2y$10$yRSIRdwIYI4mrERp9NYKl.e4.YSa2ZfCVvKh69Hbmq9UTk3Q2I63a', '2025-06-22 00:16:24'),
(3, 'Flores', 'secretariageneralproasol2024@gmail.com', '87917652', 'Colonia San Francisco', '$2y$10$XNyBdBKrWFsHF2oq1co26OLL3ckkr8h0Ak.mjDzd8yROvQuxSbtIa', '2025-06-22 00:31:37'),
(4, 'Mendez', 'vasqueslopex4@gmail.com', '97352928', 'Colonia San Francisco', '$2y$10$7DO6yUrJu2h80ZIB97QUcO5nvi2e0czl2kEcCJ1ErKAOKfAsXWmaW', '2025-06-22 00:37:42');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `usuario_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  ADD CONSTRAINT `pedido_id_fk` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `producto_id_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  ADD CONSTRAINT `producto_variantes_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
