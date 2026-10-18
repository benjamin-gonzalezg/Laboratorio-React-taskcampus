# TaskCampus

Aplicación para gestionar tareas académicas, hecha con React, JavaScript y Vite.

## Integrantes

- Benjamín González
- Damon Murray
- Matías Palma
- Benjamín Juanillo
- Benjamín Del Valle
- Ítalo Osorio

## Instalación y ejecución

Entorno usado para verificar esta versión: Node.js v24.19.0 y npm 11.9.0.
Usar Node.js 24.x. Node 18 no sirve para las versiones actuales de las herramientas del proyecto.

```bash
git clone https://github.com/benjamin-gonzalezg/Laboratorio-React-taskcampus.git
cd Laboratorio-React-taskcampus
npm ci
npm run dev
```

Abrir la dirección que muestra Vite en la terminal, normalmente http://localhost:5173.

```bash
npm run build
npm run preview
```

El primer comando genera `dist`. El segundo permite revisar esa compilación.
No se deben subir `node_modules` ni `dist`. El archivo `package-lock.json` fija las dependencias para que `npm ci` instale las mismas versiones.

Para repetir las verificaciones:

```bash
npm run lint
npm test
```

## Estructura

- `src/App.jsx`: coordina la navegación, las tareas, los filtros y la búsqueda.
- `src/components`: encabezado, navegación, lista, formulario, resumen, botón y modal.
- `src/views`: vistas Resumen, Tareas y Nueva tarea.
- `src/hooks/useTareas.js`: carga, creación, actualización, eliminación y estados de espera/error.
- `src/services/tareasService.js`: peticiones HTTP con `fetch` y comprobación de `res.ok`.
- `src/App.css` y `src/index.css`: estilos.
- `tests/app.test.jsx`: pruebas de interacción con respuestas HTTP controladas.
- `docs/PRUEBAS.md`: registro de pruebas y comprobaciones manuales.

## Vistas y uso

- **Resumen:** total, pendientes, completadas y cantidad que coincide con el filtro y la búsqueda.
- **Tareas:** listado, filtro por estado y búsqueda por título. Doble clic en un título para editarlo; Enter o perder el foco guardan. Escape cancela la edición. Eliminar abre una confirmación.
- **Nueva tarea:** formulario controlado. No admite títulos vacíos o con espacios. Confirma la creación solo si el POST resulta exitoso.

El encabezado y la navegación permanecen disponibles. Se identifica la vista activa. Las tareas, el filtro y la búsqueda se conservan al cambiar de vista. Mientras se guarda, se bloquean las operaciones y el cambio de vista para evitar envíos simultáneos. Un error de operación muestra un mensaje, pero no oculta las vistas ni borra tareas.

## Comparación con la base

La base tenía tres tareas escritas directamente en JSX, un total fijo y botones que mostraban alertas. Ahora la lista se carga desde la API y se genera con `map`, los contadores se calculan desde las tareas y los botones realizan operaciones HTTP. Se añadieron formulario, edición, confirmación, filtros, búsqueda, navegación y manejo de carga y errores. Se conservan React, JavaScript, Vite y la separación en componentes, ampliando la presentación de tarjetas y botones de la base.

## API y persistencia

Se usa `https://jsonplaceholder.typicode.com/todos?_limit=10` para la carga inicial. La creación usa POST, las actualizaciones usan PATCH y la eliminación usa DELETE. Las operaciones exitosas actualizan el estado de React.

JSONPlaceholder simula escrituras: no guarda permanentemente los cambios. Al recargar, se vuelven a obtener las tareas originales. No se usa localStorage.

Las tareas obtenidas por GET tienen un `id` local como `remota-1` y un `idRemoto` numérico. Las nuevas tienen un UUID local y `idRemoto: null`: el identificador de la respuesta POST no demuestra que exista un recurso persistente. Dos POST pueden devolver el mismo identificador.

Si se intenta editar, completar o eliminar una tarea nueva, se informa que no existe remotamente y se conserva sin cambios. No se envían UUID a la API ni se inventa un éxito remoto. Las pruebas de PATCH y DELETE se realizan con tareas obtenidas por GET. Esta decisión sigue el alcance permitido por el enunciado para la API simulada.

## Investigación aplicada

### 1. Navegación entre vistas

Una vista activa puede representarse con un estado. Un evento cambia su valor y el renderizado condicional selecciona el componente visible. La información compartida queda en el componente padre para que no desaparezca al desmontar una vista.

**Aplicación:** `src/App.jsx` usa `vistaActiva`; `src/components/Navigation.jsx` recibe la vista y la función de cambio. No se usan rutas URL ni una biblioteca de navegación.

**Verificación:** elegir Pendientes, buscar un título, ir a Resumen y volver a Tareas. Deben mantenerse el filtro, la búsqueda y las tareas. Prueba 02.

**Fuente:** [React: compartir estado entre componentes](https://react.dev/learn/sharing-state-between-components).

### 2. Estado derivado

Se guarda en estado lo que cambia por acciones: tareas, filtro y búsqueda. La lista visible y los contadores se calculan desde esos valores. Guardarlos como estados separados obligaría a sincronizarlos y podría producir diferencias entre vistas.

**Aplicación:** `src/App.jsx` calcula `tareasFiltradas`; `src/views/SummaryView.jsx` calcula totales y entrega la cantidad visible a `TaskSummary`.

**Verificación:** combinar búsqueda y filtro, completar una tarea pendiente y revisar Resumen. La lista visible y los contadores deben cambiar juntos. Pruebas 01, 02 y 04.

**Fuente:** [React: elegir la estructura del estado](https://react.dev/learn/choosing-the-state-structure).

### 3. Actualización funcional del estado

Cuando el nuevo estado depende del anterior, el setter puede recibir una función. `setTareas(prev => ...)` toma la colección anterior y devuelve una nueva. Se usan expansión, `map` y `filter`, sin cambiar directamente los objetos anteriores.

**Aplicación:** `crearTarea`, `actualizarTarea`, `editarTitulo` y `eliminarTarea`, en `src/hooks/useTareas.js`.

**Verificación:** crear dos tareas seguidas, modificar una tarea original y eliminar otra. Los cambios anteriores deben mantenerse y los contadores deben corresponder. Pruebas 03 a 06 y 11.

**Fuente:** [React: actualizaciones en cola](https://react.dev/learn/queueing-a-series-of-state-updates).

### 4. Identificadores y API simulada

La identidad de una fila en React y la de un recurso remoto cumplen funciones distintas. La respuesta de creación de una API simulada no garantiza un recurso persistente. Por eso no se reutiliza su identificador como clave de todas las tareas nuevas.

**Aplicación:** `src/hooks/useTareas.js` separa `id` e `idRemoto`; usa `crypto.randomUUID()` para nuevas tareas y comprueba la identidad remota antes de modificar o eliminar. `src/components/TaskList.jsx` usa `tarea.id` como clave estable.

**Verificación:** crear dos tareas, intentar modificar una nueva y comprobar que ambas se mantienen distintas. Simular un error al modificar una original y comprobar que no cambia otra tarea. Pruebas 03 y 07.

**Fuente:** [JSONPlaceholder: servicio de API simulada](https://jsonplaceholder.typicode.com/).

## Pruebas y entrega

El registro de casos, pasos, resultados y evidencias está en [docs/PRUEBAS.md](docs/PRUEBAS.md).

Antes de entregar, completar los integrantes y realizar la comprobación visual y de API real indicada allí. El repositorio debe ser público. En Canvas se entrega un único archivo `.txt` con los nombres completos de todos y la URL del repositorio. No se exige exposición ni adjuntar los tutoriales resueltos.
