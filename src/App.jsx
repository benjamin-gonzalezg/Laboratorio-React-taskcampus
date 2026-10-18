import { useState, useEffect } from "react";
import useTareas from "./hooks/useTareas";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SummaryView from "./views/SummaryView";
import TasksView from "./views/TasksView";
import NewTaskView from "./views/NewTaskView";
import "./App.css";

const App = () => {
  const {
    tareas,
    cargando,
    guardando,
    error,
    crearTarea,
    actualizarTarea,
    editarTitulo,
    eliminarTarea,
  } = useTareas();

  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [vistaActiva, setVistaActiva] = useState("resumen");

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === "completadas") return t.completada;
    if (filtro === "pendientes") return !t.completada;
    return true;
  });

  useEffect(() => {
    const pendientes = tareas.filter((t) => !t.completada).length;
    document.title = `TaskCampus (${pendientes} pendientes)`;
  }, [tareas]);

  const handleAgregarTarea = (titulo) => {
    crearTarea(titulo);
    setVistaActiva("tareas");
  };

  const handleToggleCompletada = (id, completadaActual) => {
    actualizarTarea(id, { completada: !completadaActual });
  };

  const handleConfirmarEliminacion = () => {
    eliminarTarea(tareaAEliminar);
    setTareaAEliminar(null);
  };

  return (
    <div className="app-container">
      <Header title="TaskCampus" description="Gestiona tus tareas académicas" />
      <Navigation vistaActiva={vistaActiva} onCambiarVista={setVistaActiva} />

      {cargando && <p className="estado-carga">⏳ Cargando tareas...</p>}
      {error && <p className="estado-error">⚠️ Error: {error}</p>}

      {!cargando && !error && (
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
              tareas={tareas}
              tareasFiltradas={tareasFiltradas}
              filtro={filtro}
              onCambiarFiltro={setFiltro}
              onToggle={handleToggleCompletada}
              onEliminar={setTareaAEliminar}
              onEditarTitulo={editarTitulo}
              guardando={guardando}
              tareaAEliminar={tareaAEliminar}
              onConfirmarEliminacion={handleConfirmarEliminacion}
              onCancelarEliminacion={() => setTareaAEliminar(null)}
            />
          )}

          {vistaActiva === "nueva" && (
            <NewTaskView onAgregar={handleAgregarTarea} guardando={guardando} />
          )}
        </>
      )}
    </div>
  );
};

export default App;