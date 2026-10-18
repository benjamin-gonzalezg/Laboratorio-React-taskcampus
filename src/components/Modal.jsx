import Button from "./Button";
export default function Modal({
  visible,
  mensaje,
  onConfirmar,
  onCancelar,
  guardando = false,
  error,
}) {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar eliminación"
      >
        <p>{mensaje}</p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="modal-acciones">
          <Button
            label={guardando ? "Eliminando..." : "Confirmar"}
            variant="danger"
            onClick={onConfirmar}
            disabled={guardando}
          />
          <Button
            label="Cancelar"
            variant="secondary"
            onClick={onCancelar}
            disabled={guardando}
          />
        </div>
      </div>
    </div>
  );
}
