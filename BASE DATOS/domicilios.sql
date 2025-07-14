-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-07-2025 a las 05:12:36
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
-- Estructura de tabla para la tabla `domicilios`
--

CREATE TABLE `domicilios` (
  `id` int(11) NOT NULL,
  `calle` varchar(50) NOT NULL,
  `numero` int(11) NOT NULL,
  `idBarrio` int(11) NOT NULL,
  `idLocalidad` int(11) DEFAULT NULL,
  `idProvincia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `domicilios`
--

INSERT INTO `domicilios` (`id`, `calle`, `numero`, `idBarrio`, `idLocalidad`, `idProvincia`) VALUES
(5, 'San Martin', 785, 1, NULL, NULL),
(6, 'San Martin', 785, 1, NULL, NULL),
(7, 'San Martin', 785, 2, NULL, NULL),
(8, 'San Martin', 785, 2, NULL, NULL),
(9, 'San Martin', 785, 2, NULL, NULL),
(10, 'San Martin', 785, 2, NULL, NULL),
(11, 'San Martin', 785, 2, NULL, NULL),
(12, 'San Martin', 785, 2, NULL, NULL),
(13, 'San Martin', 785, 2, NULL, NULL),
(14, 'San Martin', 785, 2, NULL, NULL),
(15, 'San Martin', 785, 2, NULL, NULL),
(16, 'San Martin', 785, 2, NULL, NULL),
(17, 'San Martin', 785, 1, NULL, NULL),
(18, 'San Martin', 785, 1, NULL, NULL),
(19, 'San Martin', 785, 1, NULL, NULL),
(20, 'San Martin', 785, 1, NULL, NULL),
(21, 'San Martin', 785, 1, NULL, NULL),
(22, 'San Martin', 785, 1, NULL, NULL),
(23, 'José Mujica', 318, 1, NULL, NULL),
(24, 'José Mujica', 318, 1, NULL, NULL),
(25, 'Estanislao del Campo', 563, 3, NULL, NULL),
(26, 'Estanislao del Campo', 563, 3, NULL, NULL),
(27, 'Estanislao del Campo', 563, 3, NULL, NULL),
(28, 'Estanislao del Campo', 563, 3, NULL, NULL),
(29, 'José Hernández', 563, 3, NULL, NULL),
(30, 'San Martin', 785, 4, NULL, NULL),
(31, 'San Martin', 785, 4, NULL, NULL),
(32, 'José Mujica', 563, 5, NULL, NULL),
(33, 'Estanislao del Campo', 1024, 3, NULL, NULL),
(34, 'Estanislao del Campo', 1024, 3, NULL, NULL),
(35, 'José Hernández', 323, 6, NULL, NULL),
(36, 'San Martin', 785, 1, NULL, NULL),
(37, 'San Martin', 563, 8, 2, 2),
(38, 'San Martin', 563, 8, 2, 2),
(39, 'San Martin', 318, 8, 2, 2),
(40, 'San Martin', 318, 8, 2, 2),
(41, 'José Mujica', 1024, 9, 3, 1),
(42, 'Estanislao del Campo', 8184, 10, 3, 1),
(43, 'Luis Kausullet', 785, 11, 3, 1),
(44, 'Luis Kausullet', 785, 11, 3, 1),
(45, 'Av. Ameghino', 328, 12, 1, 1),
(46, 'Estanislao del Campo', 1235, 6, 1, 1),
(47, 'Estanislao del Campo', 1235, 6, 1, 1),
(48, 'San Martin', 785, 13, 3, 1),
(49, 'Estanislao del Campo', 563, 14, 1, 1),
(50, 'Sucre', 435, 12, 1, 1),
(51, 'Sucre', 435, 12, 1, 1),
(52, 'Sucre', 435, 12, 1, 1),
(53, 'Sucre', 435, 12, 1, 1),
(54, 'Sucre', 435, 12, 1, 1),
(55, 'Sucre', 435, 12, 1, 1),
(56, 'Sucre', 435, 12, 1, 1),
(57, 'Sucre', 435, 12, 1, 1),
(58, 'Sucre', 435, 12, 1, 1),
(59, 'Sucre', 435, 12, 1, 1),
(60, 'Sucre', 435, 12, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_domicilios_barrios` (`idBarrio`),
  ADD KEY `fk_domicilios_localidades` (`idLocalidad`),
  ADD KEY `fk_domicilios_provincias` (`idProvincia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD CONSTRAINT `fk_domicilios_barrios` FOREIGN KEY (`idBarrio`) REFERENCES `barrios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_domicilios_localidades` FOREIGN KEY (`idLocalidad`) REFERENCES `localidades` (`id`),
  ADD CONSTRAINT `fk_domicilios_provincias` FOREIGN KEY (`idProvincia`) REFERENCES `provincias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
