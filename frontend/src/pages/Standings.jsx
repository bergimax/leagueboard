import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function Standings() {
  const { leagueId } = useParams()
  const [standings, setStandings] = useState([])
  const [league, setLeague] = useState(null)

  useEffect(() => {
    loadData()
  }, [leagueId])

  const loadData = async () => {
    const leagueRes = await api.getLeague(leagueId)
    const standingsRes = await api.getStandings(leagueId)
    if (leagueRes.success) setLeague(leagueRes.data)
    if (standingsRes.success) setStandings(standingsRes.data)
  }

  return (
    <div>
      <h1>{league?.name} - Standings</h1>

      {standings.length === 0 ? (
        <p>No teams yet</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Played</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, index) => (
              <tr key={row.id}>
                <td style={styles.rank}>{index + 1}</td>
                <td style={styles.teamName}>{row.name}</td>
                <td>{row.played}</td>
                <td style={styles.wins}>{row.wins}</td>
                <td style={styles.losses}>{row.losses}</td>
                <td style={styles.draws}>{row.draws}</td>
                <td style={styles.points}><strong>{row.points}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    marginTop: '1.5rem',
    borderRadius: '8px'
  },
  rank: { fontWeight: 'bold', color: '#2563eb' },
  teamName: { fontWeight: '500', color: '#1e293b' },
  wins: { color: '#16a34a', fontWeight: '500' },
  losses: { color: '#dc2626', fontWeight: '500' },
  draws: { color: '#f59e0b' },
  points: { color: '#2563eb', fontSize: '1.1rem' }
}
