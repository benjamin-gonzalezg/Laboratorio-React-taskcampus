# TaskCampus - Aplicación de Gestión de Tareas Académicas

## Integrantes del Escuadrón
- Benjamín Nicolás González Gatica

## Entorno de Desarrollo y Requisitos
- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Entorno / Bundler**: Vite + React (JavaScript / JSX)

---

## Instrucciones de Instalación, Ejecución y Compilación

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd taskcampus
   npm install

### 2. Ejecutar la aplicación en modo de desarrollo:

`npm run dev`  

Abre tu navegador e ingresa a la dirección local indicada por Vite (normalmente `http://localhost:5173`).

### 3. Compilar el proyecto para producción:

`npm run build`  

Este comando genera la carpeta `dist/` con los archivos optimizados para producción. Para previsualizar la compilación de producción localmente:

`npm run preview`  

---

## Integración con API REST

El proyecto consume la API pública de **JSONPlaceholder**:
* **Endpoint inicial:** `https://jsonplaceholder.typicode.com/todos?_limit=10`
* **Operaciones soportadas:** Carga inicial (`GET`), creación de tareas (`POST`), edición y cambio de estado (`PUT`/`PATCH`), y eliminación de tareas (`DELETE`).
