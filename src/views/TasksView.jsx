import Card from "../components/Card";
import TaskList from "../components/TaskList";
import Modal from "../components/Modal";

const TasksView = ({
  tareas,
  tareasFiltradas,
  filtro,
  onCambiarFiltro,
  onToggle,
  onEliminar,
  onEditarTitulo,
  guardando,
  tareaAEliminar,
  onConfirmarEliminacion,
  onCancelarEliminacion,
}) => {
  return (
    <div>
      <Card titulo="Mis Tareas">
        <TaskList
          tareas={tareasFiltradas}
          filtro={filtro}
          onCambiarFiltro={onCambiarFiltro}
          onToggle={onToggle}
          onEliminar={onEliminar}
          onEditarTitulo={onEditarTitulo}
          guardando={guardando}
        />
      </Card>

      <Modal
        visible={tareaAEliminar !== null}
        mensaje="¿Seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        onConfirmar={onConfirmarEliminacion}
        onCancelar={onCancelarEliminacion}
      />
    </div>
  );
};

export default TasksView;