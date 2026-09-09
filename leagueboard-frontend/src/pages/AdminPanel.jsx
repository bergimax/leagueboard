import { useState, useEffect } from 'react'
import './AdminPanel.css'

export default function AdminPanel() {
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [games, setGames] = useState([])
  const [editingGame, setEditingGame] = useState(null)
  const [formData, setFormData] = useState({
    home_score: '',
    away_score: '',
    status: 'finished'
  })

  useEffect(() => {
    fetchLeagues()
  }, [])

  const fetchLeagues = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:5000/api/leagues', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) setLeagues(await response.json())
    } catch (error) {
      console.error('Error fetching leagues:', error)
    }
  }

  const handleLeagueSelect = async (leagueId) => {
    setSelectedLeague(leagueId)
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/leagues/${leagueId}/games`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setGames(data.games)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }

  const handleEditGame = (game) => {
    setEditingGame(game.id)
    setFormData({
      home_score: game.home_score || '',
      away_score: game.away_score || '',
      status: game.status
    })
  }

  const handleSubmit = async (gameId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/games/${gameId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      )
      if (response.ok) {
        setEditingGame(null)
        handleLeagueSelect(selectedLeague)
      }
    } catch (error) {
      console.error('Error updating game:', error)
    }
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="admin-content">
        <div className="leagues-sidebar">
          <h2>Leagues</h2>
          {leagues.map(league => (
            <button
              key={league.id}
              onClick={() => handleLeagueSelect(league.id)}
              className={`league-btn ${selectedLeague === league.id ? 'active' : ''}`}
            >
              {league.name}
            </button>
          ))}
        </div>

        <div className="games-section">
          {selectedLeague ? (
            <>
              <h2>Manage Games</h2>
              {games.length === 0 ? (
                <p className="no-data">No games</p>
              ) : (
                <div className="games-list">
                  {games.map(game => (
                    <div key={game.id} className="admin-game-card">
                      {editingGame === game.id ? (
                        <div className="edit-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Home Score</label>
                              <input
                                type="number"
                                value={formData.home_score}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  home_score: e.target.value
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Away Score</label>
                              <input
                                type="number"
                                value={formData.away_score}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  away_score: e.target.value
                                })}
                              />
                            </div>
                          </div>
                          <div className="form-actions">
                            <button
                              onClick={() => handleSubmit(game.id)}
                              className="save-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingGame(null)}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="game-info">
                            <span className="teams">
                              {game.home_team} vs {game.away_team}
                            </span>
                            <span className="score">
                              {game.home_score || '-'} - {game.away_score || '-'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEditGame(game)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="no-data">Select a league</p>
          )}
        </div>
      </div>
    </div>
  )
}
