# proyectoCEIJA5api/README.md

# Proyecto CEIJA5 API

Este proyecto es una API diseñada para gestionar el registro de estudiantes y la recuperación de materias en función del año o plan y módulo de estudio. La API permite la inscripción de estudiantes y la consulta de materias disponibles.

## Estructura del Proyecto

El proyecto contiene los siguientes archivos y directorios:

- **src/components/Materias.php**: Componente PHP que recupera las materias basadas en el año o plan y módulo de estudio. Procesa las solicitudes entrantes, interactúa con la base de datos para obtener las materias relevantes y devuelve los datos en un formato adecuado para el frontend.

- **src/services/getMaterias.php**: Define la función de servicio `getMaterias`, que es responsable de realizar una solicitud HTTP al backend para obtener las materias según el año o plan y módulo proporcionados. Maneja la construcción de la URL de la solicitud y gestiona el manejo de errores.

- **conexion.php**: Establece la conexión a la base de datos utilizada en toda la aplicación.

- **inscripcionRegistroB.php**: Maneja el proceso de inscripción y contiene diversas funcionalidades relacionadas con la inscripción de estudiantes, incluyendo interacciones con la base de datos para insertar registros.

## Instrucciones de Configuración

1. Clona este repositorio en tu máquina local.
2. Asegúrate de tener instalado XAMPP o un servidor compatible con PHP.
3. Configura la base de datos en `conexion.php` con tus credenciales.
4. Coloca el proyecto en el directorio `htdocs` de tu instalación de XAMPP.
5. Accede a la API a través de tu navegador o herramientas como Postman.

## Uso

- Para inscribir un estudiante, realiza una solicitud POST a `inscripcionRegistroB.php` con los datos requeridos.
- Para obtener las materias, realiza una solicitud GET a `src/services/getMaterias.php` con los parámetros necesarios (año, plan, módulo).

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.