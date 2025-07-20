-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-07-2025 a las 08:06:33
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
  `tipoDocumento` enum('DNI','PASAPORTE','CEDULA','OTRO') NOT NULL DEFAULT 'DNI',
  `paisEmision` varchar(100) DEFAULT NULL,
  `dni` varchar(20) NOT NULL,
  `cuil` varchar(14) DEFAULT NULL,
  `fechaNacimiento` date NOT NULL,
  `foto` varchar(500) DEFAULT NULL,
  `idDomicilio` int(11) NOT NULL,
  `idUsuarios` int(11) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Campo para eliminación lógica: 1=activo, 0=inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombre`, `apellido`, `tipoDocumento`, `paisEmision`, `dni`, `cuil`, `fechaNacimiento`, `foto`, `idDomicilio`, `idUsuarios`, `activo`) VALUES
(46, 'Martina', 'Gonzalez', 'DNI', NULL, '25126654', '24-25126654-2', '1976-02-02', '/archivosDocumento/1752468480900-267453180-f1.jpg', 62, NULL, 1),
(54, 'Hugo', 'Mendoza', 'DNI', NULL, '39123123', '20-39123123-0', '1995-08-08', '/archivosDocumentacion/Hugo_Mendoza_39123123_foto.jpg', 70, NULL, 1),
(70, 'Marcos', 'Maia', 'DNI', NULL, '39203203', '20-39203203-2', '1999-03-03', '/archivosDocumentacion/Marcos_Maia_39203203_foto.jpg', 86, NULL, 1),
(71, 'Marcos', 'Maia', 'DNI', NULL, '15151232', '20-15151233-5', '1999-03-03', '/archivosDocumentacion/Marcos_Maia_15151232_foto.jpg', 87, NULL, 1),
(73, 'Esteban', 'Cornejo', 'DNI', '', '39603603', '20-39603603-8', '1996-08-10', '/archivosDocumento/Esteban_Capdevilla_39603603_foto.jpg', 90, NULL, 1),
(75, 'Daniela', 'Dimarchi', 'DNI', 'Argentina', '48152123', '20481521239', '2005-02-03', '/archivosDocumento/Roxana_Dimarchi_48123125_foto.jpg', 92, NULL, 1),
(76, 'Nancy', 'Torres', 'DNI', 'Argentina', '49159563', '20-49159563-1', '2007-02-03', '/archivosDocumento/Nancy_Torres_49159563_foto.jpg', 93, NULL, 1),
(77, 'Ruben ', 'Segovia', 'DNI', 'Argentina', '50125125', '20-50125125-1', '2007-05-05', '/archivosDocumento/Ruben_Segovia_50125125_foto.jpg', 94, NULL, 1),
(78, 'Antonella', 'Azuar', 'DNI', 'Argentina', '52523523', '20-52523523-9', '2006-03-02', '/archivosDocumento/Zz_AA_52523523_foto.jpg', 95, NULL, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

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
