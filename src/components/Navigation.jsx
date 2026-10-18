import Button from "./Button";
export default function Navigation({ vistaActiva, onCambiarVista, disabled }) {
  return (
    <nav className="navigation" aria-label="Vistas">
      {[
        ["resumen", "Resumen"],
        ["tareas", "Tareas"],
        ["nueva", "Nueva tarea"],
      ].map(([vista, texto]) => (
        <Button
          key={vista}
          label={texto}
          onClick={() => onCambiarVista(vista)}
          disabled={disabled}
          current={vistaActiva === vista}
          variant={vistaActiva === vista ? "primary" : "secondary"}
        />
      ))}
    </nav>
  );
}
