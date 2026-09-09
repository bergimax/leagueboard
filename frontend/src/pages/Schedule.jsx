import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

export default function Schedule() {
  const { leagueId } = useParams()
  const [games, setGames] = useState([])
  const [league, setLeague] = useState(null)

  useEffect(() => {
    loadData()
  }, [leagueId])

  const loadData = async () => {
    const leagueRes = await api.getLeague(leagueId)
    const gamesRes = await api.getGames(leagueId)
    if (leagueRes.success) setLeague(leagueRes.data)
    if (gamesRes.success) setGames(gamesRes.data)
  }

  return (
    <div>
      <h1>{league?.name} - Schedule</h1>

      {games.length === 0 ? (
        <p>No games scheduled</p>
      ) : (
        <div style={styles.gamesList}>
          {games.map(game => (
            <Link key={game.id} to={`/game/${game.id}`} style={styles.item}>
              <div style={styles.date}>
                {new Date(game.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div style={styles.time}>
                {new Date(game.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={styles.matchup}>
                <span style={styles.team}>{game.home_team}</span>
                <span style={styles.vs}>vs</span>
                <span style={styles.team}>{game.away_team}</span>
              </div>
              <div style={styles.status}>
                <span style={game.status === 'finished' ? styles.badgeFinished : styles.badgeScheduled}>
                  {game.status === 'scheduled' ? 'Scheduled' : 'Finished'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  gamesList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  item: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '80px 60px 1fr auto',
    gap: '1.5rem',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit'
  },
  date: { fontWeight: '600', color: '#2563eb', textAlign: 'center' },
  time: { fontSize: '0.9rem', color: '#64748b', textAlign: 'center' },
  matchup: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  team: { flex: 1, fontWeight: '500', color: '#1e293b' },
  vs: { color: '#94a3b8', fontSize: '0.85rem' },
  status: { display: 'flex', justifyContent: 'flex-end' },
  badgeScheduled: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: '#dbeafe',
    color: '#0c4a6e'
  },
  badgeFinished: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: '#dcfce7',
    color: '#166534'
  }
}
