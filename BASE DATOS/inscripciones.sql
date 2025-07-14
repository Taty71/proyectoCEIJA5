-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-07-2025 a las 05:11:23
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
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `fechaInscripcion` date NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idModalidad` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL,
  `idModulos` int(11) NOT NULL,
  `idEstadoInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `fechaInscripcion`, `idEstudiante`, `idModalidad`, `idAnioPlan`, `idModulos`, `idEstadoInscripcion`) VALUES
(5, '2025-06-22', 21, 2, 4, 1, 1),
(6, '2025-06-22', 25, 2, 6, 7, 1),
(7, '2025-06-22', 26, 2, 6, 8, 1),
(8, '2025-06-22', 27, 1, 3, 0, 1),
(9, '2025-06-22', 29, 1, 3, 0, 2),
(11, '2025-06-22', 31, 1, 2, 0, 1),
(12, '2025-06-22', 32, 2, 5, 5, 1),
(13, '2025-07-10', 33, 2, 4, 1, 1),
(15, '2025-07-13', 41, 1, 1, 0, 1),
(16, '2025-07-13', 43, 1, 2, 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inscripciones_estudiantes` (`idEstudiante`),
  ADD KEY `fk_inscripciones_modalidades` (`idModalidad`),
  ADD KEY `fk_inscripciones_tipocargos` (`idAnioPlan`),
  ADD KEY `fk_inscripciones_estadoinscripciones` (`idEstadoInscripcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripciones_estadoinscripciones` FOREIGN KEY (`idEstadoInscripcion`) REFERENCES `estado_inscripciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_estudiantes` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_modalidades` FOREIGN KEY (`idModalidad`) REFERENCES `modalidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_tipocargos` FOREIGN KEY (`idAnioPlan`) REFERENCES `anio_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
