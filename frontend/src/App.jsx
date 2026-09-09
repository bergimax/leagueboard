import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import api from './api'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Standings from './pages/Standings'
import Schedule from './pages/Schedule'
import GameDetail from './pages/GameDetail'
import AdminPanel from './pages/AdminPanel'
import TeamProfile from './pages/TeamProfile'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const result = await api.getCurrentUser()
    if (result.success) {
      setUser(result.user)
    }
    setLoading(false)
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    await api.logout()
    setUser(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  if (!user) {
    return <Login onLogin={handleLogin} />
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
