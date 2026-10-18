import { useState } from "react";
import Button from "./Button";
import TaskItem from "./TaskItem";

const TaskList = ({
  tareas,
  filtro,
  onCambiarFiltro,
  onToggle,
  onEliminar,
  onEditarTitulo,
  guardando,
}) => {
  const [busqueda, setBusqueda] = useState("");

  // Combinación de filtro por categoría y filtro por texto de búsqueda
  const tareasFiltradas = tareas.filter((t) => {
    const coincideTexto = t.titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideTexto;
  });

  const handleCompletar = (id, completadaActual) => {
    if (onToggle) {
      onToggle(id, completadaActual);
    }
  };

  return (
    <div>
      {/* Fila de Controles: Filtros y Buscador */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Botones de filtro por estado */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            label="📋 Todas"
            onClick={() => onCambiarFiltro("todas")}
            variant={filtro === "todas" ? "primary" : "secondary"}
          />
          <Button
            label="⏳ Pendientes"
            onClick={() => onCambiarFiltro("pendientes")}
            variant={filtro === "pendientes" ? "primary" : "secondary"}
          />
          <Button
            label="✅ Completadas"
            onClick={() => onCambiarFiltro("completadas")}
            variant={filtro === "completadas" ? "primary" : "secondary"}
          />
        </div>

        {/* Input de filtro por texto */}
        <input
          type="text"
          placeholder="🔍 Buscar tarea..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="task-input"
          style={{ maxWidth: "220px" }}
        />
      </div>

      {tareasFiltradas.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          No hay tareas en esta categoría 🎉
        </p>
      )}

      <ul className="task-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tareasFiltradas.map((tarea) => (
          <TaskItem
            key={tarea.id}
            tarea={tarea}
            handleCompletar={handleCompletar}
            onEliminar={onEliminar}
            onEditarTitulo={onEditarTitulo}
            guardando={guardando}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;