-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 22:39:01
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
-- Estructura de tabla para la tabla `anio_plan`
--

CREATE TABLE `anio_plan` (
  `id` int(11) NOT NULL,
  `descripcionAnioPlan` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `anio_plan`
--

INSERT INTO `anio_plan` (`id`, `descripcionAnioPlan`) VALUES
(1, 'Primero'),
(2, 'Segundo'),
(3, 'Tercero'),
(4, 'Plan A'),
(5, 'Plan B'),
(6, 'Plan C');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_estudio`
--

CREATE TABLE `area_estudio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(35) NOT NULL,
  `idModulo` int(11) NOT NULL,
  `idModalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `area_estudio`
--

INSERT INTO `area_estudio` (`id`, `nombre`, `idModulo`, `idModalidad`) VALUES
(1, 'Area Matemática', 1, 2),
(2, 'Area Interpretación y Producción de', 1, 2),
(3, 'Area Cs Naturales', 1, 2),
(4, 'Area Cs Sociales', 1, 2),
(5, 'Area Matemática', 2, 2),
(6, 'Area Interpretación y Producción de', 2, 2),
(7, 'Cs Naturales', 2, 2),
(8, 'Cs Sociales', 2, 2),
(9, 'Area Matemática', 3, 2),
(10, 'Area Interpretación y Producción de', 3, 2),
(11, 'Cs Naturales', 3, 2),
(12, 'Cs Sociales', 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `id` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idEstadoAsistencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `barrios`
--

CREATE TABLE `barrios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `idLocalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificacion`
--

CREATE TABLE `calificacion` (
  `id` int(11) NOT NULL,
  `establecimientoDeOrigen` varchar(20) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idPersonalInstitucion` int(11) NOT NULL,
  `idMateria` int(11) NOT NULL,
  `idEstadoCalificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_asistencia_estado`
--

CREATE TABLE `detalle_asistencia_estado` (
  `id` int(11) NOT NULL,
  `detalle` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_calificacion`
--

CREATE TABLE `detalle_calificacion` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `nota` int(2) NOT NULL,
  `idCalificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_incorporacion`
--

CREATE TABLE `detalle_incorporacion` (
  `id` int(11) NOT NULL,
  `fechaEntrega` int(11) NOT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `idIncorporaciones` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentaciones`
--

CREATE TABLE `documentaciones` (
  `id` int(11) NOT NULL,
  `descripcionDocumentacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domicilios`
--

CREATE TABLE `domicilios` (
  `id` int(11) NOT NULL,
  `calle` varchar(50) NOT NULL,
  `numero` int(11) NOT NULL,
  `idBarrio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_asistencia`
--

CREATE TABLE `estado_asistencia` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_calificacion`
--

CREATE TABLE `estado_calificacion` (
  `id` int(11) NOT NULL,
  `estadoCalificacion` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_incorporaciones`
--

CREATE TABLE `estado_incorporaciones` (
  `id` int(11) NOT NULL,
  `estadoIncorporacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_inscripciones`
--

CREATE TABLE `estado_inscripciones` (
  `id` int(11) NOT NULL,
  `descripcionEstado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` int(10) NOT NULL,
  `cuil` varchar(14) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `foto` varchar(500) DEFAULT NULL,
  `idDomicilio` int(11) NOT NULL,
  `idUsuarios` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--

CREATE TABLE `localidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `idProvincia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidades`
--

CREATE TABLE `modalidades` (
  `id` int(11) NOT NULL,
  `modalidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modalidades`
--

INSERT INTO `modalidades` (`id`, `modalidad`) VALUES
(1, 'PRESENCIAL'),
(2, 'SEMIPRESENCIAL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(10) NOT NULL,
  `idModalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id`, `nombre`, `idModalidad`) VALUES
(1, 'Mod 1', 2),
(2, 'Mod 2', 2),
(3, 'Mod 3', 2),
(4, 'Mod 4', 2),
(5, 'Mod 5', 2),
(6, 'Mod 6', 2),
(7, 'Mod 7', 2),
(8, 'Mod 8', 2),
(9, 'Mod 9', 2),
(10, 'Mod 0', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_institucion`
--

CREATE TABLE `personal_institucion` (
  `id` int(11) NOT NULL,
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
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_cargos`
--

CREATE TABLE `tipo_cargos` (
  `id` int(11) NOT NULL,
  `cargo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Cristina', 'Maia', 'crisbmaia@gmail.com', '$2y$10$RmkX3QsP0JMT.o/4e3P9F.w8z8QHxKJPjpY64WX3mMr9StygWB2.u', 'administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anio_plan`
--
ALTER TABLE `anio_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_areaestudio_modulo` (`idModulo`);

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_asistencias_estudiante` (`idEstudiante`),
  ADD KEY `fk_asistencias_estadoasistencia` (`idEstadoAsistencia`);

--
-- Indices de la tabla `barrios`
--
ALTER TABLE `barrios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_barrios_localidades` (`idLocalidad`);

--
-- Indices de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_calificacion_estudiantes` (`idEstudiante`),
  ADD KEY `fk_calificacion_personalinstitucion` (`idPersonalInstitucion`),
  ADD KEY `fk_calificacion_materias` (`idMateria`),
  ADD KEY `fk_calificacion_estadocalificacion` (`idEstadoCalificacion`);

--
-- Indices de la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalleasistencias_detalleasistenciaestado` (`idDetalleAsistenciaEstado`),
  ADD KEY `fk_detalleasistencias_asistencias` (`idAsistencia`);

--
-- Indices de la tabla `detalle_asistencia_estado`
--
ALTER TABLE `detalle_asistencia_estado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalle_calificacion`
--
ALTER TABLE `detalle_calificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detallecalificacion_calificacion` (`idCalificacion`);

--
-- Indices de la tabla `detalle_incorporacion`
--
ALTER TABLE `detalle_incorporacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalleincorporacion_documentaciones` (`idDocumentaciones`),
  ADD KEY `fk_detalleincorporacion_incorporaciones` (`idIncorporaciones`);

--
-- Indices de la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detalleinscripcion_documentaciones` (`idDocumentaciones`),
  ADD KEY `fk_detalleinscripcion_inscripciones` (`idInscripcion`);

--
-- Indices de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_domicilios_barrios` (`idBarrio`);

--
-- Indices de la tabla `estado_asistencia`
--
ALTER TABLE `estado_asistencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_calificacion`
--
ALTER TABLE `estado_calificacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_incorporaciones`
--
ALTER TABLE `estado_incorporaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_inscripciones`
--
ALTER TABLE `estado_inscripciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `fk_estudiantes_domicilios` (`idDomicilio`),
  ADD KEY `fk_estudiantes_usuarios` (`idUsuarios`);

--
-- Indices de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_incorporaciones_personalinstitucion` (`idPersonal`),
  ADD KEY `fk_incorporaciones_estadoincorporaciones` (`idEstadoIncorporacion`);

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
-- Indices de la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_localidades_provincias` (`idProvincia`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_materias_areaestudio` (`idAreaEstudio`),
  ADD KEY `fk_materias_modulo` (`idAnioPlan`),
  ADD KEY `fk_materias_modalidad` (`idModalidad`);

--
-- Indices de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal_institucion`
--
ALTER TABLE `personal_institucion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_personalinstitucion_domicilios` (`idDomicilio`),
  ADD KEY `fk_personalinstitucion_usuarios` (`idUser`),
  ADD KEY `fk_personalinstitucion_areaestudio` (`idCargo`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_cargos`
--
ALTER TABLE `tipo_cargos`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `barrios`
--
ALTER TABLE `barrios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_asistencia_estado`
--
ALTER TABLE `detalle_asistencia_estado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_calificacion`
--
ALTER TABLE `detalle_calificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_incorporacion`
--
ALTER TABLE `detalle_incorporacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_asistencia`
--
ALTER TABLE `estado_asistencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_calificacion`
--
ALTER TABLE `estado_calificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_incorporaciones`
--
ALTER TABLE `estado_incorporaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_inscripciones`
--
ALTER TABLE `estado_inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `personal_institucion`
--
ALTER TABLE `personal_institucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_cargos`
--
ALTER TABLE `tipo_cargos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD CONSTRAINT `fk_areaestudio_modulo` FOREIGN KEY (`idModulo`) REFERENCES `modulos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `fk_asistencias_estadoasistencia` FOREIGN KEY (`idEstadoAsistencia`) REFERENCES `estado_asistencia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_asistencias_estudiante` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `barrios`
--
ALTER TABLE `barrios`
  ADD CONSTRAINT `fk_barrios_localidades` FOREIGN KEY (`idLocalidad`) REFERENCES `localidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD CONSTRAINT `fk_calificacion_estadocalificacion` FOREIGN KEY (`idEstadoCalificacion`) REFERENCES `estado_calificacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calificacion_estudiantes` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calificacion_materias` FOREIGN KEY (`idMateria`) REFERENCES `materias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_calificacion_personalinstitucion` FOREIGN KEY (`idPersonalInstitucion`) REFERENCES `personal_institucion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_asistencias`
--
ALTER TABLE `detalle_asistencias`
  ADD CONSTRAINT `fk_detalleasistencias_asistencias` FOREIGN KEY (`idAsistencia`) REFERENCES `asistencias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleasistencias_detalleasistenciaestado` FOREIGN KEY (`idDetalleAsistenciaEstado`) REFERENCES `detalle_asistencia_estado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_calificacion`
--
ALTER TABLE `detalle_calificacion`
  ADD CONSTRAINT `fk_detallecalificacion_calificacion` FOREIGN KEY (`idCalificacion`) REFERENCES `calificacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_incorporacion`
--
ALTER TABLE `detalle_incorporacion`
  ADD CONSTRAINT `fk_detalleincorporacion_documentaciones` FOREIGN KEY (`idDocumentaciones`) REFERENCES `documentaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleincorporacion_incorporaciones` FOREIGN KEY (`idIncorporaciones`) REFERENCES `incorporaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_inscripcion`
--
ALTER TABLE `detalle_inscripcion`
  ADD CONSTRAINT `fk_detalleinscripcion_documentaciones` FOREIGN KEY (`idDocumentaciones`) REFERENCES `documentaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalleinscripcion_inscripciones` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD CONSTRAINT `fk_domicilios_barrios` FOREIGN KEY (`idBarrio`) REFERENCES `barrios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `fk_estudiantes_domicilios` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_estudiantes_usuarios` FOREIGN KEY (`idUsuarios`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  ADD CONSTRAINT `fk_incorporaciones_estadoincorporaciones` FOREIGN KEY (`idEstadoIncorporacion`) REFERENCES `estado_incorporaciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_incorporaciones_personalinstitucion` FOREIGN KEY (`idPersonal`) REFERENCES `personal_institucion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_inscripciones_estadoinscripciones` FOREIGN KEY (`idEstadoInscripcion`) REFERENCES `estado_inscripciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_estudiantes` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_modalidades` FOREIGN KEY (`idModalidad`) REFERENCES `modalidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscripciones_tipocargos` FOREIGN KEY (`idAnioPlan`) REFERENCES `anio_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `localidades`
--
ALTER TABLE `localidades`
  ADD CONSTRAINT `fk_localidades_provincias` FOREIGN KEY (`idProvincia`) REFERENCES `provincias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `fk_materias_areaestudio` FOREIGN KEY (`idAreaEstudio`) REFERENCES `area_estudio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materias_modalidad` FOREIGN KEY (`idModalidad`) REFERENCES `modalidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_materias_modulo` FOREIGN KEY (`idAnioPlan`) REFERENCES `anio_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `personal_institucion`
--
ALTER TABLE `personal_institucion`
  ADD CONSTRAINT `fk_personalinstitucion_areaestudio` FOREIGN KEY (`idCargo`) REFERENCES `tipo_cargos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_personalinstitucion_domicilios` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_personalinstitucion_usuarios` FOREIGN KEY (`idUser`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
