import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏆 LeagueBoard
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Dashboard</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          <div className="navbar-user">
            <span className="user-info">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
