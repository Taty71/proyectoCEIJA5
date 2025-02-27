-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 20:24:59
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
-- Base de datos: `ceija5`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `nombreEstd` varchar(50) NOT NULL,
  `apellidoEstd` varchar(50) NOT NULL,
  `dni` int(8) NOT NULL,
  `cuil` varchar(14) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `foto` varchar(500) DEFAULT NULL,
  `idDomicilio` int(11) NOT NULL,
  `idLogin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombreEstd`, `apellidoEstd`, `dni`, `cuil`, `fechaNacimiento`, `foto`, `idDomicilio`, `idLogin`) VALUES
(1, 'Cristina Beatriz', 'MAIA', 21518473, '27-21518473-6', '0012-03-02', NULL, 1, 1),
(2, 'Danila Z', 'Congregado Maia', 43032642, '26-20123569-6', '1985-02-12', 'uploads/foto_6754cc047c627.jpg', 25, NULL),
(18, '0', 'Maia', 23698523, '23', '1973-02-12', NULL, 45, NULL),
(19, '0', 'Soria', 39023693, '21', '1996-12-23', NULL, 46, NULL),
(22, 'Martin', 'Espino', 43032641, '24', '0000-00-00', 'uploads/foto_67abe4fa3ae01.jpg', 49, NULL),
(23, 'Daniela', 'Albornoz', 30256124, '24', '1985-04-25', 'uploads/foto_67abf4a95e569.jpg', 50, NULL),
(24, 'Isaias', 'Longino', 38902369, '20', '2002-02-25', 'uploads/foto_67acbe8680b5a.jpg', 51, NULL),
(25, 'Martin', 'Gomez', 33562321, '27', '1986-03-02', 'uploads/foto_67acc48735939.jpg', 52, NULL),
(26, 'Cristina Beatriz', 'MAIA', 12562321, '27215184736', '1960-01-12', 'uploads/foto_67ad458b8f61e.jpg', 53, NULL),
(28, 'Mario', 'Bross', 30256367, '20302563675', '1983-12-02', 'uploads/foto_67ae92e01253c.jpg', 55, NULL),
(29, 'Sofia', 'Carras', 41203203, '24412032032', '1999-03-04', 'uploads/foto_67aea2efb9f0e.jpg', 56, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD KEY `fk_estudiantes_domicilios` (`idDomicilio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `fk_estudiantes_domicilios` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilios` (`idDomicilio`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
