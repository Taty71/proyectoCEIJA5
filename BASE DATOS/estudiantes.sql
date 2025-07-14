-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-07-2025 a las 05:10:15
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
(20, 'Sofia', 'Ochoa', 28562321, '20-28562321-6', '1985-02-02', '/archivosDocumento/1748403337627-703727684-foto3.jpg', 36, NULL),
(21, 'Juan', 'Perez', 12345678, '20-12345678-6', '1989-02-02', '/archivosDocumento/1750622765155-346046123-f1.jpg', 37, NULL),
(25, 'Sofia', 'Zalazar', 30253236, '20-30253236-6', '1999-02-02', '/archivosDocumento/1750623849102-820436443-f1.jpg', 41, NULL),
(26, 'Sofia', 'Uritzar', 42123568, '20-42123568-9', '2000-02-09', '/archivosDocumento/1750624744221-26924890-f1.jpg', 42, NULL),
(27, 'Sofia', 'Carras', 41203203, '20-31203203-3', '2000-06-03', '/archivosDocumento/1750624879753-599703996-f1.jpg', 43, NULL),
(29, 'Marianela', 'Velez', 42203236, '20-42203236-7', '2002-06-25', '/archivosDocumento/1750625817375-854907610-f1.jpg', 45, NULL),
(31, 'Juan Manuel', 'Martinez', 42236123, '21-42236123-0', '2003-03-26', '/archivosDocumento/1750626540473-3396459-foto3.jpg', 47, NULL),
(32, 'Karina', 'Spadetto', 32023652, '20-32023652-5', '2000-03-02', '/archivosDocumento/1750637288323-798761026-f1.jpg', 48, NULL),
(33, 'Marianela', 'Contreras', 25203203, '27-25203203-4', '1976-03-02', '/archivosDocumento/1752174815602-96816434-f1.jpg', 49, NULL),
(34, 'Walter', 'Asef', 35206203, '24-35206203-1', '1991-11-06', '/archivosDocumento/1752455670510-832580629-foto3.jpg', 50, NULL),
(41, 'Walter', 'Asef', 35206223, '24-35206203-1', '1991-11-06', '/archivosDocumento/1752459009488-958823944-foto3.jpg', 57, NULL),
(43, 'Walter', 'Murua', 35206100, '24-35206203-1', '1991-11-06', '/archivosDocumento/1752459475288-907789022-foto3.jpg', 59, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `fk_estudiantes_domicilios` (`idDomicilio`),
  ADD KEY `fk_estudiantes_usuarios` (`idUsuarios`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `fk_estudiantes_domicilios` FOREIGN KEY (`idDomicilio`) REFERENCES `domicilios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_estudiantes_usuarios` FOREIGN KEY (`idUsuarios`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
