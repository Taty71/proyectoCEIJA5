# Flujo de Procesamiento de Registros Pendientes

## 📋 Resumen del Sistema

El sistema maneja **dos flujos** dependiendo del estado de la documentación:

### ✅ Flujo 1: Documentación COMPLETA

**Resultado**: Estudiante creado en BD, archivos migrados, registro marcado PROCESADO

1. Usuario sube/completa todos los documentos requeridos
2. Sistema detecta archivos en `archivosPendientes/`
3. Validación: 5 básicos + 1 según modalidad/plan = ✅ Completa
4. **Migración**: archivos se mueven de `archivosPendientes/` → `archivosDocumento/`
5. **Inserción BD**: crea estudiante, inscripción (con `idModulos`), archivos y detalle
6. **Actualización JSON**: marca registro como PROCESADO en `Registros_Pendientes.json`

### ⚠️ Flujo 2: Documentación INCOMPLETA

**Resultado**: Registro actualizado en JSON, archivos quedan en archivosPendientes, estado PENDIENTE

1. Usuario sube algunos documentos (pero no todos)
2. Sistema detecta archivos en `archivosPendientes/`
3. Validación: faltan documentos = ❌ Incompleta
4. **Actualización JSON**:
   - Combina archivos existentes + nuevos detectados
   - Actualiza `registro.archivos` con rutas
   - Guarda detalle de progreso (ej: 3/6 documentos)
   - Mantiene estado PENDIENTE
5. **Archivos**: permanecen en `archivosPendientes/` (NO se migran)
6. **Sin inserción BD**: no se crea estudiante hasta completar

---

## 📄 Documentos Requeridos (Validación)

### Documentos Básicos (5 obligatorios siempre)

1. 📷 **Foto**
2. 📄 **DNI**
3. 📄 **CUIL**
4. 🎂 **Partida de Nacimiento**
5. 🏥 **Ficha Médica CUS**

### Documento Adicional (+1 según modalidad y plan)

#### Modalidad PRESENCIAL (ID: 1)

- **1er Año (planAnioId: 1)**: Certificado Nivel Primario **O** Solicitud de Pase
- **2do/3er Año (planAnioId: 2 o 3)**: Analítico Parcial **O** Solicitud de Pase

#### Modalidad SEMIPRESENCIAL (ID: 2)

- **Plan A (planAnioId: 4)**: Certificado Nivel Primario (obligatorio)
- **Plan B/C (planAnioId: 5 o 6)**: Analítico Parcial (obligatorio)

**Total documentos requeridos**: 6 (5 básicos + 1 según modalidad/plan)

---

## 🔄 Cómo Funciona el Endpoint `/api/registros-pendientes/:dni/procesar`

### Entrada

- DNI del estudiante (parámetro URL o body)

### Proceso

1. **Buscar registro** en `Registros_Pendientes.json`
2. **Verificar si estudiante ya existe** en BD
   - Si existe → marca PROCESADO automáticamente y retorna
3. **Detectar archivos** en `archivosPendientes/` y combinar con `registro.archivos`
4. **Validar documentación** según modalidad + plan
5. **Decisión**:
   - ✅ **Completa** → Flujo 1 (migrar, insertar BD, marcar PROCESADO)
   - ❌ **Incompleta** → Flujo 2 (actualizar JSON, mantener PENDIENTE)

### Respuestas

#### Documentación Completa

```json
{
  "mensaje": "Registro procesado exitosamente",
  "estado": "PROCESADO",
  "idEstudiante": 123,
  "detalles": { "documentacionCompleta": true, ... },
  "registro": { ... }
}
```

#### Documentación Incompleta

```json
{
  "mensaje": "Documentación incompleta - registro actualizado",
  "estado": "PENDIENTE",
  "detalles": { "documentacionCompleta": false, "faltantesBasicos": [...] },
  "motivoPendiente": "⚠️ Documentación incompleta (3/6)...",
  "archivosActualizados": ["foto", "archivo_dni", "archivo_cuil"],
  "progreso": "3/6",
  "registro": {
    "archivos": {
      "foto": "/archivosPendientes/...",
      "archivo_dni": "/archivosPendientes/...",
      ...
    },
    "detalleDocumentos": {
      "totalDisponible": 3,
      "totalRequerido": 6,
      "faltantesBasicos": ["archivo_partidaNacimiento", "archivo_fichaMedica"],
      ...
    }
  }
}
```

---

## 🧪 Cómo Probar el Sistema

### Caso 1: Documentación Incompleta → Actualización JSON

1. **Preparación**: Sube solo 2-3 archivos para DNI 46123325 en la UI (ej: foto, DNI, CUIL)

2. **Backend**: Arranca con logs

   ```powershell
   cd proyectoCEIJA5
   npm run dev 2>&1 | Tee-Object -FilePath server.log
   ```

3. **Frontend**: Click en "Procesar" para DNI 46123325

4. **Verificación**:

   - Frontend debe mostrar: "Documentación incompleta (3/6) - Registro actualizado"
   - Revisar `data/Registros_Pendientes.json`:
     ```powershell
     Get-Content .\data\Registros_Pendientes.json | Select-String "46123325" -Context 20
     ```
   - Verificar que `registro.archivos` tiene las rutas de los 3 archivos subidos
   - Verificar que `registro.estado === "PENDIENTE"`
   - Archivos deben seguir en `archivosPendientes/`

5. **Logs del servidor**:
   ```powershell
   Select-String -Path server.log -Pattern "PROCESAR|46123325|Documentación incompleta|actualizado" -Context 2
   ```

### Caso 2: Completar Documentación → Inserción BD

1. **Preparación**: Sube los archivos faltantes (ej: partidaNacimiento, fichaMedica, analiticoParcial)

2. **Frontend**: Click en "Procesar" nuevamente

3. **Verificación**:

   - Frontend debe mostrar: "Registro procesado exitosamente"
   - Revisar BD:
     ```powershell
     node scripts/checkDni.js 46123325
     ```
   - Debe mostrar: estudiante, inscripción con `idModulos`, archivos_estudiantes, detalle_inscripcion
   - Archivos migrados a `archivosDocumento/`
   - `Registros_Pendientes.json` tiene `estado: "PROCESADO"`

4. **Logs del servidor**:
   ```powershell
   Select-String -Path server.log -Pattern "46123325|insertarEstudianteCompleto|Estudiante insertado|Inscripción insertada" -Context 3
   ```

---

## 🐛 Troubleshooting

### Problema: "ECONNREFUSED" en frontend

**Causa**: Backend no está corriendo en puerto 5000  
**Solución**:

```powershell
# Verificar si hay algo en puerto 5000
Get-NetTCPConnection -LocalPort 5000 -State Listen

# Arrancar backend
cd proyectoCEIJA5
npm run dev
```

### Problema: Registro se marca PROCESADO pero no está en BD

**Causa**: Bug en `verificarEstudianteExistente` (ya corregido)  
**Solución**: Ya aplicada - mysql2 devuelve [rows, fields] y ahora se destructura correctamente

### Problema: idModulos no se guarda

**Causa**: `insertarEstudianteCompleto` usa nombres de columna incorrectos  
**Solución**: Ya aplicada - usa `idModulos` según esquema en `inscripciones.sql`

### Problema: Archivos no se detectan en archivosPendientes

**Causa**: Nombres de archivo no coinciden con el patrón esperado  
**Verificación**:

```powershell
# Listar archivos en archivosPendientes
Get-ChildItem .\archivosPendientes\ | Where-Object { $_.Name -like "*46123325*" }
```

**Solución**: Archivos deben seguir patrón: `{nombre}_{apellido}_{dni}_{campo}.{ext}`

---

## 📊 Estructura de Datos

### Registro en Registros_Pendientes.json (incompleto)

```json
{
  "dni": "46123325",
  "estado": "PENDIENTE",
  "archivos": {
    "foto": "/archivosPendientes/Maria_Pia_Vazquez_46123325_foto.png",
    "archivo_dni": "/archivosPendientes/Maria_Pia_Vazquez_46123325_archivo_dni.pdf"
  },
  "detalleDocumentos": {
    "documentacionBasicaCompleta": false,
    "faltantesBasicos": [
      "archivo_cuil",
      "archivo_partidaNacimiento",
      "archivo_fichaMedica"
    ],
    "nombreDocumentoRequerido": "Analítico Parcial",
    "totalRequerido": 6,
    "totalDisponible": 2
  },
  "motivoPendiente": "⚠️ Documentación incompleta (2/6) para Analítico Parcial - Registro quedará PENDIENTE. Faltan: ...",
  "modalidadId": "2",
  "planAnioId": "6"
}
```

### Registro en BD (completo)

```sql
-- estudiantes
INSERT INTO estudiantes (nombre, apellido, dni, ...) VALUES ('María Pia', 'Vazquez', '46123325', ...);

-- inscripciones (con idModulos!)
INSERT INTO inscripciones (fechaInscripcion, idEstudiante, idModalidad, idAnioPlan, idModulos, idEstadoInscripcion)
VALUES (CURDATE(), 123, 2, 6, 6, 1);  -- idModulos = 6 (módulo seleccionado)

-- archivos_estudiantes
INSERT INTO archivos_estudiantes (idEstudiante, tipoArchivo, rutaArchivo)
VALUES (123, 'foto', '/archivosDocumento/...');

-- detalle_inscripcion
INSERT INTO detalle_inscripcion (idInscripcion, idDocumentaciones, estado, fechaEntrega, archivoDocumentacion)
VALUES (456, 1, 'Entregado', NOW(), '/archivosDocumento/...');
```

---

## ✅ Checklist de Validación

- [ ] Backend arranca sin errores (puerto 5000)
- [ ] Frontend conecta al backend (sin ECONNREFUSED)
- [ ] Subir 2-3 archivos → estado PENDIENTE, JSON actualizado, archivos en archivosPendientes
- [ ] Completar archivos faltantes → estado PROCESADO, estudiante en BD, archivos migrados
- [ ] Verificar inscripción tiene `idModulos` correcto (SELECT \* FROM inscripciones WHERE idEstudiante = ...)
- [ ] Verificar detalle_inscripcion tiene rutas migradas
- [ ] Logs muestran flujo completo sin errores

---

**Última actualización**: 6 noviembre 2025  
**Archivos modificados**:

- `services/registrosPendientes/controllers.js` (flujo de actualización para incompletos)
- `services/registrosPendientes/databaseManager.js` (fix verificarEstudianteExistente)
