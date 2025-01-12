-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-12-2024 a las 03:19:25
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
-- Estructura de tabla para la tabla `estado_documentacion`
--

CREATE TABLE `estado_documentacion` (
  `idEstadoDocumentacion` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_documentacion`
--

INSERT INTO `estado_documentacion` (`idEstadoDocumentacion`, `idEstudiante`, `idDocumentaciones`, `estado`) VALUES
(15, 1, 1, 'Completado'),
(16, 1, 2, 'Completado'),
(17, 1, 3, 'Pendiente'),
(18, 1, 4, 'Completado'),
(19, 1, 5, 'Pendiente'),
(20, 2, 1, 'Completado'),
(21, 2, 2, 'Pendiente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  ADD PRIMARY KEY (`idEstadoDocumentacion`),
  ADD KEY `idEstudiante` (`idEstudiante`),
  ADD KEY `idDocumentaciones` (`idDocumentaciones`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  MODIFY `idEstadoDocumentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  ADD CONSTRAINT `estado_documentacion_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`idEstudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estado_documentacion_ibfk_2` FOREIGN KEY (`idDocumentaciones`) REFERENCES `documentaciones` (`idDocumentacion`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
