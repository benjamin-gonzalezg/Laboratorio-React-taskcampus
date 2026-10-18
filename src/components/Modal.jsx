const Modal = ({ visible, mensaje, onConfirmar, onCancelar }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{mensaje}</p>
        <div className="modal-acciones">
          <button className="btn btn-danger" onClick={onConfirmar}>
            Confirmar
          </button>
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;