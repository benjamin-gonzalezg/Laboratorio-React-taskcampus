export default function EmptyState({
  mensaje = "No hay tareas disponibles",
  icono = "📭",
}) {
  return (
    <div className="empty-state">
      <span>{icono}</span>
      <p>{mensaje}</p>
    </div>
  );
}
