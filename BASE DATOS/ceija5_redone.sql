-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2025 a las 04:20:18
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
  `descripcionAnioPlan` varchar(10) NOT NULL,
  `idModalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `anio_plan`
--

INSERT INTO `anio_plan` (`id`, `descripcionAnioPlan`, `idModalidad`) VALUES
(1, 'Primero', 1),
(2, 'Segundo', 1),
(3, 'Tercero', 1),
(4, 'Plan A', 2),
(5, 'Plan B', 2),
(6, 'Plan C', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_estudio`
--

CREATE TABLE `area_estudio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `area_estudio`
--

INSERT INTO `area_estudio` (`id`, `nombre`) VALUES
(1, 'Area Matemática'),
(2, 'Area Interpretación y Producción de'),
(3, 'Area Cs Naturales'),
(4, 'Area Cs Sociales'),
(5, 'ATP: Area Técnico Profesional');

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

--
-- Volcado de datos para la tabla `barrios`
--

INSERT INTO `barrios` (`id`, `nombre`, `idLocalidad`) VALUES
(1, 'Rosedal', 1),
(2, 'San Martin', 1),
(3, 'Centro', 1),
(4, 'Dr. Cocca', 1),
(5, 'Rivera Indarte', 1);

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
  `estadoDocumentacion` varchar(10) NOT NULL,
  `fechaEntrega` date NOT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `idInscripcion` int(11) NOT NULL,
  `archivoDocumentacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `divisiones`
--

CREATE TABLE `divisiones` (
  `id` int(11) NOT NULL,
  `division` varchar(50) NOT NULL,
  `idAnioPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `divisiones`
--

INSERT INTO `divisiones` (`id`, `division`, `idAnioPlan`) VALUES
(1, 'A', 1),
(2, 'B', 1),
(3, 'A', 3),
(4, 'B', 1),
(5, 'B', 2),
(6, 'B', 3),
(7, 'C', 1),
(8, 'C', 2),
(9, 'C', 3),
(10, 'D', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentaciones`
--

CREATE TABLE `documentaciones` (
  `id` int(11) NOT NULL,
  `descripcionDocumentacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentaciones`
--

INSERT INTO `documentaciones` (`id`, `descripcionDocumentacion`) VALUES
(1, 'DNI'),
(2, 'CUIL'),
(3, 'Ficha Médica'),
(4, 'Partida Nacimiento'),
(5, 'Solicitud Pase'),
(6, 'Analítico Parcial/Pase'),
(7, 'Certificado Nivel Primario'),
(8, 'Foto');

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

--
-- Volcado de datos para la tabla `domicilios`
--

INSERT INTO `domicilios` (`id`, `calle`, `numero`, `idBarrio`) VALUES
(4, 'San Martin', 785, 1),
(5, 'San Martin', 785, 1),
(6, 'San Martin', 785, 1),
(7, 'San Martin', 785, 2),
(8, 'San Martin', 785, 2),
(9, 'San Martin', 785, 2),
(10, 'San Martin', 785, 2),
(11, 'San Martin', 785, 2),
(12, 'San Martin', 785, 2),
(13, 'San Martin', 785, 2),
(14, 'San Martin', 785, 2),
(15, 'San Martin', 785, 2),
(16, 'San Martin', 785, 2),
(17, 'San Martin', 785, 1),
(18, 'San Martin', 785, 1),
(19, 'San Martin', 785, 1),
(20, 'San Martin', 785, 1),
(21, 'San Martin', 785, 1),
(22, 'San Martin', 785, 1),
(23, 'José Mujica', 318, 1),
(24, 'José Mujica', 318, 1),
(25, 'Estanislao del Campo', 563, 3),
(26, 'Estanislao del Campo', 563, 3),
(27, 'Estanislao del Campo', 563, 3),
(28, 'Estanislao del Campo', 563, 3),
(29, 'José Hernández', 563, 3),
(30, 'San Martin', 785, 4),
(31, 'San Martin', 785, 4),
(32, 'José Mujica', 563, 5),
(33, 'Estanislao del Campo', 1024, 3);

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

--
-- Volcado de datos para la tabla `estado_inscripciones`
--

INSERT INTO `estado_inscripciones` (`id`, `descripcionEstado`) VALUES
(1, 'pendiente'),
(2, 'aprobado'),
(3, 'anulado');

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

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombre`, `apellido`, `dni`, `cuil`, `fechaNacimiento`, `foto`, `idDomicilio`, `idUsuarios`) VALUES
(1, 'Sofia', 'Carras', 43032642, '27-43032642-6', '2000-08-07', NULL, 13, NULL),
(6, 'Sofia', 'Carras', 41032648, '27410326486', '2018-02-25', NULL, 22, NULL),
(7, 'Mariela', 'Bross', 41032000, '27410320006', '2018-02-08', NULL, 23, NULL),
(9, 'Martin', 'Espino', 12562321, '02125623216', '1970-10-05', NULL, 25, NULL),
(11, 'Martin', 'Espino', 12561101, '02126511016', '1970-10-05', NULL, 27, NULL),
(12, 'Martin', 'Espino', 23025123, '27230251232', '1970-10-05', NULL, 28, NULL),
(13, 'Martin', 'Espino', 45023630, '20-45023630-6', '2002-03-02', NULL, 29, NULL),
(16, 'Mariela', 'Lopez', 29562356, '27-29562356-02', '1983-05-02', NULL, 32, NULL),
(17, 'Mario', 'Bross', 35562321, '20-35562321-02', '1991-06-24', NULL, 33, NULL);

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

--
-- Volcado de datos para la tabla `localidades`
--

INSERT INTO `localidades` (`id`, `nombre`, `idProvincia`) VALUES
(1, 'La Calera', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `id` int(11) NOT NULL,
  `materia` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`id`, `materia`) VALUES
(1, 'Matemática'),
(2, 'Biología'),
(3, 'Física'),
(4, 'Química'),
(5, 'Lengua y Literatura'),
(6, 'Lengua Extranjera-Inglés'),
(7, 'Geografía'),
(8, 'Historia'),
(9, 'Ciudadanía y Participación'),
(10, 'Formación para el Trabajo'),
(11, 'Derecho del Trabajo y Seguridad Social'),
(12, 'Formación Profesional y Problemáticas Económicas A'),
(13, 'Orientación en Economía y Administración');

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
  `modulo` varchar(10) NOT NULL,
  `idMod` int(11) NOT NULL,
  `idAPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id`, `modulo`, `idMod`, `idAPlan`) VALUES
(1, 'Modulo 1', 2, 4),
(2, 'Modulo 2', 2, 4),
(3, 'Modulo 3', 2, 4),
(4, 'Modulo 4', 2, 5),
(5, 'Modulo 5', 2, 5),
(6, 'Modulo 6', 2, 6),
(7, 'Modulo 7', 2, 6),
(8, 'Modulo 8', 2, 6),
(9, 'Modulo 9', 2, 6);

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

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id`, `nombre`) VALUES
(1, 'Cordoba');

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
(17, 'Cristina Beatriz', 'Maia', 'cbmaia@gmail.com', '$2b$10$OfhrIuwwFcnAfLXOmJsmAuFQJ3N.HkAq3yhSn5l05oEV4y19c8jBq', 'administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anio_plan`
--
ALTER TABLE `anio_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_modalidad` (`idModalidad`);

--
-- Indices de la tabla `area_estudio`
--
ALTER TABLE `area_estudio`
  ADD PRIMARY KEY (`id`);

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
-- Indices de la tabla `divisiones`
--
ALTER TABLE `divisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_anio_plan` (`idAnioPlan`);

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
  ADD PRIMARY KEY (`id`);

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
-- Indices de la tabla `modalidades`
--
ALTER TABLE `modalidades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_aplan_modulos` (`idAPlan`),
  ADD KEY `fk_idMod` (`idMod`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `barrios`
--
ALTER TABLE `barrios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- AUTO_INCREMENT de la tabla `divisiones`
--
ALTER TABLE `divisiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `materia_plan`
--
ALTER TABLE `materia_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo_cargos`
--
ALTER TABLE `tipo_cargos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `anio_plan`
--
ALTER TABLE `anio_plan`
  ADD CONSTRAINT `fk_modalidad` FOREIGN KEY (`idModalidad`) REFERENCES `modalidades` (`id`);

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
-- Filtros para la tabla `divisiones`
--
ALTER TABLE `divisiones`
  ADD CONSTRAINT `fk_anio_plan` FOREIGN KEY (`idAnioPlan`) REFERENCES `anio_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Filtros para la tabla `materia_plan`
--
ALTER TABLE `materia_plan`
  ADD CONSTRAINT `materia_plan_ibfk_1` FOREIGN KEY (`idMat`) REFERENCES `materias` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_2` FOREIGN KEY (`idAEs`) REFERENCES `area_estudio` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_3` FOREIGN KEY (`idAnioP`) REFERENCES `anio_plan` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_4` FOREIGN KEY (`idModal`) REFERENCES `modalidades` (`id`),
  ADD CONSTRAINT `materia_plan_ibfk_5` FOREIGN KEY (`idModul`) REFERENCES `modulos` (`id`);

--
-- Filtros para la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD CONSTRAINT `fk_aplan_modulos` FOREIGN KEY (`idAPlan`) REFERENCES `anio_plan` (`id`),
  ADD CONSTRAINT `fk_idMod` FOREIGN KEY (`idMod`) REFERENCES `modalidades` (`id`);

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
