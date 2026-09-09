import { useState, useEffect } from 'react'
import api from '../api'

export default function AdminPanel() {
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [games, setGames] = useState([])
  const [editingGame, setEditingGame] = useState(null)
  const [formData, setFormData] = useState({ home_score: '', away_score: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadLeagues()
  }, [])

  const loadLeagues = async () => {
    const res = await api.getLeagues()
    if (res.success) setLeagues(res.data)
  }

  const handleLeagueSelect = async (leagueId) => {
    setSelectedLeague(leagueId)
    const res = await api.getGames(leagueId)
    if (res.success) setGames(res.data)
  }

  const handleEditGame = (game) => {
    setEditingGame(game.id)
    setFormData({
      home_score: game.home_score || '',
      away_score: game.away_score || ''
    })
  }

  const handleSave = async (gameId) => {
    const res = await api.updateGameScore(gameId, formData.home_score, formData.away_score)
    if (res.success) {
      setMessage('✓ Game updated!')
      setEditingGame(null)
      handleLeagueSelect(selectedLeague)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div>
      <h1>Admin Panel</h1>

      <div style={styles.container}>
        <div style={styles.sidebar}>
          <h2>Leagues</h2>
          {leagues.map(league => (
            <button
              key={league.id}
              onClick={() => handleLeagueSelect(league.id)}
              style={{
                ...styles.leagueBtn,
                ...(selectedLeague === league.id ? styles.leagueBtnActive : {})
              }}
            >
              {league.name}
            </button>
          ))}
        </div>

        <div style={styles.section}>
          {message && <div style={styles.alert}>{message}</div>}

          {selectedLeague ? (
            <>
              <h2>Manage Games</h2>
              {games.length === 0 ? (
                <p>No games</p>
              ) : (
                <div style={styles.gamesList}>
                  {games.map(game => (
                    <div key={game.id} style={styles.card}>
                      {editingGame === game.id ? (
                        <div>
                          <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                              <label>Home Score</label>
                              <input
                                type="number"
                                value={formData.home_score}
                                onChange={(e) => setFormData({ ...formData, home_score: e.target.value })}
                              />
                            </div>
                            <div style={styles.formGroup}>
                              <label>Away Score</label>
                              <input
                                type="number"
                                value={formData.away_score}
                                onChange={(e) => setFormData({ ...formData, away_score: e.target.value })}
                              />
                            </div>
                          </div>
                          <div style={styles.actions}>
                            <button onClick={() => handleSave(game.id)} style={styles.btnSave}>Save</button>
                            <button onClick={() => setEditingGame(null)} style={styles.btnCancel}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.gameInfo}>
                          <div>
                            <span style={styles.teams}>{game.home_team} vs {game.away_team}</span>
                            <span style={styles.score}>{game.home_score !== null ? `${game.home_score} - ${game.away_score}` : 'Not played'}</span>
                          </div>
                          <button onClick={() => handleEditGame(game)} style={styles.btnEdit}>Edit</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>Select a league</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', marginTop: '1.5rem' },
  sidebar: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem',
    height: 'fit-content'
  },
  leagueBtn: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    color: '#1e293b',
    cursor: 'pointer',
    textAlign: 'left'
  },
  leagueBtnActive: {
    background: '#2563eb',
    color: 'white',
    borderColor: '#2563eb'
  },
  section: {},
  alert: {
    background: '#dcfce7',
    color: '#166534',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    borderLeft: '4px solid #16a34a'
  },
  gamesList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.5rem'
  },
  gameInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  teams: { display: 'block', color: '#1e293b', fontWeight: '500', marginBottom: '0.5rem' },
  score: { display: 'block', color: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  actions: { display: 'flex', gap: '0.5rem' },
  btnEdit: { background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' },
  btnSave: { flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' },
  btnCancel: { flex: 1, background: '#64748b', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }
}
