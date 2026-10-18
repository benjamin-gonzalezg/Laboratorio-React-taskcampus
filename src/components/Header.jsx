function Header({ title, description, userName }) {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <p className="header-description">{description}</p>
      {userName && <p>Usuario activo: <strong>{userName}</strong></p>}
    </header>
  )
}

export default Header