const colorMap = {
  pendiente: "#f59e0b",
  completada: "#16a34a",
  en_progreso: "#2563eb",
};

const Badge = ({ texto, onClick }) => {
  const color = colorMap[texto] || "#6b7280";
  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none"
      }}
    >
      {texto}
    </span>
  );
};

export default Badge;