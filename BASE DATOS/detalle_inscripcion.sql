-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-07-2025 a las 03:27:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ceija5_redone`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_inscripcion`
--

CREATE TABLE `detalle_inscripcion` (
  `id` int(11) NOT NULL,
  `estadoDocumentacion` varchar(10) NOT NULL,
  `fechaEntrega` date DEFAULT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `idInscripcion` int(11) NOT NULL,
  `archivoDocumentacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_inscripcion`
--

INSERT INTO `detalle_inscripcion` (`id`, `estadoDocumentacion`, `fechaEntrega`, `idDocumentaciones`, `idInscripcion`, `archivoDocumentacion`) VALUES
(1, 'Entregado', '2025-06-22', 1, 5, NULL),
(2, 'Entregado', '2025-06-22', 2, 5, NULL),
(3, 'Entregado', '2025-06-22', 8, 5, NULL),
(4, 'Entregado', '2025-06-22', 4, 5, NULL),
(5, 'Entregado', '2025-06-22', 1, 6, NULL),
(6, 'Entregado', '2025-06-22', 2, 6, NULL),
(7, 'Entregado', '2025-06-22', 8, 6, NULL),
(8, 'Entregado', '2025-06-22', 4, 6, NULL),
(9, 'Entregado', '2025-06-22', 3, 6, NULL),
(10, 'Entregado', '2025-06-22', 5, 6, NULL),
(11, 'Entregado', '2025-06-22', 1, 7, NULL),
(12, 'Entregado', '2025-06-22', 2, 7, NULL),
(13, 'Entregado', '2025-06-22', 8, 7, NULL),
(14, 'Entregado', '2025-06-22', 4, 7, NULL),
(15, 'Entregado', '2025-06-22', 3, 7, NULL),
(16, 'Entregado', '2025-06-22', 5, 7, NULL),
(17, 'Entregado', '2025-06-22', 1, 8, NULL),
(18, 'Entregado', '2025-06-22', 2, 8, NULL),
(19, 'Entregado', '2025-06-22', 8, 8, NULL),
(20, 'Entregado', '2025-06-22', 1, 9, NULL),
(21, 'Entregado', '2025-06-22', 2, 9, NULL),
(22, 'Entregado', '2025-06-22', 8, 9, NULL),
(23, 'Entregado', '2025-06-22', 4, 9, NULL),
(24, 'Entregado', '2025-06-22', 3, 9, NULL),
(25, 'Entregado', '2025-06-22', 6, 9, NULL),
(32, 'Entregado', '2025-06-22', 1, 11, NULL),
(33, 'Entregado', '2025-06-22', 2, 11, NULL),
(34, 'Entregado', '2025-06-22', 8, 11, NULL),
(35, 'Faltante', NULL, 4, 11, NULL),
(36, 'Entregado', '2025-06-22', 3, 11, NULL),
(37, 'Entregado', '2025-06-22', 5, 11, NULL),
(38, 'Entregado', '2025-06-23', 1, 12, NULL),
(39, 'Faltante', NULL, 2, 12, NULL),
(40, 'Entregado', '2025-06-23', 8, 12, NULL),
(41, 'Faltante', NULL, 4, 12, NULL),
(42, 'Faltante', NULL, 3, 12, NULL),
(43, 'Entregado', '2025-07-10', 1, 13, NULL),
(44, 'Entregado', '2025-07-10', 2, 13, NULL),
(45, 'Entregado', '2025-07-10', 8, 13, NULL),
(46, 'Entregado', '2025-07-10', 4, 13, NULL),
(47, 'Entregado', '2025-07-10', 3, 13, NULL),
(48, 'Entregado', '2025-07-10', 5, 13, NULL),
(49, 'Entregado', '2025-07-14', 1, 15, NULL),
(50, 'Entregado', '2025-07-14', 2, 15, NULL),
(51, 'Entregado', '2025-07-14', 8, 15, NULL),
(52, 'Entregado', '2025-07-14', 4, 15, NULL),
(53, 'Entregado', '2025-07-14', 3, 15, NULL),
(54, 'Entregado', '2025-07-14', 7, 15, NULL),
(55, 'Entregado', '2025-07-14', 1, 16, NULL),
(56, 'Entregado', '2025-07-14', 2, 16, NULL),
(57, 'Entregado', '2025-07-14', 8, 16, NULL),
(58, 'Entregado', '2025-07-14', 4, 16, NULL),
(59, 'Entregado', '2025-07-14', 3, 16, NULL),
(60, 'Entregado', '2025-07-14', 7, 16, NULL),
(61, 'Entregado', '2025-07-14', 6, 16, NULL),
(62, 'Entregado', '2025-07-14', 1, 17, NULL),
(63, 'Faltante', NULL, 2, 17, NULL),
(64, 'Entregado', '2025-07-14', 8, 17, NULL),
(65, 'Entregado', '2025-07-14', 4, 17, NULL),
(66, 'Faltante', NULL, 3, 17, NULL),
(72, 'Entregado', '2025-07-16', 1, 19, NULL),
(73, 'Entregado', '2025-07-16', 2, 19, NULL),
(74, 'Entregado', '2025-07-16', 8, 19, NULL),
(75, 'Entregado', '2025-07-16', 4, 19, NULL),
(76, 'Entregado', '2025-07-16', 3, 19, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalleinscripcion_documentaciones` (`idDocumentaciones`),
  ADD KEY `fk_detalleinscripcion_inscripciones` (`idInscripcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  ADD CONSTRAINT `fk_detalleinscripcion_documentaciones` FOREIGN KEY (`idDocumentaciones`) REFERENCES `documentaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleinscripcion_inscripciones` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
