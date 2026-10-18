import { useState } from "react";
import Button from "./Button";

const TaskForm = ({ onAgregar, guardando }) => {
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (titulo.trim().length < 3) {
      setError("El título debe tener al menos 3 caracteres.");
      return;
    }

    onAgregar(titulo.trim());
    setTitulo("");
    setError("");
  };

  return (
    <div className="card">
      <h2 className="section-title">Agregar Nueva Tarea</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escribe el título de la tarea..."
          className="task-input"
          disabled={guardando}
        />
        <Button
          label={guardando ? "Guardando..." : "Agregar"}
          variant="primary"
          disabled={guardando}
        />
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default TaskForm;