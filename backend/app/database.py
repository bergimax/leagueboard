from datetime import datetime
from .models import User, UserRole, League, Sport, Team, Game, GameStatus, Player

# Mock Database
class MockDatabase:
    def __init__(self):
        self.users = {
            1: {
                "id": 1,
                "email": "admin@example.com",
                "password_hash": "password123",  # Mock password (plain text for demo)
                "role": UserRole.ADMIN
            }
        }

        self.leagues = {
            1: League(id=1, name="Local Soccer League", sport=Sport.SOCCER, season=2024),
            2: League(id=2, name="Basketball Championship", sport=Sport.BASKETBALL, season=2024)
        }

        self.teams = {
            1: Team(id=1, league_id=1, name="Eagles", wins=5, losses=2, draws=1, points=16),
            2: Team(id=2, league_id=1, name="Tigers", wins=4, losses=2, draws=2, points=14),
            3: Team(id=3, league_id=1, name="Wolves", wins=3, losses=4, draws=1, points=10),
            4: Team(id=4, league_id=1, name="Panthers", wins=2, losses=5, draws=1, points=7),
            5: Team(id=5, league_id=2, name="Warriors", wins=6, losses=1, draws=0, points=18),
            6: Team(id=6, league_id=2, name="Lakers", wins=5, losses=2, draws=0, points=15),
            7: Team(id=7, league_id=2, name="Celtics", wins=4, losses=3, draws=0, points=12),
            8: Team(id=8, league_id=2, name="Nets", wins=1, losses=6, draws=0, points=3)
        }

        self.games = {
            1: Game(
                id=1, league_id=1, home_team_id=1, away_team_id=2,
                home_team="Eagles", away_team="Tigers",
                home_score=2, away_score=1,
                date=datetime(2024, 9, 5, 15, 0),
                status=GameStatus.FINISHED
            ),
            2: Game(
                id=2, league_id=1, home_team_id=3, away_team_id=4,
                home_team="Wolves", away_team="Panthers",
                home_score=1, away_score=0,
                date=datetime(2024, 9, 6, 16, 0),
                status=GameStatus.FINISHED
            ),
            3: Game(
                id=3, league_id=1, home_team_id=1, away_team_id=3,
                home_team="Eagles", away_team="Wolves",
                home_score=None, away_score=None,
                date=datetime(2024, 9, 12, 15, 0),
                status=GameStatus.SCHEDULED
            ),
            4: Game(
                id=4, league_id=2, home_team_id=5, away_team_id=6,
                home_team="Warriors", away_team="Lakers",
                home_score=108, away_score=95,
                date=datetime(2024, 9, 8, 19, 0),
                status=GameStatus.FINISHED
            ),
            5: Game(
                id=5, league_id=2, home_team_id=7, away_team_id=8,
                home_team="Celtics", away_team="Nets",
                home_score=None, away_score=None,
                date=datetime(2024, 9, 13, 19, 30),
                status=GameStatus.SCHEDULED
            )
        }

        self.players = {
            1: [
                Player(id=1, name="John Smith", number=7, position="Forward"),
                Player(id=2, name="Mike Johnson", number=10, position="Midfielder"),
                Player(id=3, name="David Brown", number=1, position="Goalkeeper")
            ],
            5: [
                Player(id=20, name="Stephen Curry", number=30, position="Point Guard"),
                Player(id=21, name="Klay Thompson", number=11, position="Shooting Guard"),
                Player(id=22, name="Draymond Green", number=23, position="Power Forward")
            ]
        }

        self._next_ids = {"users": 2, "leagues": 3, "teams": 9, "games": 6, "players": 23}

    def get_user_by_email(self, email: str) -> dict | None:
        return next((u for u in self.users.values() if u["email"] == email), None)

    def get_user_by_id(self, user_id: int) -> dict | None:
        return self.users.get(user_id)

    def get_league(self, league_id: int) -> League | None:
        return self.leagues.get(league_id)

    def get_all_leagues(self) -> list[League]:
        return list(self.leagues.values())

    def create_league(self, league: League) -> League:
        league_id = self._next_ids["leagues"]
        self._next_ids["leagues"] += 1
        league.id = league_id
        self.leagues[league_id] = league
        return league

    def get_games_by_league(self, league_id: int) -> list[Game]:
        return [g for g in self.games.values() if g.league_id == league_id]

    def get_recent_games(self, limit: int = 5) -> list[Game]:
        finished = [g for g in self.games.values() if g.status == GameStatus.FINISHED]
        return sorted(finished, key=lambda g: g.date, reverse=True)[:limit]

    def get_game(self, game_id: int) -> Game | None:
        return self.games.get(game_id)

    def update_game(self, game_id: int, home_score: int, away_score: int) -> Game | None:
        if game_id not in self.games:
            return None
        game = self.games[game_id]
        game.home_score = home_score
        game.away_score = away_score
        game.status = GameStatus.FINISHED
        return game

    def get_team(self, team_id: int) -> Team | None:
        team = self.teams.get(team_id)
        if team:
            team.roster = self.players.get(team_id, [])
        return team

    def get_standings(self, league_id: int) -> list[dict]:
        teams = [t for t in self.teams.values() if t.league_id == league_id]
        standings = []
        for team in teams:
            standings.append({
                "team_id": team.id,
                "team_name": team.name,
                "played": team.wins + team.losses + team.draws,
                "wins": team.wins,
                "losses": team.losses,
                "draws": team.draws,
                "points": team.points
            })
        return sorted(standings, key=lambda x: x["points"], reverse=True)

# Global database instance
db = MockDatabase()
