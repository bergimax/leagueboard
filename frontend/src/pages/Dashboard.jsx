import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const [leagues, setLeagues] = useState([])
  const [games, setGames] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const leaguesRes = await api.getLeagues()
    const gamesRes = await api.getRecentGames()
    if (leaguesRes.success) setLeagues(leaguesRes.data)
    if (gamesRes.success) setGames(gamesRes.data)
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <section style={styles.section}>
        <h2>Leagues</h2>
        <div style={styles.grid}>
          {leagues.map(league => (
            <div key={league.id} style={styles.card}>
              <h3>{league.name}</h3>
              <p style={styles.sport}>{league.sport}</p>
              <p style={styles.season}>Season {league.season}</p>
              <div style={styles.links}>
                <Link to={`/standings/${league.id}`} style={styles.link}>Standings</Link>
                <Link to={`/schedule/${league.id}`} style={styles.link}>Schedule</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2>Recent Games</h2>
        {games.length === 0 ? (
          <p style={styles.noData}>No games yet</p>
        ) : (
          <div style={styles.gamesList}>
            {games.map(game => (
              <Link key={game.id} to={`/game/${game.id}`} style={styles.gameItem}>
                <div style={styles.gameTeams}>
                  <span style={styles.team}>{game.home_team}</span>
                  <span style={styles.score}>{game.home_score} - {game.away_score}</span>
                  <span style={styles.team}>{game.away_team}</span>
                </div>
                <div style={styles.gameMeta}>
                  <span>{game.league_name}</span>
                  <span>{new Date(game.date).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

const styles = {
  section: { marginBottom: '3rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  },
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sport: { color: '#64748b', margin: '0.25rem 0', fontSize: '0.9rem' },
  season: { color: '#94a3b8', margin: '0.5rem 0 1rem 0', fontSize: '0.85rem' },
  links: { display: 'flex', gap: '0.5rem' },
  link: {
    flex: 1,
    padding: '0.5rem',
    background: '#2563eb',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.85rem'
  },
  gamesList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  gameItem: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gameTeams: { display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 },
  team: { fontWeight: '500', color: '#1e293b', minWidth: '150px' },
  score: { fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb', minWidth: '80px', textAlign: 'center' },
  gameMeta: { display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem' },
  noData: { color: '#94a3b8', textAlign: 'center', padding: '2rem' }
}
