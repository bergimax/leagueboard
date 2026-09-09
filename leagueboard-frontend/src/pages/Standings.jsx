import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Standings.css'

export default function Standings() {
  const { leagueId } = useParams()
  const [standings, setStandings] = useState([])
  const [league, setLeague] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStandings()
  }, [leagueId])

  const fetchStandings = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:5000/api/leagues/${leagueId}/standings`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        setLeague(data.league)
        setStandings(data.standings)
      }
    } catch (error) {
      console.error('Error fetching standings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="standings">
      <h1>{league?.name} - Standings</h1>

      {standings.length === 0 ? (
        <p className="no-data">No teams yet</p>
      ) : (
        <table className="standings-table">
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
              <tr key={row.team_id}>
                <td className="rank">{index + 1}</td>
                <td className="team-name">{row.team_name}</td>
                <td>{row.played}</td>
                <td className="wins">{row.wins}</td>
                <td className="losses">{row.losses}</td>
                <td className="draws">{row.draws}</td>
                <td className="points"><strong>{row.points}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
