import Button from "./Button";
import TaskItem from "./TaskItem";
export default function TaskList({
  tareas,
  filtro,
  onCambiarFiltro,
  busqueda,
  onCambiarBusqueda,
  onToggle,
  onEliminar,
  onEditarTitulo,
  guardando,
}) {
  return (
    <div>
      <div className="list-controls">
        <div className="filter-buttons">
          {[
            ["todas", "Todas"],
            ["pendientes", "Pendientes"],
            ["completadas", "Completadas"],
          ].map(([valor, texto]) => (
            <Button
              key={valor}
              label={texto}
              onClick={() => onCambiarFiltro(valor)}
              variant={filtro === valor ? "primary" : "secondary"}
            />
          ))}
        </div>
        <input
          aria-label="Buscar tarea"
          placeholder="Buscar tarea..."
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          className="task-input search-input"
        />
      </div>
      {tareas.length === 0 && (
        <p className="empty-state">
          No hay tareas que coincidan con los filtros.
        </p>
      )}
      <ul className="task-list">
        {tareas.map((tarea) => (
          <TaskItem
            key={tarea.id}
            tarea={tarea}
            handleCompletar={onToggle}
            onEliminar={onEliminar}
            onEditarTitulo={onEditarTitulo}
            guardando={guardando}
          />
        ))}
      </ul>
    </div>
  );
}
