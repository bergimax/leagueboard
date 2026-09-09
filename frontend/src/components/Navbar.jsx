import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>🏆 LeagueBoard</Link>
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Dashboard</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.link}>Admin</Link>
          )}
          <span style={styles.user}>{user?.email}</span>
          <button onClick={onLogout} style={styles.logout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  user: {
    fontSize: '0.9rem',
    marginLeft: '1rem',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    paddingLeft: '1rem'
  },
  logout: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}
