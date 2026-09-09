import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function GameDetail() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)

  useEffect(() => {
    loadGame()
  }, [gameId])

  const loadGame = async () => {
    const res = await api.getGame(gameId)
    if (res.success) setGame(res.data)
  }

  if (!game) return <div>Loading...</div>

  return (
    <div>
      <h1>Game Details</h1>

      <div style={styles.header}>
        <div style={styles.team}>
          <h2>{game.home_team}</h2>
          <div style={styles.score}>{game.home_score || '-'}</div>
        </div>

        <div style={styles.matchInfo}>
          <p style={styles.vs}>vs</p>
          <p>{game.league_name}</p>
          <p>{new Date(game.date).toLocaleDateString()}</p>
        </div>

        <div style={styles.team}>
          <h2>{game.away_team}</h2>
          <div style={styles.score}>{game.away_score || '-'}</div>
        </div>
      </div>

      <div style={styles.stats}>
        <h3>Information</h3>
        <p><strong>Status:</strong> {game.status}</p>
        <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

const styles = {
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '2rem',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    marginTop: '1.5rem'
  },
  team: { textAlign: 'center' },
  team_h2: { margin: '0 0 1rem 0', fontSize: '1.5rem' },
  score: { fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 },
  matchInfo: { textAlign: 'center' },
  vs: { fontSize: '1.2rem', margin: '0.5rem 0' },
  stats: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '2rem'
  }
}
