import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Standings from './pages/Standings'
import Schedule from './pages/Schedule'
import GameDetail from './pages/GameDetail'
import AdminPanel from './pages/AdminPanel'
import TeamProfile from './pages/TeamProfile'
import Login from './pages/Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Login setUser={setUser} />
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/standings/:leagueId" element={<Standings />} />
            <Route path="/schedule/:leagueId" element={<Schedule />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
            <Route path="/team/:teamId" element={<TeamProfile />} />
            {user?.role === 'admin' && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
