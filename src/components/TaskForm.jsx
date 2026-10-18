import { useState } from "react";
import Button from "./Button";

export default function TaskForm({ onAgregar, guardando }) {
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const enviar = async (e) => {
    e.preventDefault();
    if (guardando) return;
    setMensaje("");
    if (!titulo.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }
    setError("");
    if (await onAgregar(titulo.trim())) {
      setTitulo("");
      setMensaje(
        "Tarea creada. Puedes verla en Tareas con el filtro correspondiente.",
      );
    }
  };
  return (
    <section className="card">
      <h2 className="section-title">Agregar nueva tarea</h2>
      <form onSubmit={enviar} className="task-form">
        <input
          aria-label="Título de la nueva tarea"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            setMensaje("");
          }}
          placeholder="Escribe el título..."
          className="task-input"
          disabled={guardando}
        />
        <Button
          type="submit"
          label={guardando ? "Guardando..." : "Agregar"}
          disabled={guardando}
        />
      </form>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {mensaje && (
        <p role="status" className="form-success">
          {mensaje}
        </p>
      )}
    </section>
  );
}
