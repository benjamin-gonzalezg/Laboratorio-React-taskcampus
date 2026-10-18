import Card from "../components/Card";
import TaskList from "../components/TaskList";
import Modal from "../components/Modal";
export default function TasksView({
  tareasFiltradas,
  filtro,
  onCambiarFiltro,
  busqueda,
  onCambiarBusqueda,
  onToggle,
  onEliminar,
  onEditarTitulo,
  guardando,
  tareaAEliminar,
  error,
  onConfirmarEliminacion,
  onCancelarEliminacion,
}) {
  return (
    <div>
      <Card titulo="Mis tareas">
        <TaskList
          tareas={tareasFiltradas}
          filtro={filtro}
          onCambiarFiltro={onCambiarFiltro}
          busqueda={busqueda}
          onCambiarBusqueda={onCambiarBusqueda}
          onToggle={onToggle}
          onEliminar={onEliminar}
          onEditarTitulo={onEditarTitulo}
          guardando={guardando}
        />
      </Card>
      <Modal
        visible={tareaAEliminar !== null}
        mensaje="¿Seguro que deseas eliminar esta tarea?"
        onConfirmar={onConfirmarEliminacion}
        onCancelar={onCancelarEliminacion}
        guardando={guardando}
        error={error}
      />
    </div>
  );
}
