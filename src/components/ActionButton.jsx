function ActionButton({ onReview }) {
  return (
    <section className="card">
      <h2 className="section-title">Acciones</h2>
      <button className="btn btn-primary" onClick={onReview}>
        Revisar tareas
      </button>
    </section>
  )
}

export default ActionButton