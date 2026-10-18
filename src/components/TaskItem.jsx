import { useState } from "react";
import Button from "./Button";
import Badge from "./Badge";

const TaskItem = ({
  tarea,
  handleCompletar,
  onEliminar,
  onEditarTitulo,
  guardando,
}) => {
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo);

  const guardarEdicion = () => {
    if (nuevoTitulo.trim() !== "" && nuevoTitulo !== tarea.titulo) {
      onEditarTitulo(tarea.id, nuevoTitulo.trim());
    } else {
      setNuevoTitulo(tarea.titulo);
    }
    setEditando(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      guardarEdicion();
    } else if (e.key === "Escape") {
      setNuevoTitulo(tarea.titulo);
      setEditando(false);
    }
  };

  return (
    <li className="task-item">
      {/* ZONA IZQUIERDA: Badge + Título editable en doble clic */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
        <Badge texto={tarea.completada ? "completada" : "pendiente"} />

        {editando ? (
          <input
            type="text"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            onBlur={guardarEdicion}
            onKeyDown={handleKeyDown}
            autoFocus
            className="task-input"
            style={{ padding: "4px 8px" }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditando(true)}
            title="Doble clic para editar el título"
            style={{
              textDecoration: tarea.completada ? "line-through" : "none",
              color: tarea.completada ? "#94a3b8" : "inherit",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {tarea.titulo}
          </span>
        )}
      </div>

      {/* ZONA DERECHA: Botones */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <Button
          label={tarea.completada ? "Desmarcar" : "Completar"}
          onClick={() => handleCompletar(tarea.id, tarea.completada)}
          variant={tarea.completada ? "success" : "primary"}
          disabled={guardando}
        />
        <Button
          label="Eliminar"
          onClick={() => onEliminar(tarea.id)}
          variant="danger"
          disabled={guardando}
        />
      </div>
    </li>
  );
};

export default TaskItem;