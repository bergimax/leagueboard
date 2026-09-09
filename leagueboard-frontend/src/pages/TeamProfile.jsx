import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './TeamProfile.css'

export default function TeamProfile() {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam()
  }, [teamId])

  const fetchTeam = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/teams/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) setTeam(await response.json())
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!team) return <div className="no-data">Team not found</div>

  return (
    <div className="team-profile">
      <h1>{team.name}</h1>

      <div className="team-header">
        <div className="team-info">
          <p><strong>League:</strong> {team.league_name}</p>
          <p><strong>Wins:</strong> {team.wins}</p>
          <p><strong>Losses:</strong> {team.losses}</p>
          <p><strong>Points:</strong> {team.points}</p>
        </div>
      </div>

      {team.roster && team.roster.length > 0 && (
        <div className="roster-section">
          <h2>Roster</h2>
          <table className="roster-table">
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
