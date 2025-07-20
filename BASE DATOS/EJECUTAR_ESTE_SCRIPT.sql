-- Script para agregar campos de tipo de documento y país de emisión
-- Copia y pega este script completo en phpMyAdmin o en tu cliente MySQL

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

-- Verificar que los cambios se aplicaron correctamente
DESCRIBE estudiantes;
