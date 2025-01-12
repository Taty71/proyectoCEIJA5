-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2024 a las 03:16:14
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
-- Estructura de tabla para la tabla `detalle_inscripciones`
--

CREATE TABLE `detalle_inscripciones` (
  `idDetalleInscp` int(11) NOT NULL,
  `idTDocumentacion` int(11) NOT NULL,
  `estadoDocumentación` varchar(10) NOT NULL,
  `fechaEntrega` date NOT NULL,
  `idInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  ADD PRIMARY KEY (`idDetalleInscp`),
  ADD KEY `idTDocumentacion` (`idTDocumentacion`),
  ADD KEY `fk_detalle_inscripcion` (`idInscripcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  MODIFY `idDetalleInscp` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  ADD CONSTRAINT `detalle_inscripciones_ibfk_1` FOREIGN KEY (`idTDocumentacion`) REFERENCES `documentaciones` (`idDocumentacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_inscripciones_ibfk_2` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`idInscripcion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_inscripcion` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`idInscripcion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
