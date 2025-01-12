-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2024 a las 23:44:11
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
-- Estructura de tabla para la tabla `anio_plan`
--

CREATE TABLE `anio_plan` (
  `idAnioPlan` int(11) NOT NULL,
  `descripcionAnioPlan` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_estudio`
--

CREATE TABLE `area_estudio` (
  `idAreaEstudio` int(11) NOT NULL,
  `areaEstudio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `barrios`
--

CREATE TABLE `barrios` (
  `idBarrios` int(11) NOT NULL,
  `nombreBarrio` varchar(60) NOT NULL,
  `idLocalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `barrios`
--

INSERT INTO `barrios` (`idBarrios`, `nombreBarrio`, `idLocalidad`) VALUES
(1, 'Industrial', 1),
(24, 'Centro', 4),
(42, 'Alberdi', 1),
(43, 'San Martin', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

CREATE TABLE `cargos` (
  `idCargos` int(11) NOT NULL,
  `cargo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_incorporacion`
--

CREATE TABLE `detalle_incorporacion` (
  `idDetalleInc` int(11) NOT NULL,
  `fechaEntrega` int(11) NOT NULL,
  `idIncorporacion` int(11) NOT NULL,
  `idDocumentacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Volcado de datos para la tabla `detalle_inscripciones`
--

INSERT INTO `detalle_inscripciones` (`idDetalleInscp`, `idTDocumentacion`, `estadoDocumentación`, `fechaEntrega`, `idInscripcion`) VALUES
(16, 1, 'Entregado', '2024-12-11', 14),
(17, 2, 'Entregado', '2024-12-11', 14),
(18, 4, 'Entregado', '2024-12-11', 14),
(19, 3, 'Entregado', '2024-12-11', 14),
(20, 7, 'Entregado', '2024-12-11', 14),
(21, 1, 'Entregado', '2024-12-12', 15),
(22, 2, 'Entregado', '2024-12-12', 15),
(23, 4, 'Entregado', '2024-12-12', 15),
(24, 3, 'Entregado', '2024-12-12', 15),
(25, 7, 'Entregado', '2024-12-12', 15);

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
(6, 'NivelPrimario'),
(7, 'AnaliticoProvisorio'),
(8, 'SolicitudPase'),
(13, 'FOTO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domicilios`
--

CREATE TABLE `domicilios` (
  `idDomicilio` int(11) NOT NULL,
  `calle` varchar(50) NOT NULL,
  `nro` int(11) NOT NULL,
  `idBarrio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `domicilios`
--

INSERT INTO `domicilios` (`idDomicilio`, `calle`, `nro`, `idBarrio`) VALUES
(1, 'José Hernández', 318, 1),
(25, 'José Hernández', 318, 24),
(45, 'Jose Hernandez', 236, 42),
(46, 'Francisco Miranda', 895, 43);

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_incorporaciones`
--

CREATE TABLE `estado_incorporaciones` (
  `idEstadoIncorporar` int(11) NOT NULL,
  `estadoIncorporar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_inscripciones`
--

CREATE TABLE `estado_inscripciones` (
  `idEstadoInscripciones` int(11) NOT NULL,
  `descripcionEstado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `idEstudiante` int(11) NOT NULL,
  `nombreEstd` varchar(50) NOT NULL,
  `apellidoEstd` varchar(50) NOT NULL,
  `dni` int(8) NOT NULL,
  `cuil` varchar(14) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `foto` varchar(500) DEFAULT NULL,
  `idDomicilio` int(11) NOT NULL,
  `idLogin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`idEstudiante`, `nombreEstd`, `apellidoEstd`, `dni`, `cuil`, `fechaNacimiento`, `foto`, `idDomicilio`, `idLogin`) VALUES
(1, 'Cristina Beatriz', 'MAIA', 21518473, '27-21518473-6', '0012-03-02', NULL, 1, 1),
(2, 'Danila Z', 'Congregado Maia', 43032642, '26-20123569-6', '1985-02-12', 'uploads/foto_6754cc047c627.jpg', 25, NULL),
(18, '0', 'Maia', 23698523, '23', '1973-02-12', NULL, 45, NULL),
(19, '0', 'Soria', 39023693, '21', '1996-12-23', NULL, 46, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incorporaciones`
--

CREATE TABLE `incorporaciones` (
  `idIncorporaciones` int(11) NOT NULL,
  `fechaIncorporacion` date NOT NULL,
  `situaciónRevista` varchar(50) NOT NULL,
  `idPersonalI` int(11) NOT NULL,
  `idEstadoIncorporar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `idInscripcion` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `fechaInscripcion` date NOT NULL,
  `idModalidad` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL,
  `idEstadoInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`idInscripcion`, `idEstudiante`, `fechaInscripcion`, `idModalidad`, `idAnioPlan`, `idEstadoInscripcion`) VALUES
(14, 18, '2024-12-11', 0, 0, 1),
(15, 19, '2024-12-12', 0, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `idLocalidades` int(11) NOT NULL,
  `localidad` varchar(60) NOT NULL,
  `idPcia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`idLocalidades`, `localidad`, `idPcia`) VALUES
(1, 'La Calera', 2),
(4, 'La Calera,', 2),
(17, 'Cordoba', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `idMaterias` int(11) NOT NULL,
  `materia` varchar(50) NOT NULL,
  `idAreaEstudio` int(11) NOT NULL,
  `idModulo` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidades`
--

CREATE TABLE `modalidades` (
  `idModalidades` int(11) NOT NULL,
  `modalidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modalidades`
--

INSERT INTO `modalidades` (`idModalidades`, `modalidad`) VALUES
(1, 'PRESENCIAL'),
(2, 'SEMIPRESENCIAL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `idModulos` int(11) NOT NULL,
  `modulo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`idModulos`, `modulo`) VALUES
(1, 'Modulo 1'),
(2, 'Modulo 2'),
(3, 'Modulo 3'),
(4, 'Modulo 4'),
(5, 'Modulo 5'),
(6, 'Modulo 6'),
(7, 'Modulo 7'),
(8, 'Modulo 8'),
(9, 'Modulo 9');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_institucion`
--

CREATE TABLE `personal_institucion` (
  `idPersonalInst` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` int(8) NOT NULL,
  `email` varchar(50) NOT NULL,
  `idDomicilio` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idCargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `idPcias` int(11) NOT NULL,
  `provincia` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`idPcias`, `provincia`) VALUES
(2, 'Cordoba'),
(3, 'Corrientes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` enum('administrador','profesor','estudiante','secretario','coordinador') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(2555, 'Taty', 'M', 'tm@gmail.com', '1258', 'profesor'),
(2557, 'Ale', 'Lopez', 'al@gmail.com', '$2y$10$rh/JXeCqETjNX82RBroe4uJAz.30yvkCM//jxhlKduIscUQHHTpE.', 'estudiante'),
(2559, 'Ana', 'Ceanhs', 'anac@gmail.com', '$2y$10$aHKlXFe8siKxZXAXir6i.eTFJtpm.dUigAbZHBSuWlXDJ8DUMap26', 'coordinador'),
(2561, 'Cristina', 'Maia', 'mc@gmail.com', '$2y$10$Vt1lLGpQOcmTAjpKphlsruSB7U/w5VhQ2NGJUP5P2zd4f6NjrsB8C', 'profesor'),
(2562, 'Cristina Beatriz', 'MAIA', 'cristinbmaia@gmail.com', '$2y$10$6bsfNyuJCGO5lUqaEpjwxelbvipQ9yXpOhk/p7pM2uoq17c.3tttm', 'profesor'),
(2563, 'Franco', 'Martinez', 'fm@gmail.com', '$2y$10$8b1cnuHxRmNcztCRNsbuMuTdhFcddKQ9VVew3ztyQwGH87npdryQO', 'estudiante'),
(2564, 'Luis', 'Montenegro', 'lm@gmail.com', '$2y$10$741Ghsf26k/kSlq6FoN3PeX0/n0ixtzNq3smdLN6TQbVJAcp02bT2', 'secretario'),
(2565, 'Manuel ', 'Lopez', 'ml@gmail.com', '$2y$10$rlHEAPiHUYOELh0baeTAku7NlBpdHFc0lL1LBrz4in/u56RO1dMmO', 'coordinador'),
(2570, 'dd', 'lopez', 'dd@gmail.com', '$2y$10$KSHR3Bxxrh7iUnj9twBdMODx1JaESGV2JSilYfap6yQsJ3LcoZody', 'estudiante');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anio_plan`
--
ALTER TABLE `anio_plan`
  ADD PRIMARY KEY (`idAnioPlan`);

--
-- Indices de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD PRIMARY KEY (`idAreaEstudio`);

--
-- Indices de la tabla `barrios`
--
ALTER TABLE `barrios`
  ADD PRIMARY KEY (`idBarrios`),
  ADD KEY `fk_barrios_localidades` (`idLocalidad`);

--
-- Indices de la tabla `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`idCargos`);

--
-- Indices de la tabla `detalle_incorporacion`
--
ALTER TABLE `detalle_incorporacion`
  ADD PRIMARY KEY (`idDetalleInc`);

--
-- Indices de la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  ADD PRIMARY KEY (`idDetalleInscp`),
  ADD KEY `idTDocumentacion` (`idTDocumentacion`),
  ADD KEY `fk_detalle_inscripcion` (`idInscripcion`);

--
-- Indices de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  ADD PRIMARY KEY (`idDocumentacion`);

--
-- Indices de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD PRIMARY KEY (`idDomicilio`),
  ADD KEY `fk_domicilios_barrios` (`idBarrio`);

--
-- Indices de la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  ADD PRIMARY KEY (`idEstadoDocumentacion`),
  ADD KEY `idEstudiante` (`idEstudiante`),
  ADD KEY `idDocumentaciones` (`idDocumentaciones`);

--
-- Indices de la tabla `estado_incorporaciones`
--
ALTER TABLE `estado_incorporaciones`
  ADD PRIMARY KEY (`idEstadoIncorporar`);

--
-- Indices de la tabla `estado_inscripciones`
--
ALTER TABLE `estado_inscripciones`
  ADD PRIMARY KEY (`idEstadoInscripciones`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`idEstudiante`),
  ADD UNIQUE KEY `dni_2` (`dni`),
  ADD KEY `fk_estudiantes_domicilios` (`idDomicilio`);

--
-- Indices de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  ADD PRIMARY KEY (`idIncorporaciones`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`idInscripcion`),
  ADD KEY `fk_inscripcion_estudiante` (`idEstudiante`);

--
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`idLocalidades`),
  ADD KEY `fk_localidades_provincias` (`idPcia`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`idMaterias`);

--
-- Indices de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  ADD PRIMARY KEY (`idModalidades`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`idModulos`);

--
-- Indices de la tabla `personal_institucion`
--
ALTER TABLE `personal_institucion`
  ADD PRIMARY KEY (`idPersonalInst`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`idPcias`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `anio_plan`
--
ALTER TABLE `anio_plan`
  MODIFY `idAnioPlan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  MODIFY `idAreaEstudio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `barrios`
--
ALTER TABLE `barrios`
  MODIFY `idBarrios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `cargos`
--
ALTER TABLE `cargos`
  MODIFY `idCargos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_incorporacion`
--
ALTER TABLE `detalle_incorporacion`
  MODIFY `idDetalleInc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  MODIFY `idDetalleInscp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  MODIFY `idDocumentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `idDomicilio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  MODIFY `idEstadoDocumentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `estado_incorporaciones`
--
ALTER TABLE `estado_incorporaciones`
  MODIFY `idEstadoIncorporar` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_inscripciones`
--
ALTER TABLE `estado_inscripciones`
  MODIFY `idEstadoInscripciones` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `idEstudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  MODIFY `idIncorporaciones` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `idInscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `idLocalidades` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `idMaterias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  MODIFY `idModalidades` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `idModulos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `personal_institucion`
--
ALTER TABLE `personal_institucion`
  MODIFY `idPersonalInst` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `idPcias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2571;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `barrios`
--
ALTER TABLE `barrios`
  ADD CONSTRAINT `fk_barrios_localidades` FOREIGN KEY (`idLocalidad`) REFERENCES `localidades` (`idLocalidades`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_inscripciones`
--
ALTER TABLE `detalle_inscripciones`
  ADD CONSTRAINT `detalle_inscripciones_ibfk_1` FOREIGN KEY (`idTDocumentacion`) REFERENCES `documentaciones` (`idDocumentacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_inscripciones_ibfk_2` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`idInscripcion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_inscripcion` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`idInscripcion`);

--
-- Filtros para la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD CONSTRAINT `fk_domicilios_barrios` FOREIGN KEY (`idBarrio`) REFERENCES `barrios` (`idBarrios`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estado_documentacion`
--
ALTER TABLE `estado_documentacion`
  ADD CONSTRAINT `estado_documentacion_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`idEstudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estado_documentacion_ibfk_2` FOREIGN KEY (`idDocumentaciones`) REFERENCES `documentaciones` (`idDocumentacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `fk_estudiantes_domicilios` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilios` (`idDomicilio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripcion_estudiante` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`idEstudiante`),
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`idEstudiante`) ON DELETE CASCADE;

--
-- Filtros para la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD CONSTRAINT `fk_localidades_provincias` FOREIGN KEY (`idPcia`) REFERENCES `provincias` (`idPcias`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
