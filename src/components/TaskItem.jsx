import { useRef, useState } from "react";
import Button from "./Button";
import Badge from "./Badge";

export default function TaskItem({
  tarea,
  handleCompletar,
  onEliminar,
  onEditarTitulo,
  guardando,
}) {
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo);
  const [error, setError] = useState("");
  const enviando = useRef(false);
  const cancelar = useRef(false);
  const guardar = async () => {
    if (cancelar.current || enviando.current || guardando) return;
    const titulo = nuevoTitulo.trim();
    if (!titulo) {
      setError("El título no puede estar vacío.");
      return;
    }
    setError("");
    if (titulo === tarea.titulo) {
      setEditando(false);
      return;
    }
    enviando.current = true;
    const ok = await onEditarTitulo(tarea.id, titulo);
    enviando.current = false;
    if (ok) setEditando(false);
  };
  const iniciar = () => {
    if (guardando) return;
    cancelar.current = false;
    setNuevoTitulo(tarea.titulo);
    setError("");
    setEditando(true);
  };
  return (
    <li className="task-item">
      <div className="task-content">
        <Badge texto={tarea.completada ? "completada" : "pendiente"} />
        {editando ? (
          <div className="task-edit">
            <input
              aria-label="Editar título"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              onBlur={guardar}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  guardar();
                }
                if (e.key === "Escape") {
                  cancelar.current = true;
                  setEditando(false);
                  setError("");
                }
              }}
              autoFocus
              disabled={guardando}
              className="task-input"
            />
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
          </div>
        ) : (
          <span
            onDoubleClick={iniciar}
            title="Doble clic para editar"
            className={`task-title ${tarea.completada ? "task-completed" : "task-pending"}`}
          >
            {tarea.titulo}
          </span>
        )}
      </div>
      <div className="task-actions">
        <Button
          label={tarea.completada ? "Desmarcar" : "Completar"}
          onClick={() => handleCompletar(tarea.id, tarea.completada)}
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
}
