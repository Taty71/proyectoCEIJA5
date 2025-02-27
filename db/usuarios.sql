-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2025 a las 20:27:54
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
(2570, 'dd', 'lopez', 'dd@gmail.com', '$2y$10$KSHR3Bxxrh7iUnj9twBdMODx1JaESGV2JSilYfap6yQsJ3LcoZody', 'estudiante'),
(2571, 'Cristina', 'Maia', 'crisbmaia@gmail.com', '$2y$10$iHCPIBH39wGDA029DS2XP.1uFPRn6LKR8orEfB2Nic.7e2Y0PCOly', 'administrador');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2572;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
