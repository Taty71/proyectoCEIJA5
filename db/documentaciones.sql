-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2024 a las 03:41:46
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
-- Estructura de tabla para la tabla `documentaciones`
--

CREATE TABLE `documentaciones` (
  `idDocumentacion` int(11) NOT NULL,
  `descripDocumentacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentaciones`
--

INSERT INTO `documentaciones` (`idDocumentacion`, `descripDocumentacion`) VALUES
(1, 'DNI '),
(2, 'CUIL'),
(3, 'FICHA MEDICA '),
(4, 'PARTIDA NACIMIENTO'),
(5, 'TITULO'),
(6, 'FOTO'),
(7, 'NivelPrimario'),
(8, 'AnaliticoProvisorio'),
(9, 'SolicitudPase');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  ADD PRIMARY KEY (`idDocumentacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  MODIFY `idDocumentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
