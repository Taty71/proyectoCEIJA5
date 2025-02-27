-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 20:25:45
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
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `fechaInscripcion` date NOT NULL,
  `idModalidad` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL,
  `idEstadoInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `idEstudiante`, `fechaInscripcion`, `idModalidad`, `idAnioPlan`, `idEstadoInscripcion`) VALUES
(14, 18, '2024-12-11', 0, 0, 1),
(15, 19, '2024-12-12', 0, 0, 1),
(17, 22, '2025-02-12', 0, 0, 1),
(18, 23, '2025-02-12', 0, 0, 1),
(19, 24, '2025-02-12', 0, 0, 1),
(20, 25, '2025-02-12', 0, 0, 1),
(21, 26, '2025-02-13', 0, 0, 1),
(22, 28, '2025-02-14', 0, 0, 1),
(23, 29, '2025-02-14', 0, 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inscripcion_estudiante` (`idEstudiante`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripcion_estudiante` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`),
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
