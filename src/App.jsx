import { useState, useEffect } from "react";
import useTareas from "./hooks/useTareas";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Button from "./components/Button";
import SummaryView from "./views/SummaryView";
import TasksView from "./views/TasksView";
import NewTaskView from "./views/NewTaskView";
import "./App.css";

export default function App() {
  const {
    tareas,
    cargando,
    guardando,
    error,
    errorCarga,
    reintentar,
    limpiarError,
    crearTarea,
    actualizarTarea,
    editarTitulo,
    eliminarTarea,
  } = useTareas();
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [vistaActiva, setVistaActiva] = useState("resumen");
  const tareasFiltradas = tareas.filter((t) => {
    const estado =
      filtro === "todas" ||
      (filtro === "completadas" ? t.completada : !t.completada);
    return estado && t.titulo.toLowerCase().includes(busqueda.toLowerCase());
  });

  useEffect(() => {
    document.title = `TaskCampus (${tareas.filter((t) => !t.completada).length} pendientes)`;
  }, [tareas]);

  const confirmarEliminacion = async () => {
    if (await eliminarTarea(tareaAEliminar)) setTareaAEliminar(null);
  };

  return (
    <div className="app-container">
      <Header title="TaskCampus" description="Gestiona tus tareas académicas" />
      <Navigation
        vistaActiva={vistaActiva}
        onCambiarVista={setVistaActiva}
        disabled={guardando}
      />
      {cargando && (
        <p role="status" className="estado-carga">
          Cargando tareas...
        </p>
      )}
      {guardando && (
        <p role="status" className="estado-carga">
          Operación en curso...
        </p>
      )}
      {errorCarga && (
        <div role="alert" className="estado-error">
          <p>{errorCarga}</p>
          <Button label="Reintentar carga" onClick={reintentar} />
        </div>
      )}
      {error && !tareaAEliminar && (
        <div role="alert" className="estado-error">
          <p>{error}</p>
          <Button label="Cerrar mensaje" onClick={limpiarError} />
        </div>
      )}
      {!cargando && !errorCarga && (
        <>
          {vistaActiva === "resumen" && (
            <SummaryView
              tareas={tareas}
              tareasFiltradas={tareasFiltradas}
              filtro={filtro}
            />
          )}
          {vistaActiva === "tareas" && (
            <TasksView
              tareasFiltradas={tareasFiltradas}
              filtro={filtro}
              onCambiarFiltro={setFiltro}
              busqueda={busqueda}
              onCambiarBusqueda={setBusqueda}
              onToggle={(id, actual) =>
                actualizarTarea(id, { completada: !actual })
              }
              onEliminar={(id) => {
                limpiarError();
                setTareaAEliminar(id);
              }}
              onEditarTitulo={editarTitulo}
              guardando={guardando}
              tareaAEliminar={tareaAEliminar}
              error={error}
              onConfirmarEliminacion={confirmarEliminacion}
              onCancelarEliminacion={() => {
                setTareaAEliminar(null);
                limpiarError();
              }}
            />
          )}
          {vistaActiva === "nueva" && (
            <NewTaskView onAgregar={crearTarea} guardando={guardando} />
          )}
        </>
      )}
    </div>
  );
}
