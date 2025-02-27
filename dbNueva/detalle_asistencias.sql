-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2025 a las 02:38:42
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
-- Estructura de tabla para la tabla `detalle_asistencias`
--

CREATE TABLE `detalle_asistencias` (
  `id` int(11) NOT NULL,
  `fecha_asistencia` date NOT NULL,
  `idDetalleAsistenciaEstado` int(11) NOT NULL,
  `idAsistencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalleasistencias_detalleasistenciaestado` (`idDetalleAsistenciaEstado`),
  ADD KEY `fk_detalleasistencias_asistencias` (`idAsistencia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  ADD CONSTRAINT `fk_detalleasistencias_asistencias` FOREIGN KEY (`idAsistencia`) REFERENCES `asistencias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleasistencias_detalleasistenciaestado` FOREIGN KEY (`idDetalleAsistenciaEstado`) REFERENCES `detalle_asistencia_estado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
