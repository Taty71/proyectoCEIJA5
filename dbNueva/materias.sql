-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-02-2025 a las 07:45:40
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
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `id` int(11) NOT NULL,
  `materia` varchar(50) NOT NULL,
  `idAreaEstudio` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL,
  `idModalidad` int(11) NOT NULL,
  `idModulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`id`, `materia`, `idAreaEstudio`, `idAnioPlan`, `idModalidad`, `idModulo`) VALUES
(2, 'Matemática', 1, 1, 1, 0),
(3, 'Matemática', 1, 2, 1, 0),
(4, 'Matemática', 1, 4, 2, 1),
(5, 'Matemática', 1, 5, 2, 4),
(6, 'Matemática', 1, 4, 2, 2),
(7, 'Matemática', 1, 4, 2, 3),
(8, 'Matemática', 1, 5, 2, 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_materias_areaestudio` (`idAreaEstudio`),
  ADD KEY `fk_materias_modulo` (`idAnioPlan`),
  ADD KEY `fk_materias_modalidad` (`idModalidad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `fk_materias_areaestudio` FOREIGN KEY (`idAreaEstudio`) REFERENCES `area_estudio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materias_modalidad` FOREIGN KEY (`idModalidad`) REFERENCES `modalidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materias_modulo` FOREIGN KEY (`idAnioPlan`) REFERENCES `anio_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
