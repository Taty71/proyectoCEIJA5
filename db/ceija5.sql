-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-01-2025 a las 22:25:18
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
CREATE DATABASE IF NOT EXISTS `ceija5` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ceija5`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anio_plan`
--
-- Creación: 12-12-2024 a las 23:00:56
--

DROP TABLE IF EXISTS `anio_plan`;
CREATE TABLE `anio_plan` (
  `idAnioPlan` int(11) NOT NULL,
  `descripcionAnioPlan` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `anio_plan`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_estudio`
--
-- Creación: 28-11-2024 a las 17:54:32
--

DROP TABLE IF EXISTS `area_estudio`;
CREATE TABLE `area_estudio` (
  `idAreaEstudio` int(11) NOT NULL,
  `areaEstudio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `area_estudio`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `barrios`
--
-- Creación: 28-11-2024 a las 18:09:37
--

DROP TABLE IF EXISTS `barrios`;
CREATE TABLE `barrios` (
  `idBarrios` int(11) NOT NULL,
  `nombreBarrio` varchar(60) NOT NULL,
  `idLocalidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `barrios`:
--   `idLocalidad`
--       `localidades` -> `idLocalidades`
--

--
-- Volcado de datos para la tabla `barrios`
--

INSERT INTO `barrios` (`idBarrios`, `nombreBarrio`, `idLocalidad`) VALUES
(1, 'Industrial', 1),
(24, 'Centro', 4),
(42, 'Alberdi', 1),
(43, 'San Martin', 17),
(44, 'Stoecking', 1),
(45, 'Centro', 1),
(48, 'Altos Calera', 1),
(49, 'San Martin', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--
-- Creación: 28-11-2024 a las 18:41:08
--

DROP TABLE IF EXISTS `cargos`;
CREATE TABLE `cargos` (
  `idCargos` int(11) NOT NULL,
  `cargo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `cargos`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_incorporacion`
--
-- Creación: 28-11-2024 a las 19:05:28
--

DROP TABLE IF EXISTS `detalle_incorporacion`;
CREATE TABLE `detalle_incorporacion` (
  `idDetalleInc` int(11) NOT NULL,
  `fechaEntrega` int(11) NOT NULL,
  `idIncorporacion` int(11) NOT NULL,
  `idDocumentacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `detalle_incorporacion`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_inscripciones`
--
-- Creación: 28-11-2024 a las 18:34:25
--

DROP TABLE IF EXISTS `detalle_inscripciones`;
CREATE TABLE `detalle_inscripciones` (
  `idDetalleInscp` int(11) NOT NULL,
  `idTDocumentacion` int(11) NOT NULL,
  `estadoDocumentación` varchar(10) NOT NULL,
  `fechaEntrega` date NOT NULL,
  `idInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `detalle_inscripciones`:
--   `idTDocumentacion`
--       `documentaciones` -> `idDocumentacion`
--   `idInscripcion`
--       `inscripciones` -> `idInscripcion`
--   `idInscripcion`
--       `inscripciones` -> `idInscripcion`
--

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
(25, 7, 'Entregado', '2024-12-12', 15),
(26, 1, 'Entregado', '2024-12-13', 18),
(27, 2, 'Entregado', '2024-12-13', 18),
(28, 4, 'Entregado', '2024-12-13', 18),
(29, 3, 'Entregado', '2024-12-13', 18),
(30, 7, 'Entregado', '2024-12-13', 18),
(31, 1, 'Entregado', '2024-12-13', 19),
(32, 2, 'Entregado', '2024-12-13', 19),
(33, 4, 'Entregado', '2024-12-13', 19),
(34, 3, 'Entregado', '2024-12-13', 19),
(35, 8, 'Entregado', '2024-12-13', 19),
(36, 1, 'Entregado', '2024-12-13', 20),
(37, 2, 'Entregado', '2024-12-13', 20),
(38, 4, 'Entregado', '2024-12-13', 20),
(39, 3, 'Entregado', '2024-12-13', 20),
(40, 7, 'Entregado', '2024-12-13', 20),
(41, 1, 'Entregado', '2024-12-13', 21),
(42, 2, 'Entregado', '2024-12-13', 21),
(43, 4, 'Entregado', '2024-12-13', 21),
(44, 3, 'Entregado', '2024-12-13', 21),
(45, 7, 'Entregado', '2024-12-13', 21),
(46, 1, 'Entregado', '2024-12-13', 22),
(47, 2, 'Entregado', '2024-12-13', 22),
(48, 4, 'Entregado', '2024-12-13', 22),
(49, 3, 'Entregado', '2024-12-13', 22),
(50, 7, 'Entregado', '2024-12-13', 22),
(51, 1, 'Entregado', '2024-12-13', 23),
(52, 2, 'Entregado', '2024-12-13', 23),
(53, 4, 'Entregado', '2024-12-13', 23),
(54, 3, 'Entregado', '2024-12-13', 23),
(55, 7, 'Entregado', '2024-12-13', 23),
(56, 1, 'Entregado', '2024-12-13', 24),
(57, 2, 'Entregado', '2024-12-13', 24),
(58, 4, 'Entregado', '2024-12-13', 24),
(59, 3, 'Entregado', '2024-12-13', 24),
(60, 7, 'Entregado', '2024-12-13', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentaciones`
--
-- Creación: 28-11-2024 a las 18:36:58
--

DROP TABLE IF EXISTS `documentaciones`;
CREATE TABLE `documentaciones` (
  `idDocumentacion` int(11) NOT NULL,
  `descripDocumentacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `documentaciones`:
--

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
-- Creación: 28-11-2024 a las 18:08:42
--

DROP TABLE IF EXISTS `domicilios`;
CREATE TABLE `domicilios` (
  `idDomicilio` int(11) NOT NULL,
  `calle` varchar(50) NOT NULL,
  `nro` int(11) NOT NULL,
  `idBarrio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `domicilios`:
--   `idBarrio`
--       `barrios` -> `idBarrios`
--

--
-- Volcado de datos para la tabla `domicilios`
--

INSERT INTO `domicilios` (`idDomicilio`, `calle`, `nro`, `idBarrio`) VALUES
(1, 'José Hernández', 318, 1),
(25, 'José Hernández', 318, 24),
(45, 'Jose Hernandez', 236, 42),
(46, 'Francisco Miranda', 895, 43),
(50, 'San Martin', 258, 1),
(51, 'José Hernández', 318, 44),
(53, 'Ascasubi', 256, 44),
(54, 'San Martin', 1566, 45),
(57, 'José Hernández', 258, 48),
(58, 'José Hernández', 318, 44),
(59, 'José Hernández', 318, 49);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_documentacion`
--
-- Creación: 08-12-2024 a las 01:40:51
--

DROP TABLE IF EXISTS `estado_documentacion`;
CREATE TABLE `estado_documentacion` (
  `idEstadoDocumentacion` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idDocumentaciones` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `estado_documentacion`:
--   `idEstudiante`
--       `estudiantes` -> `idEstudiante`
--   `idDocumentaciones`
--       `documentaciones` -> `idDocumentacion`
--

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
-- Creación: 28-11-2024 a las 19:13:13
--

DROP TABLE IF EXISTS `estado_incorporaciones`;
CREATE TABLE `estado_incorporaciones` (
  `idEstadoIncorporar` int(11) NOT NULL,
  `estadoIncorporar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `estado_incorporaciones`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_inscripciones`
--
-- Creación: 28-11-2024 a las 17:05:37
--

DROP TABLE IF EXISTS `estado_inscripciones`;
CREATE TABLE `estado_inscripciones` (
  `idEstadoInscripciones` int(11) NOT NULL,
  `descripcionEstado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `estado_inscripciones`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--
-- Creación: 10-12-2024 a las 21:19:19
--

DROP TABLE IF EXISTS `estudiantes`;
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
-- RELACIONES PARA LA TABLA `estudiantes`:
--   `idDomicilio`
--       `domicilios` -> `idDomicilio`
--

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`idEstudiante`, `nombreEstd`, `apellidoEstd`, `dni`, `cuil`, `fechaNacimiento`, `foto`, `idDomicilio`, `idLogin`) VALUES
(1, 'Cristina Beatriz', 'MAIA', 21518473, '27-21518473-6', '0012-03-02', NULL, 1, 1),
(2, 'Danila Z', 'Congregado Maia', 43032642, '26-20123569-6', '1985-02-12', 'uploads/foto_6754cc047c627.jpg', 25, NULL),
(18, '0', 'Maia', 23698523, '23', '1973-02-12', NULL, 45, NULL),
(19, '0', 'Soria', 39023693, '21', '1996-12-23', NULL, 46, NULL),
(23, 'Marcos', 'Congregado Maia', 40235708, '24', '1998-12-23', NULL, 50, NULL),
(24, 'Taty', 'Maia', 12562320, '24', '0000-00-00', NULL, 51, NULL),
(26, 'Stefania', 'Lopez', 43023356, '24', '1995-02-12', 'uploads/foto_675b81533f0af.jpg', 53, NULL),
(27, 'Ana', 'Lopez', 23568952, '20', '1974-12-12', 'uploads/foto_675b83c068a3d.jpg', 54, NULL),
(30, 'Paula', 'Maia', 12562321, '21', '1985-08-09', 'uploads/foto_675b863518318.jpg', 57, NULL),
(31, 'Marcos', 'Gimenz', 42563212, '20', '1998-02-12', 'uploads/foto_675b887f3d7cb.jpg', 58, NULL),
(32, 'Marcos', 'Albarraciin', 425632136, '20', '1986-02-12', 'uploads/foto_675b8c167c855.jpg', 59, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incorporaciones`
--
-- Creación: 28-11-2024 a las 19:11:46
--

DROP TABLE IF EXISTS `incorporaciones`;
CREATE TABLE `incorporaciones` (
  `idIncorporaciones` int(11) NOT NULL,
  `fechaIncorporacion` date NOT NULL,
  `situaciónRevista` varchar(50) NOT NULL,
  `idPersonalI` int(11) NOT NULL,
  `idEstadoIncorporar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `incorporaciones`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--
-- Creación: 30-11-2024 a las 22:04:39
--

DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE `inscripciones` (
  `idInscripcion` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `fechaInscripcion` date NOT NULL,
  `idModalidad` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL,
  `idEstadoInscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `inscripciones`:
--   `idEstudiante`
--       `estudiantes` -> `idEstudiante`
--   `idEstudiante`
--       `estudiantes` -> `idEstudiante`
--

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`idInscripcion`, `idEstudiante`, `fechaInscripcion`, `idModalidad`, `idAnioPlan`, `idEstadoInscripcion`) VALUES
(14, 18, '2024-12-11', 0, 0, 1),
(15, 19, '2024-12-12', 0, 0, 1),
(18, 23, '2024-12-13', 0, 2, 1),
(19, 24, '2024-12-13', 0, 2, 1),
(20, 26, '2024-12-13', 0, 3, 1),
(21, 27, '2024-12-13', 0, 0, 1),
(22, 30, '2024-12-13', 0, 2, 1),
(23, 31, '2024-12-13', 0, 0, 1),
(24, 32, '2024-12-13', 0, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades`
--
-- Creación: 28-11-2024 a las 18:10:43
--

DROP TABLE IF EXISTS `localidades`;
CREATE TABLE `localidades` (
  `idLocalidades` int(11) NOT NULL,
  `localidad` varchar(60) NOT NULL,
  `idPcia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `localidades`:
--   `idPcia`
--       `provincias` -> `idPcias`
--

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
-- Creación: 28-11-2024 a las 17:58:14
--

DROP TABLE IF EXISTS `materias`;
CREATE TABLE `materias` (
  `idMaterias` int(11) NOT NULL,
  `materia` varchar(50) NOT NULL,
  `idAreaEstudio` int(11) NOT NULL,
  `idModulo` int(11) NOT NULL,
  `idAnioPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `materias`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidades`
--
-- Creación: 28-11-2024 a las 17:07:17
--

DROP TABLE IF EXISTS `modalidades`;
CREATE TABLE `modalidades` (
  `idModalidades` int(11) NOT NULL,
  `modalidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `modalidades`:
--

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
-- Creación: 28-11-2024 a las 17:57:56
--

DROP TABLE IF EXISTS `modulos`;
CREATE TABLE `modulos` (
  `idModulos` int(11) NOT NULL,
  `modulo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `modulos`:
--

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
-- Creación: 28-11-2024 a las 18:39:35
--

DROP TABLE IF EXISTS `personal_institucion`;
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

--
-- RELACIONES PARA LA TABLA `personal_institucion`:
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--
-- Creación: 28-11-2024 a las 18:11:26
--

DROP TABLE IF EXISTS `provincias`;
CREATE TABLE `provincias` (
  `idPcias` int(11) NOT NULL,
  `provincia` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `provincias`:
--

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
-- Creación: 28-11-2024 a las 00:33:52
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` enum('administrador','profesor','estudiante','secretario','coordinador') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `usuarios`:
--

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
  MODIFY `idBarrios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

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
  MODIFY `idDetalleInscp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `documentaciones`
--
ALTER TABLE `documentaciones`
  MODIFY `idDocumentacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `idDomicilio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
  MODIFY `idEstudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `incorporaciones`
--
ALTER TABLE `incorporaciones`
  MODIFY `idIncorporaciones` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `idInscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
