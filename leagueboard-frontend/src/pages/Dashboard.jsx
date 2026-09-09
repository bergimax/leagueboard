import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const [leagues, setLeagues] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    try {
      const [leaguesRes, gamesRes] = await Promise.all([
        fetch('http://localhost:5000/api/leagues', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/games/recent', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (leaguesRes.ok) setLeagues(await leaguesRes.json())
      if (gamesRes.ok) setGames(await gamesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <section className="leagues-section">
        <h2>Leagues</h2>
        <div className="leagues-grid">
          {leagues.map(league => (
            <div key={league.id} className="league-card">
              <h3>{league.name}</h3>
              <p className="sport">{league.sport}</p>
              <p className="season">Season {league.season}</p>
              <div className="league-links">
                <Link to={`/standings/${league.id}`}>Standings</Link>
                <Link to={`/schedule/${league.id}`}>Schedule</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="games-section">
        <h2>Recent Games</h2>
        {games.length === 0 ? (
          <p className="no-data">No games yet</p>
        ) : (
          <div className="games-list">
            {games.map(game => (
              <Link key={game.id} to={`/game/${game.id}`} className="game-item">
                <div className="game-teams">
                  <span className="home-team">{game.home_team}</span>
                  <span className="score">{game.home_score} - {game.away_score}</span>
                  <span className="away-team">{game.away_team}</span>
                </div>
                <div className="game-meta">
                  <span className="league">{game.league_name}</span>
                  <span className="date">{new Date(game.date).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
