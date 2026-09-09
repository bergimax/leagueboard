// LeagueBoard API Service - Real backend calls
// Connected to FastAPI backend at http://localhost:8000

const API_BASE = 'http://localhost:8000/api'

const api = {
  // Helper to make requests
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const options = {
      method,
      headers
    }
    if (body) {
      options.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options)
      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.detail || 'Error' }
      }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Authentication
  login: async (email, password) => {
    const result = await api.request('POST', '/auth/login', { email, password })
    if (result.success) {
      const { access_token, user } = result.data
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      return { success: true, user }
    }
    return result
  },

  logout: async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { success: true }
  },

  getCurrentUser: async () => {
    const user = localStorage.getItem('user')
    if (user) {
      return { success: true, user: JSON.parse(user) }
    }
    return { success: false }
  },

  // Leagues
  getLeagues: async () => {
    return api.request('GET', '/leagues')
  },

  getLeague: async (leagueId) => {
    return api.request('GET', `/leagues/${leagueId}`)
  },

  // Standings
  getStandings: async (leagueId) => {
    const result = await api.request('GET', `/leagues/${leagueId}/standings`)
    if (result.success) {
      return { success: true, data: result.data }
    }
    return result
  },

  // Games/Schedule
  getGames: async (leagueId) => {
    const result = await api.request('GET', `/leagues/${leagueId}/games`)
    if (result.success) {
      return { success: true, data: result.data }
    }
    return result
  },

  getRecentGames: async () => {
    return api.request('GET', '/games')
  },

  getGame: async (gameId) => {
    return api.request('GET', `/games/${gameId}`)
  },

  // Teams
  getTeam: async (teamId) => {
    return api.request('GET', `/teams/${teamId}`)
  },

  // Admin: Update game score
  updateGameScore: async (gameId, homeScore, awayScore) => {
    return api.request('PUT', `/games/${gameId}`, {
      home_score: homeScore,
      away_score: awayScore
    })
  }
}

// Keep this for reference - old mock data (no longer used)
const mockData = {
  currentUser: {
    id: 1,
    email: 'admin@example.com',
    role: 'admin',
    token: 'mock-token-12345'
  },
  leagues: [
    { id: 1, name: 'Local Soccer League', sport: 'soccer', season: 2024 },
    { id: 2, name: 'Basketball Championship', sport: 'basketball', season: 2024 }
  ],
  teams: {
    1: [
      { id: 1, league_id: 1, name: 'Eagles', wins: 5, losses: 2, draws: 1, points: 16 },
      { id: 2, league_id: 1, name: 'Tigers', wins: 4, losses: 2, draws: 2, points: 14 },
      { id: 3, league_id: 1, name: 'Wolves', wins: 3, losses: 4, draws: 1, points: 10 },
      { id: 4, league_id: 1, name: 'Panthers', wins: 2, losses: 5, draws: 1, points: 7 }
    ],
    2: [
      { id: 5, league_id: 2, name: 'Warriors', wins: 6, losses: 1, draws: 0, points: 18 },
      { id: 6, league_id: 2, name: 'Lakers', wins: 5, losses: 2, draws: 0, points: 15 },
      { id: 7, league_id: 2, name: 'Celtics', wins: 4, losses: 3, draws: 0, points: 12 },
      { id: 8, league_id: 2, name: 'Nets', wins: 1, losses: 6, draws: 0, points: 3 }
    ]
  },
  games: [
    {
      id: 1,
      league_id: 1,
      home_team_id: 1,
      away_team_id: 2,
      home_team: 'Eagles',
      away_team: 'Tigers',
      home_score: 2,
      away_score: 1,
      date: '2024-09-05T15:00:00',
      status: 'finished',
      league_name: 'Local Soccer League'
    },
    {
      id: 2,
      league_id: 1,
      home_team_id: 3,
      away_team_id: 4,
      home_team: 'Wolves',
      away_team: 'Panthers',
      home_score: 1,
      away_score: 0,
      date: '2024-09-06T16:00:00',
      status: 'finished',
      league_name: 'Local Soccer League'
    },
    {
      id: 3,
      league_id: 1,
      home_team_id: 1,
      away_team_id: 3,
      home_team: 'Eagles',
      away_team: 'Wolves',
      home_score: null,
      away_score: null,
      date: '2024-09-12T15:00:00',
      status: 'scheduled',
      league_name: 'Local Soccer League'
    },
    {
      id: 4,
      league_id: 2,
      home_team_id: 5,
      away_team_id: 6,
      home_team: 'Warriors',
      away_team: 'Lakers',
      home_score: 108,
      away_score: 95,
      date: '2024-09-08T19:00:00',
      status: 'finished',
      league_name: 'Basketball Championship'
    },
    {
      id: 5,
      league_id: 2,
      home_team_id: 7,
      away_team_id: 8,
      home_team: 'Celtics',
      away_team: 'Nets',
      home_score: null,
      away_score: null,
      date: '2024-09-13T19:30:00',
      status: 'scheduled',
      league_name: 'Basketball Championship'
    }
  ],
  players: {
    1: [
      { id: 1, team_id: 1, name: 'John Smith', number: 7, position: 'Forward' },
      { id: 2, team_id: 1, name: 'Mike Johnson', number: 10, position: 'Midfielder' },
      { id: 3, team_id: 1, name: 'David Brown', number: 1, position: 'Goalkeeper' }
    ],
    5: [
      { id: 20, team_id: 5, name: 'Stephen Curry', number: 30, position: 'Point Guard' },
      { id: 21, team_id: 5, name: 'Klay Thompson', number: 11, position: 'Shooting Guard' },
      { id: 22, team_id: 5, name: 'Draymond Green', number: 23, position: 'Power Forward' }
    ]
  }
};

export default api;
