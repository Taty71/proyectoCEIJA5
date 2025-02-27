-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2025 a las 02:42:58
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
-- Estructura de tabla para la tabla `incorporaciones`
--

CREATE TABLE `incorporaciones` (
  `id` int(11) NOT NULL,
  `fechaIncorporacion` date NOT NULL,
  `situaciónRevista` varchar(50) NOT NULL,
  `idPersonal` int(11) NOT NULL,
  `idEstadoIncorporacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_incorporaciones_personalinstitucion` (`idPersonal`),
  ADD KEY `fk_incorporaciones_estadoincorporaciones` (`idEstadoIncorporacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  ADD CONSTRAINT `fk_incorporaciones_estadoincorporaciones` FOREIGN KEY (`idEstadoIncorporacion`) REFERENCES `estado_incorporaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_incorporaciones_personalinstitucion` FOREIGN KEY (`idPersonal`) REFERENCES `personal_institucion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
