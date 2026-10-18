export default function TaskSummary({
  total = 0,
  completadas = 0,
  pendientes = 0,
  mostrando = 0,
  filtroActual = "todas",
}) {
  return (
    <div className="summary-grid">
      {[
        ["Total", total],
        ["Completadas", completadas],
        ["Pendientes", pendientes],
        [`Mostrando (${filtroActual} y búsqueda)`, mostrando],
      ].map(([texto, cantidad]) => (
        <div className="summary-item" key={texto}>
          <span className="summary-numero">{cantidad}</span>
          <span className="summary-label">{texto}</span>
        </div>
      ))}
    </div>
  );
}
