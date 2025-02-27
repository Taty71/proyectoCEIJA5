-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 20:23:18
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
-- Estructura de tabla para la tabla `domicilios`
--

CREATE TABLE `domicilios` (
  `idDomicilio` int(11) NOT NULL,
  `calle` varchar(50) NOT NULL,
  `nro` int(11) NOT NULL,
  `idBarrio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `domicilios`
--

INSERT INTO `domicilios` (`idDomicilio`, `calle`, `nro`, `idBarrio`) VALUES
(1, 'José Hernández', 318, 1),
(25, 'José Hernández', 318, 24),
(45, 'Jose Hernandez', 236, 42),
(46, 'Francisco Miranda', 895, 43),
(49, 'José Hernández', 563, 44),
(50, 'Estanislao del Campo', 159, 45),
(51, 'Sucre', 858, 1),
(52, 'José Hernández', 2003, 46),
(53, 'José Mujica', 563, 45),
(55, 'Estanislao del Campo', 1024, 47),
(56, 'San Martin', 785, 45);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD PRIMARY KEY (`idDomicilio`),
  ADD KEY `fk_domicilios_barrios` (`idBarrio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `idDomicilio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD CONSTRAINT `fk_domicilios_barrios` FOREIGN KEY (`idBarrio`) REFERENCES `barrios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
