# Registro de pruebas

## Verificación local

El 18 de octubre de 2026 se ejecutaron las verificaciones en Windows,
con Node.js v24.11.0 y npm 11.6.1.

- `npm ci`: instalación completada, con advertencias de versión de algunas dependencias. La auditoría no detectó vulnerabilidades.
- `npm test`: las 12 pruebas automáticas aprobaron.
- `npm run lint`: finalizó sin errores.
- `npm run build`: compilación completada correctamente.

Las advertencias EBADENGINE no impidieron ejecutar las verificaciones,
pero indican que algunas dependencias declaran necesitar una versión
superior de Node.

## Pruebas automáticas

Se utilizaron Vitest, Testing Library y jsdom para probar la aplicación
mediante clicks, escritura, doble clic, Enter y pérdida de foco.

Estas pruebas usan respuestas HTTP controladas. Se simulan diez tareas
iniciales, identificadores repetidos en respuestas de creación, errores
HTTP y operaciones demoradas. No comprueban por sí solas la conexión
con JSONPlaceholder ni la presentación visual en un navegador.

Código: `tests/app.test.jsx`.

Resultado de ejecución: `docs/resultado-pruebas.txt`.

Para repetirlas:

    npm test

| Caso probado                    | Pasos                                                                                                                                | Resultado esperado                                                                                                                                          | Resultado obtenido                                         | Evidencia asociada                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| 01. Carga y resumen             | Iniciar con 10 tareas: 6 pendientes y 4 completadas. Abrir Tareas y Resumen.                                                         | Mostrar 10 filas y los contadores correspondientes. Solicitar GET limitado a 10.                                                                            | Aprobado.                                                  | Prueba 01 y resultado-pruebas.txt. |
| 02. Filtros y navegación        | Seleccionar Pendientes, buscar TAREA 1, ir a Resumen y volver. Después buscar un texto inexistente.                                  | Combinar ambos filtros sin distinguir mayúsculas, conservarlos al navegar y actualizar Mostrando. Mostrar un mensaje cuando no existan coincidencias.       | Aprobado.                                                  | Prueba 02 y resultado-pruebas.txt. |
| 03. Creación e identificadores  | Intentar crear un título con espacios. Crear dos tareas con el mismo ID devuelto por el POST simulado. Intentar completar una nueva. | Rechazar el título vacío. Mantener dos tareas distintas. Informar la limitación de la tarea nueva sin modificar otra ni enviar un identificador incorrecto. | Aprobado.                                                  | Prueba 03 y resultado-pruebas.txt. |
| 04. Cambio de estado            | Completar una tarea original dentro del filtro Pendientes y revisar Resumen.                                                         | Enviar PATCH con completed, retirar la tarea del filtro Pendientes y actualizar los contadores.                                                             | Aprobado. Se comprobó método, URL y cuerpo de la petición. | Prueba 04 y resultado-pruebas.txt. |
| 05. Edición y validación        | Abrir la edición con doble clic. Intentar guardar vacío. Guardar con Enter y con pérdida de foco. Cancelar otra edición con Escape.  | Mostrar error ante un título vacío, guardar títulos válidos y conservar el título anterior al cancelar. No duplicar la petición al guardar con Enter.       | Aprobado.                                                  | Prueba 05 y resultado-pruebas.txt. |
| 06. Confirmación de eliminación | Abrir el modal y cancelar. Volver a abrirlo y confirmar.                                                                             | Cancelar conserva la tarea. Confirmar ejecuta DELETE y retira la tarea de la lista.                                                                         | Aprobado.                                                  | Prueba 06 y resultado-pruebas.txt. |
| 07. Error de actualización      | Simular un error en PATCH y luego reintentar con una respuesta exitosa.                                                              | Informar el error, conservar las tareas y permitir reintentar sin bloquear la aplicación.                                                                   | Aprobado.                                                  | Prueba 07 y resultado-pruebas.txt. |
| 08. Error al crear              | Simular un error en POST.                                                                                                            | Conservar el texto del formulario, mostrar el error y no anunciar una creación exitosa.                                                                     | Aprobado.                                                  | Prueba 08 y resultado-pruebas.txt. |
| 09. Error de carga              | Simular un error en GET y usar Reintentar carga con una respuesta correcta.                                                          | Mostrar el error inicial y cargar las diez tareas al reintentar.                                                                                            | Aprobado.                                                  | Prueba 09 y resultado-pruebas.txt. |
| 10. Operación pendiente         | Demorar una actualización e intentar editar durante la espera.                                                                       | Deshabilitar los controles de operación, mostrar el indicador de espera y bloquear la edición. Habilitarlos nuevamente al terminar.                         | Aprobado.                                                  | Prueba 10 y resultado-pruebas.txt. |
| 11. Operaciones sucesivas       | Crear dos tareas, completar una original y eliminar otra original pendiente.                                                         | Conservar los cambios anteriores. Obtener total 11, pendientes 6 y completadas 5.                                                                           | Aprobado.                                                  | Prueba 11 y resultado-pruebas.txt. |
| 12. Error de eliminación        | Simular un error en DELETE y después cancelar el modal.                                                                              | Conservar el modal y la tarea ante el error. Permitir cerrar el modal y continuar usando la aplicación.                                                     | Aprobado.                                                  | Prueba 12 y resultado-pruebas.txt. |

## Instalación, revisión y compilación

| Caso probado       | Pasos                   | Resultado esperado                                            | Resultado obtenido                                                                                                   | Evidencia asociada             |
| ------------------ | ----------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Instalación local  | Ejecutar npm ci.        | Instalar las dependencias definidas en el archivo de bloqueo. | Completada: 233 paquetes agregados y 234 auditados. Hubo advertencias EBADENGINE. No se detectaron vulnerabilidades. | docs/resultado-compilacion.txt |
| Revisión de código | Ejecutar npm run lint.  | Finalizar sin errores de ESLint.                              | Aprobado.                                                                                                            | docs/resultado-compilacion.txt |
| Compilación        | Ejecutar npm run build. | Generar la carpeta dist sin errores.                          | Aprobado con Vite v8.3.4. Se transformaron 32 módulos.                                                               | docs/resultado-compilacion.txt |

## Comprobación HTTP contra la API real

Durante la preparación de esta versión se realizó una comprobación
HTTP de JSONPlaceholder, separada de las pruebas automáticas locales.

El registro corresponde a esa comprobación previa; no a los comandos
npm test, npm run lint o npm run build ejecutados posteriormente
en el equipo del grupo.

| Caso probado  | Pasos                                             | Resultado esperado                          | Resultado obtenido            | Evidencia asociada          |
| ------------- | ------------------------------------------------- | ------------------------------------------- | ----------------------------- | --------------------------- |
| Lectura       | Enviar GET a /todos?\_limit=10.                   | Respuesta exitosa con diez tareas.          | HTTP 200 y diez tareas.       | docs/resultado-api-real.txt |
| Creación      | Enviar POST a /todos con título, estado y userId. | Respuesta exitosa de creación simulada.     | HTTP 201 e identificador 201. | docs/resultado-api-real.txt |
| Actualización | Enviar PATCH a /todos/1 con completed: true.      | Respuesta exitosa con el estado solicitado. | HTTP 200 y completed: true.   | docs/resultado-api-real.txt |
| Eliminación   | Enviar DELETE a /todos/2.                         | Respuesta exitosa de eliminación simulada.  | HTTP 200 y objeto vacío.      | docs/resultado-api-real.txt |

JSONPlaceholder no guarda permanentemente estas escrituras.
Una respuesta exitosa no significa que el cambio permanezca
después de recargar.

## Comprobación manual en navegador

Estos casos siguen pendientes. Se debe reemplazar el resultado
obtenido después de ejecutar cada caso y registrar lo observado.

| Caso probado                   | Pasos                                                                                                                              | Resultado esperado                                                                         | Resultado obtenido | Evidencia asociada                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------ | --------------------------------------------- |
| Presentación                   | Ejecutar npm run dev y abrir las tres vistas en escritorio y con una ventana angosta.                                              | Textos y controles legibles, vista activa reconocible y contenido utilizable.              | Pendiente.         | Registrar observaciones; capturas opcionales. |
| API real desde la aplicación   | Abrir las herramientas del navegador, sección Network. Recargar, crear una tarea y editar, completar y eliminar tareas originales. | Observar GET, POST, PATCH y DELETE. La interfaz debe reflejar las operaciones exitosas.    | Pendiente.         | Registrar peticiones y resultados observados. |
| Persistencia durante la sesión | Crear una tarea, cambiar de vista y volver. Luego recargar la página.                                                              | La tarea se conserva al navegar. Al recargar se recuperan las tareas originales de la API. | Pendiente.         | Registrar el resultado observado.             |

Para iniciar la aplicación:

    npm run dev

Las tareas nuevas tienen una identidad local, pero no un recurso
remoto persistente. Si se intenta modificarlas o eliminarlas,
la aplicación informa esa limitación y las conserva.

Para comprobar actualización y eliminación HTTP deben utilizarse
las tareas originales obtenidas mediante GET, conforme al alcance
indicado en el enunciado.
