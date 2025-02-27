-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-02-2025 a las 02:28:41
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
-- Estructura de tabla para la tabla `area_estudio`
--

CREATE TABLE `area_estudio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(35) NOT NULL,
  `idModulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `area_estudio`
--

INSERT INTO `area_estudio` (`id`, `nombre`, `idModulo`) VALUES
(1, 'Area Matemática', 1),
(2, 'Area Interpretación y Producción de', 1),
(3, 'Area Cs Naturales', 1),
(4, 'Area Cs Sociales', 1),
(5, 'Area Matemática', 2),
(6, 'Area Interpretación y Producción de', 2),
(7, 'Cs Naturales', 2),
(8, 'Cs Sociales', 2),
(9, 'Area Matemática', 3),
(10, 'Area Interpretación y Producción de', 3),
(11, 'Cs Naturales', 3),
(12, 'Cs Sociales', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_areaestudio_modulo` (`idModulo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD CONSTRAINT `fk_areaestudio_modulo` FOREIGN KEY (`idModulo`) REFERENCES `modulos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
