// Mock API Service - Centralized API calls for LeagueBoard
// Replace with actual backend calls when API is ready

const MOCK_DELAY = 300; // Simulate network delay

// Mock data
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

// Helper to simulate async delay
const delay = (ms = MOCK_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Auth APIs
export const api = {
  // Authentication
  login: async (email, password) => {
    await delay();
    if (email === 'admin@example.com' && password === 'password123') {
      localStorage.setItem('token', mockData.currentUser.token);
      localStorage.setItem('user', JSON.stringify(mockData.currentUser));
      return { success: true, user: mockData.currentUser };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  logout: async () => {
    await delay();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: async () => {
    await delay();
    const user = localStorage.getItem('user');
    if (user) {
      return { success: true, user: JSON.parse(user) };
    }
    return { success: false };
  },

  // Leagues
  getLeagues: async () => {
    await delay();
    return { success: true, data: mockData.leagues };
  },

  getLeague: async (leagueId) => {
    await delay();
    const league = mockData.leagues.find(l => l.id === parseInt(leagueId));
    return { success: !!league, data: league };
  },

  // Standings
  getStandings: async (leagueId) => {
    await delay();
    const teams = mockData.teams[leagueId] || [];
    const standings = teams
      .sort((a, b) => b.points - a.points)
      .map((team, index) => ({
        ...team,
        played: team.wins + team.losses + team.draws
      }));
    return { success: true, data: standings };
  },

  // Games/Schedule
  getGames: async (leagueId) => {
    await delay();
    const games = mockData.games.filter(g => g.league_id === parseInt(leagueId));
    return { success: true, data: games };
  },

  getRecentGames: async () => {
    await delay();
    const recent = mockData.games
      .filter(g => g.status === 'finished')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    return { success: true, data: recent };
  },

  getGame: async (gameId) => {
    await delay();
    const game = mockData.games.find(g => g.id === parseInt(gameId));
    return { success: !!game, data: game };
  },

  // Teams
  getTeam: async (teamId) => {
    await delay();
    const teams = Object.values(mockData.teams).flat();
    const team = teams.find(t => t.id === parseInt(teamId));
    if (team) {
      return {
        success: true,
        data: {
          ...team,
          roster: mockData.players[teamId] || [],
          league_name: mockData.leagues.find(l => l.id === team.league_id)?.name || 'Unknown'
        }
      };
    }
    return { success: false };
  },

  // Admin: Update game score
  updateGameScore: async (gameId, homeScore, awayScore) => {
    await delay();
    const game = mockData.games.find(g => g.id === parseInt(gameId));
    if (game) {
      game.home_score = parseInt(homeScore);
      game.away_score = parseInt(awayScore);
      game.status = 'finished';
      return { success: true, data: game };
    }
    return { success: false, error: 'Game not found' };
  }
};

export default api;
