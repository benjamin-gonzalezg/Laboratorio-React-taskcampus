const EmptyState = ({ mensaje = "No hay tareas disponibles", icono = "📭" }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{icono}</div>
      <p>{mensaje}</p>
    </div>
  );
};

export default EmptyState;