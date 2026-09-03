export function Header() {
  return (
    <header className="topbar" role="banner">
      <div className="brand" aria-label="Movie discovery home">
        <div className="brand-mark" aria-hidden="true">
          M
        </div>

        <div className="brand-copy">
          <span className="brand-name">MovieNest</span>
          <small>Discover tonight</small>
        </div>
      </div>

      <nav className="main-nav" aria-label="Primary navigation">
        <a href="#home">Home</a>
        <a href="#discover">Discover</a>
        <a href="#favorites">Favorites</a>
      </nav>
    </header>
  )
}
