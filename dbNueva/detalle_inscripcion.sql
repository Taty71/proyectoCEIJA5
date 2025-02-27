-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2025 a las 02:40:30
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
  `estadoDocumentación` varchar(10) NOT NULL,
  `fechaEntrega` date NOT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `idInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
