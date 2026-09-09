import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Schedule.css'

export default function Schedule() {
  const { leagueId } = useParams()
  const [games, setGames] = useState([])
  const [league, setLeague] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [leagueId])

  const fetchSchedule = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/leagues/${leagueId}/games`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setLeague(data.league)
        setGames(data.games)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="schedule">
      <h1>{league?.name} - Schedule</h1>

      {games.length === 0 ? (
        <p className="no-data">No games scheduled</p>
      ) : (
        <div className="games-list">
          {games.map(game => (
            <Link key={game.id} to={`/game/${game.id}`} className="schedule-item">
              <div className="game-date">
                {new Date(game.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="game-time">
                {new Date(game.date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="game-matchup">
                <span className="team">{game.home_team}</span>
                <span className="vs">vs</span>
                <span className="team">{game.away_team}</span>
              </div>
              <div className="game-status">
                {game.status === 'scheduled' && <span className="badge scheduled">Scheduled</span>}
                {game.status === 'finished' && <span className="badge finished">Finished</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
