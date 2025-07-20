-- Script para agregar campos de tipo de documento y país de emisión
-- Ejecutar este script para actualizar la tabla estudiantes

USE ceija5_redone;

-- Agregar campo tipo de documento
ALTER TABLE estudiantes 
ADD COLUMN tipoDocumento ENUM('DNI', 'PASAPORTE', 'CEDULA', 'OTRO') NOT NULL DEFAULT 'DNI' 
AFTER apellido;

-- Agregar campo país de emisión (opcional, solo para documentos extranjeros)
ALTER TABLE estudiantes 
ADD COLUMN paisEmision VARCHAR(100) NULL 
AFTER tipoDocumento;

-- Modificar el campo dni para que sea VARCHAR para permitir documentos extranjeros
ALTER TABLE estudiantes 
MODIFY COLUMN dni VARCHAR(20) NOT NULL;

-- Modificar el campo cuil para que sea opcional (solo para DNI argentinos)
ALTER TABLE estudiantes 
MODIFY COLUMN cuil VARCHAR(14) NULL;

-- Comentarios:
-- tipoDocumento: Tipo de documento (DNI, PASAPORTE, CEDULA, OTRO)
-- paisEmision: País que emitió el documento (NULL para DNI argentinos)
-- dni: Ahora VARCHAR(20) para soportar documentos extranjeros
-- cuil: Ahora opcional, solo requerido para DNI argentinos
