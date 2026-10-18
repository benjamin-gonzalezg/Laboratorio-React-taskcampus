const TaskSummary = ({
  total = 0,
  completadas = 0,
  pendientes = 0,
  mostrando = 0,
  filtroActual = "todas",
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Total */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#1d4ed8",
            margin: 0,
          }}
        >
          {total}
        </p>
        <p style={{ color: "#64748b", margin: 0 }}>Total</p>
      </div>

      {/* Completadas */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#16a34a",
            margin: 0,
          }}
        >
          {completadas}
        </p>
        <p style={{ color: "#64748b", margin: 0 }}>Completadas</p>
      </div>

      {/* Pendientes */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#f59e0b",
            margin: 0,
          }}
        >
          {pendientes}
        </p>
        <p style={{ color: "#64748b", margin: 0 }}>Pendientes</p>
      </div>

      {/* Mostrando (Lifting State Up) */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {mostrando}
        </p>
        <p style={{ color: "#64748b", margin: 0 }}>
          Mostrando ({filtroActual})
        </p>
      </div>
    </div>
  );
};

export default TaskSummary;