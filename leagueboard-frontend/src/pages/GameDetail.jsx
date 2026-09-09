import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './GameDetail.css'

export default function GameDetail() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/games/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) setGame(await response.json())
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!game) return <div className="no-data">Game not found</div>

  return (
    <div className="game-detail">
      <h1>Game Details</h1>

      <div className="game-header">
        <div className="team home">
          <h2>{game.home_team}</h2>
          <div className="score">{game.home_score}</div>
        </div>

        <div className="match-info">
          <p className="vs">vs</p>
          <p className="league">{game.league_name}</p>
          <p className="date">
            {new Date(game.date).toLocaleDateString()}
          </p>
        </div>

        <div className="team away">
          <h2>{game.away_team}</h2>
          <div className="score">{game.away_score}</div>
        </div>
      </div>

      <div className="game-stats">
        <div className="stat-group">
          <h3>Game Information</h3>
          <p><strong>Status:</strong> {game.status}</p>
          <p><strong>League:</strong> {game.league_name}</p>
          <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
