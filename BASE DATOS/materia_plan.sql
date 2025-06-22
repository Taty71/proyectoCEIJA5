-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2025 a las 21:21:27
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
-- Estructura de tabla para la tabla `materia_plan`
--

CREATE TABLE `materia_plan` (
  `id` int(11) NOT NULL,
  `idMat` int(11) NOT NULL,
  `idAEs` int(11) NOT NULL,
  `idAnioP` int(11) NOT NULL,
  `idModal` int(11) NOT NULL,
  `idModul` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materia_plan`
--

INSERT INTO `materia_plan` (`id`, `idMat`, `idAEs`, `idAnioP`, `idModal`, `idModul`) VALUES
(1, 1, 1, 4, 2, 1),
(2, 1, 1, 4, 2, 2),
(3, 1, 1, 4, 2, 3),
(4, 5, 2, 4, 2, 1),
(5, 5, 2, 4, 2, 2),
(6, 5, 2, 4, 2, 3),
(7, 6, 2, 4, 2, 1),
(8, 6, 2, 4, 2, 2),
(9, 6, 2, 4, 2, 3),
(10, 3, 3, 4, 2, 1),
(11, 4, 3, 4, 2, 1),
(12, 4, 3, 4, 2, 2),
(13, 3, 3, 4, 2, 3),
(14, 2, 3, 4, 2, 3),
(15, 8, 4, 4, 2, 1),
(16, 8, 4, 4, 2, 2),
(17, 8, 4, 4, 2, 3),
(18, 9, 5, 6, 2, 8),
(19, 10, 5, 6, 2, 8),
(20, 11, 5, 6, 2, 8),
(21, 12, 5, 6, 2, 8),
(22, 1, 1, 5, 2, 4),
(23, 1, 1, 5, 2, 5),
(24, 1, 1, 6, 2, 6),
(25, 1, 1, 6, 2, 7),
(26, 5, 2, 5, 2, 4),
(27, 5, 2, 5, 2, 5),
(28, 5, 2, 6, 2, 6),
(29, 5, 2, 6, 2, 7),
(30, 6, 2, 5, 2, 4),
(31, 6, 2, 5, 2, 5),
(32, 6, 2, 6, 2, 6),
(33, 6, 2, 6, 2, 7);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `materia_plan`
--
ALTER TABLE `materia_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idMat` (`idMat`),
  ADD KEY `idAEs` (`idAEs`),
  ADD KEY `idAnioP` (`idAnioP`),
  ADD KEY `idModal` (`idModal`),
  ADD KEY `idModul` (`idModul`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `materia_plan`
--
ALTER TABLE `materia_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `materia_plan`
--
ALTER TABLE `materia_plan`
  ADD CONSTRAINT `materia_plan_ibfk_1` FOREIGN KEY (`idMat`) REFERENCES `materias` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_2` FOREIGN KEY (`idAEs`) REFERENCES `area_estudio` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_3` FOREIGN KEY (`idAnioP`) REFERENCES `anio_plan` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_4` FOREIGN KEY (`idModal`) REFERENCES `modalidades` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_5` FOREIGN KEY (`idModul`) REFERENCES `modulos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
