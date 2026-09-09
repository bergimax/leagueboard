import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function TeamProfile() {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)

  useEffect(() => {
    loadTeam()
  }, [teamId])

  const loadTeam = async () => {
    const res = await api.getTeam(teamId)
    if (res.success) setTeam(res.data)
  }

  if (!team) return <div>Loading...</div>

  return (
    <div>
      <h1>{team.name}</h1>

      <div style={styles.header}>
        <div style={styles.info}>
          <p><strong>League:</strong> {team.league_name}</p>
          <p><strong>Wins:</strong> {team.wins}</p>
          <p><strong>Losses:</strong> {team.losses}</p>
          <p><strong>Points:</strong> {team.points}</p>
        </div>
      </div>

      {team.roster && team.roster.length > 0 && (
        <div style={styles.roster}>
          <h2>Roster</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {team.roster.map((player, idx) => (
                <tr key={idx}>
                  <td>{player.name}</td>
                  <td>{player.number}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    marginTop: '1.5rem'
  },
  info: {},
  info_p: { margin: '0.5rem 0' },
  roster: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  }
}
